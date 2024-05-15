require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = 3001;
const SECRET_KEY = process.env.SECRET_KEY;

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

app.get("/start_spider", (req, res) => {
  axios
    .get("http://localhost:5000/run_spider/stussy")
    .then((flaskRes) => res.send(flaskRes.data))
    .catch((err) =>
      res
        .status(500)
        .send({ message: "Error al iniciar el spider", error: err.message })
    );
});

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "undressed",
});

const promisePool = pool.promise();

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    "1024131062580-n0d2kc6keh0grlh9oh5fifi632kj8kv2.apps.googleusercontent.com",
    "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",
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token:
      "1//04KFCOKT9vZjaCgYIARAAGAQSNwF-L9IrbYDE9SmgBmp7rs6xUKhpS7BuTeiPb0uMfvFOUzL0DPK8ExoLD_gYQU3OX80MPuuOBaE",
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "noreplyundressed@gmail.com",
      accessToken,
      clientId:
        "1024131062580-n0d2kc6keh0grlh9oh5fifi632kj8kv2.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//04KFCOKT9vZjaCgYIARAAGAQSNwF-L9IrbYDE9SmgBmp7rs6xUKhpS7BuTeiPb0uMfvFOUzL0DPK8ExoLD_gYQU3OX80MPuuOBaE",
    },
  });

  return transporter;
};

app.post("/register", async (req, res) => {
  const { name, surname, date, username, email, password } = req.body;
  const verificationToken = uuidv4();
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await promisePool.query(
      "INSERT INTO users (name, surname, date, username, email, password, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, surname, date, username, email, hashedPassword, verificationToken]
    );

    const token = jwt.sign(
      { userId: result.insertId, email: email },
      SECRET_KEY,
      { expiresIn: "24h" }
    );

    const verificationLink = `http://localhost:3000/verify?token=${verificationToken}`;
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: "noreplyundressed@gmail.com",
      to: email,
      subject: "Verifica tu cuenta",
      html: `<p>Gracias por registrarte! Por favor verifica tu cuenta haciendo clic en el siguiente enlace: <a href="${verificationLink}">Verificar Cuenta</a></p>`,
    });

    console.log("Correo de verificación enviado.");
    res.send({
      message:
        "Usuario registrado correctamente, se ha enviado un correo de verificación.",
      userId: result.insertId,
      token: token,
    });
  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    res.status(500).send({ error: "Error en el registro: " + error.message });
  }
});

app.get("/verify", (req, res) => {
  const { token } = req.query; // Obtener el token de verificación de la URL

  if (!token) {
    return res.status(400).send("Solicitud inválida. No se proporcionó token.");
  }

  // Consulta para verificar si el token existe y obtener el usuario correspondiente
  pool.query(
    "SELECT * FROM users WHERE verification_token = ?",
    [token],
    (error, results) => {
      if (error) {
        return res
          .status(500)
          .send({ error: "Error al verificar el usuario: " + error.message });
      }

      if (results.length === 0) {
        return res.status(404).send({ message: "Token inválido o expirado" });
      }

      const user = results[0];

      // Verificar si el usuario ya ha sido verificado
      if (user.is_verified) {
        return res.send("Esta cuenta ya ha sido verificada.");
      }

      // Actualizar el estado de verificación del usuario
      pool.query(
        "UPDATE users SET is_verified = 1",
        [user.id],
        (error, updateResults) => {
          if (error) {
            return res.status(500).send({
              error:
                "Error al actualizar el estado de verificación del usuario: " +
                error.message,
            });
          }

          res.send(
            "La cuenta ha sido verificada con éxito. Ahora puedes iniciar sesión."
          );
        }
      );
    }
  );
});

app.listen(port, () => {
  console.log(`Node server listening at http://localhost:${port}`);
});
