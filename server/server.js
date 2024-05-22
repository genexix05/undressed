require("dotenv").config();
const express = require("express");
const subdomain = require("express-subdomain");
const axios = require("axios");
const app = express();
const cors = require("cors");
const port = 3001;
const mysql = require("mysql2");

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const authenticateToken = require("../src/middleware/authMiddleware");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://business.localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
module.exports = promisePool;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.EMAIL_CLIENT_ID,
    process.env.EMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.EMAIL_REFRESH_TOKEN,
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
      user: process.env.EMAIL_USER,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
    },
  });
  return transporter;
};

// Registro de Marcas

app.post("/register-brand", async (req, res) => {
  console.log("Registro de marca solicitado");
  const { name, surname, date, username, email, password } = req.body;
  const verificationToken = uuidv4();
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await promisePool.query(
      "INSERT INTO users (name, surname, date, username, email, password, role, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        surname,
        date,
        username,
        email,
        hashedPassword,
        "brand",
        verificationToken,
      ]
    );

    const accessToken = jwt.sign(
      { userId: result.insertId, email: email, role: "brand" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: result.insertId, email: email, role: "brand" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await promisePool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [result.insertId, refreshToken, expiresAt]
    );

    const verificationLink = `http://localhost:3001/verify?token=${verificationToken}`;
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu cuenta",
      html: `<p>Gracias por registrarte! Por favor verifica tu cuenta haciendo clic en el siguiente enlace: <a href="${verificationLink}">Verificar Cuenta</a></p>`,
    });

    console.log("Correo de verificación enviado.");
    res.send({
      message: "Marca registrada correctamente, se ha enviado un correo de verificación.",
      userId: result.insertId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    res.status(500).send({ error: "Error en el registro: " + error.message });
  }
});

// Registro Usuarios

app.post("/register", async (req, res) => {
  const { name, surname, date, username, email, password } = req.body;
  const verificationToken = uuidv4();
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await promisePool.query(
      "INSERT INTO users (name, surname, date, username, email, password, role, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        surname,
        date,
        username,
        email,
        hashedPassword,
        "user",
        verificationToken,
      ]
    );

    const accessToken = jwt.sign(
      { userId: result.insertId, email: email, role: "user" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: result.insertId, email: email, role: "user" },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await promisePool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [result.insertId, refreshToken, expiresAt]
    );

    const verificationLink = `http://localhost:3001/verify?token=${verificationToken}`;
    const transporter = await createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verifica tu cuenta",
      html: `<p>Gracias por registrarte! Por favor verifica tu cuenta haciendo clic en el siguiente enlace: <a href="${verificationLink}">Verificar Cuenta</a></p>`,
    });

    console.log("Correo de verificación enviado.");
    res.send({
      message: "Usuario registrado correctamente, se ha enviado un correo de verificación.",
      userId: result.insertId,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    res.status(500).send({ error: "Error en el registro: " + error.message });
  }
});


// Verificación de Usuarios por correo

app.get("/verify", async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res
      .status(400)
      .json({ error: "Solicitud inválida. No se proporcionó token." });
  }

  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM users WHERE verification_token = ?",
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Token inválido o expirado" });
    }

    const user = rows[0];

    if (user.is_verified === "true") {
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      return res.redirect(
        `http://localhost:3000/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
      );
    }

    await promisePool.query(
      "UPDATE users SET is_verified = 'true', verification_token = NULL WHERE id = ?",
      [user.id]
    );

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(
      `http://localhost:3000/home?accessToken=${accessToken}&refreshToken=${refreshToken}`
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al verificar el usuario: " + error.message });
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).send("Credenciales incorrectas");
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send("Credenciales incorrectas");
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días
    await promisePool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res
      .status(500)
      .send({ error: "Error en el inicio de sesión: " + error.message });
  }
});

app.post("/token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  const [rows] = await promisePool.query(
    "SELECT * FROM refresh_tokens WHERE token = ?",
    [refreshToken]
  );

  if (rows.length === 0) return res.sendStatus(403);

  const storedToken = rows[0];
  if (new Date(storedToken.expires_at) < new Date()) {
    await promisePool.query("DELETE FROM refresh_tokens WHERE id = ?", [
      storedToken.id,
    ]);
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const newAccessToken = jwt.sign(
      { userId: user.userId, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken: newAccessToken });
  });
});


// Cosas de la cuenta

app.delete("/deleteAccount", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [result] = await promisePool.query("DELETE FROM users WHERE id = ?", [
      userId,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cuenta no encontrada." });
    }
    await promisePool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [
      userId,
    ]);
    res.json({ message: "Cuenta eliminada correctamente." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar la cuenta: " + error.message });
  }
});

app.post("/logout", authenticateToken, async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const [result] = await promisePool.query(
      "DELETE FROM refresh_tokens WHERE token = ?",
      [refreshToken]
    );
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ error: "Token de actualización no encontrado." });
    }
    res.sendStatus(204);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al cerrar la sesión: " + error.message });
  }
});

app.get("/me", authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT name, surname, date, username, email FROM users WHERE id = ?",
      [req.user.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({
      error: "Error al obtener los datos del usuario: " + error.message,
    });
  }
});

app.post("/update", authenticateToken, async (req, res) => {
  const { name, surname, date, username, email } = req.body;
  try {
    const [result] = await promisePool.query(
      "UPDATE users SET name = ?, surname = ?, date = ?, username = ?, email = ? WHERE id = ?",
      [name, surname, date, username, email, req.user.userId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.json({ message: "Información actualizada correctamente." });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar los datos del usuario: " + error.message,
    });
  }
});


// Registro de marcas

// Endpoint para crear una nueva marca
app.post("/create-brand", authenticateToken, async (req, res) => {
  const { name } = req.body;

  if (req.user.role !== 'brand') {
    return res.status(403).send("Acceso denegado. Solo los usuarios con el rol 'brand' pueden crear marcas.");
  }

  try {
    const [result] = await promisePool.query(
      "INSERT INTO brands (name, owner_id) VALUES (?, ?)",
      [name, req.user.userId]
    );

    await promisePool.query(
      "INSERT INTO brand_users (brand_id, user_id, role) VALUES (?, ?, ?)",
      [result.insertId, req.user.userId, 'admin']
    );

    res.send({ message: "Marca creada correctamente.", brandId: result.insertId });
  } catch (error) {
    console.error("Error al crear la marca:", error);
    res.status(500).send("Error al crear la marca.");
  }
});


// Invitar usuarios a marcas

app.post("/invite-user-to-brand", authenticateToken, async (req, res) => {
  const { brandId, userId, role } = req.body;
  const invitationToken = uuidv4();

  try {
    const [result] = await promisePool.query(
      "INSERT INTO brand_users (brand_id, user_id, role, invitation_token) VALUES (?, ?, ?, ?)",
      [brandId, userId, role, invitationToken]
    );

    res.send({
      message: "Usuario invitado correctamente",
      invitationToken: invitationToken
    });
  } catch (error) {
    console.error("Error al invitar usuario a la marca:", error);
    res.status(500).send({ error: "Error en la invitación: " + error.message });
  }
});



app.listen(port, () => {
  console.log(`Node server listening at http://localhost:${port}`);
});
