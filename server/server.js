require("dotenv").config();
const express = require("express");
const subdomain = require("express-subdomain");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const port = 3001;

const bodyParser = require("body-parser");
const multer = require("multer");
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
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


app.get("/start_spider/:brand", (req, res) => {
  const brand = req.params.brand;
  axios
    .get(`http://localhost:5000/run_spider/${brand}`)
    .then((flaskRes) => res.send(flaskRes.data))
    .catch((err) =>
      res.status(500).send({ message: "Error al iniciar el spider", error: err.message })
    );
});

app.get("/update_spider/:brand", (req, res) => {
  const brand = req.params.brand;
  axios
    .get(`http://localhost:5000/run_spider/${brand}_update`)
    .then((flaskRes) => res.send(flaskRes.data))
    .catch((err) =>
      res.status(500).send({ message: "Error al actualizar el spider", error: err.message })
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
      { expiresIn: "5h" }
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
      message:
        "Marca registrada correctamente, se ha enviado un correo de verificación.",
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
      { expiresIn: "5h" }
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
      message:
        "Usuario registrado correctamente, se ha enviado un correo de verificación.",
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
      { expiresIn: "5h" }
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
      { expiresIn: "5h" }
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
      { expiresIn: "5h" }
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

// Guardar Uploads

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Crear Marca

app.post(
  "/create-brand",
  authenticateToken,
  upload.single("logo"),
  async (req, res) => {
    const { name, description } = req.body;

    if (req.user.role !== "brand") {
      return res
        .status(403)
        .send(
          "Acceso denegado. Solo los usuarios con el rol 'brand' pueden crear marcas."
        );
    }

    try {
      // Verifica si se ha subido un archivo
      if (!req.file) {
        return res.status(400).send("El logo de la marca es obligatorio.");
      }

      // Ruta del logo subido
      const logoPath = req.file.path;

      const [result] = await promisePool.query(
        "INSERT INTO brands (name, description, logo, owner_id) VALUES (?, ?, ?, ?)",
        [name, description, logoPath, req.user.userId]
      );

      await promisePool.query(
        "INSERT INTO brand_users (brand_id, user_id, role) VALUES (?, ?, ?)",
        [result.insertId, req.user.userId, "admin"]
      );

      res.send({
        message: "Marca creada correctamente.",
        brandId: result.insertId,
        success: true,
      });
    } catch (error) {
      console.error("Error al crear la marca:", error);
      res.status(500).send("Error al crear la marca.");
    }
  }
);

// Api

// Obtener marcas

app.get("/api/check-in-brand", authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      "SELECT 1 FROM brand_users WHERE user_id = ? LIMIT 1",
      [req.user.userId]
    );
    if (rows.length > 0) {
      res.json({ isInBrand: true });
    } else {
      res.json({ isInBrand: false });
    }
  } catch (error) {
    console.error("Error checking brand status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Obtener ID de la marca

app.get("/api/get-brand-id", authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      `SELECT bu.brand_id, b.name, b.logo
       FROM brand_users bu
       JOIN brands b ON bu.brand_id = b.id
       WHERE bu.user_id = ? LIMIT 1`,
      [req.user.userId]
    );
    if (rows.length > 0) {
      res.json({ brandId: rows[0].brand_id, brandName: rows[0].name, brandLogo: rows[0].brandLogo });
    } else {
      res.json({ brandId: null, brandName: null, brandLogo: null });
    }
  } catch (error) {
    console.error("Error retrieving brand ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Posts

app.post(
  "/api/create-post",
  authenticateToken,
  upload.array("images"),
  async (req, res) => {
    const { title, content, brandId } = req.body;
    const files = req.files;

    if (req.user.role !== "brand") {
      return res
        .status(403)
        .send(
          "Acceso denegado. Solo los usuarios con el rol 'brand' pueden crear publicaciones."
        );
    }

    if (!brandId) {
      return res.status(400).send("El ID de la marca es requerido.");
    }

    try {
      const [result] = await promisePool.query(
        "INSERT INTO posts (brand_id, title, content, created_by) VALUES (?, ?, ?, ?)",
        [brandId, title, content, req.user.userId]
      );

      if (files && files.length > 0) {
        const postId = result.insertId;
        const fileInsertQueries = files.map((file) => {
          return promisePool.query(
            "INSERT INTO post_files (post_id, file_path) VALUES (?, ?)",
            [postId, file.path]
          );
        });
        await Promise.all(fileInsertQueries);
      }

      res.send({
        message: "Publicación creada correctamente.",
        postId: result.insertId,
      });
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      res.status(500).send(`Error al crear la publicación: ${error.message}`);
    }
  }
);

// Obtener publicaciones

app.get("/api/posts", authenticateToken, async (req, res) => {
  const { page = 1, limit = 10, followed = false } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.userId;

  console.log(`Fetching posts - Page: ${page}, Limit: ${limit}, Followed: ${followed}`); // Agregado para depuración

  try {
    let query;
    let queryParams = [parseInt(limit), parseInt(offset)];

    if (followed === 'true') { // Asegurarse de comparar con el string 'true'
      query = `
        SELECT 
          p.id, 
          p.title, 
          p.content, 
          p.created_at as createdAt, 
          b.name as brandName, 
          b.logo as brandLogo, 
          (SELECT GROUP_CONCAT(file_path) FROM post_files WHERE post_id = p.id) as images,
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes  -- Añadido para contar los likes
        FROM 
          posts p 
        JOIN 
          brand_users bu ON p.created_by = bu.user_id 
        JOIN 
          brands b ON bu.brand_id = b.id 
        JOIN 
          brand_followers bf ON b.id = bf.brand_id 
        WHERE 
          bf.user_id = ? 
        ORDER BY 
          p.created_at DESC 
        LIMIT ? OFFSET ?`;
      queryParams.unshift(userId);
    } else {
      query = `
        SELECT 
          p.id, 
          p.title, 
          p.content, 
          p.created_at as createdAt, 
          b.name as brandName, 
          b.logo as brandLogo, 
          (SELECT GROUP_CONCAT(file_path) FROM post_files WHERE post_id = p.id) as images,
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes  -- Añadido para contar los likes
        FROM 
          posts p 
        JOIN 
          brand_users bu ON p.created_by = bu.user_id 
        JOIN 
          brands b ON bu.brand_id = b.id 
        ORDER BY 
          p.created_at DESC 
        LIMIT ? OFFSET ?`;
    }

    const [rows] = await promisePool.query(query, queryParams);

    const posts = rows.map((row) => ({
      ...row,
      images: row.images
        ? row.images
            .split(",")
            .map((image) => `/uploads/${path.basename(image)}`)
        : [],
      brandLogo: row.brandLogo
        ? `/uploads/${path.basename(row.brandLogo)}`
        : null,
    }));

    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put('/api/posts/:id', authenticateToken, upload.array('images', 4), async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const files = req.files;

  try {
    // Actualizar el título y el contenido de la publicación
    await promisePool.query('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id]);

    let updatedImages = [];

    if (files && files.length > 0) {
      // Eliminar las imágenes existentes
      await promisePool.query('DELETE FROM post_files WHERE post_id = ?', [id]);

      // Insertar las nuevas imágenes
      const fileInsertQueries = files.map((file) => {
        const filePath = `/uploads/${path.basename(file.path)}`;
        updatedImages.push(`http://localhost:3001${filePath}`);
        return promisePool.query('INSERT INTO post_files (post_id, file_path) VALUES (?, ?)', [id, filePath]);
      });
      await Promise.all(fileInsertQueries);
    } else {
      // Obtener las imágenes existentes si no se suben nuevas imágenes
      const [rows] = await promisePool.query('SELECT file_path FROM post_files WHERE post_id = ?', [id]);
      updatedImages = rows.map(row => `http://localhost:3001${row.file_path}`);
    }

    res.send({
      message: 'Publicación actualizada correctamente.',
      updatedImages: updatedImages,
    });
  } catch (error) {
    console.error('Error al actualizar la publicación:', error);
    res.status(500).send(`Error al actualizar la publicación: ${error.message}`);
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    await promisePool.query('DELETE FROM posts WHERE id = ?', [id]);
    await promisePool.query('DELETE FROM post_files WHERE post_id = ?', [id]);
    res.status(200).send('Publicación eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la publicación:', error);
    res.status(500).send('Error al eliminar la publicación');
  }
});

app.get("/api/brand-posts/:brandId", authenticateToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const { brandId } = req.params;
  const offset = (page - 1) * limit;
  const userId = req.user.userId;

  console.log(`Fetching posts for brand - Brand ID: ${brandId}, Page: ${page}, Limit: ${limit}`);

  try {
    const query = `
      SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at as createdAt, 
        b.name as brandName, 
        b.logo as brandLogo, 
        (SELECT GROUP_CONCAT(file_path) FROM post_files WHERE post_id = p.id) as images,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes 
      FROM 
        posts p 
      JOIN 
        brand_users bu ON p.created_by = bu.user_id 
      JOIN 
        brands b ON bu.brand_id = b.id 
      WHERE 
        b.id = ? 
      ORDER BY 
        p.created_at DESC 
      LIMIT ? OFFSET ?`;

    const [rows] = await promisePool.query(query, [brandId, parseInt(limit), parseInt(offset)]);

    const posts = rows.map((row) => ({
      ...row,
      images: row.images
        ? row.images.split(",").map((image) => `/uploads/${path.basename(image)}`)
        : [],
      brandLogo: row.brandLogo
        ? `/uploads/${path.basename(row.brandLogo)}`
        : null,
    }));

    res.json({ posts });
  } catch (error) {
    console.error("Error fetching brand posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Buscar

app.get("/api/search", authenticateToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const lowerCaseQuery = `%${query.toLowerCase()}%`;

  try {
    const [users] = await promisePool.query(
      "SELECT id, username, profile_pic FROM users WHERE LOWER(username) LIKE ?",
      [lowerCaseQuery]
    );

    const [brands] = await promisePool.query(
      "SELECT id, name, logo FROM brands WHERE LOWER(name) LIKE ?",
      [lowerCaseQuery]
    );

    const [products] = await promisePool.query(
      "SELECT id, name, image_urls, price, url FROM products WHERE LOWER(name) LIKE ?",
      [lowerCaseQuery]
    );

    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];

    const extractImageUrls = (imageUrls) => {
      const urls = [];
      let remainingUrls = imageUrls;
      while (remainingUrls) {
        let foundIndex = -1;
        let extLength = 0;
        for (let ext of imageExtensions) {
          const index = remainingUrls.indexOf(ext);
          if (index !== -1 && (foundIndex === -1 || index < foundIndex)) {
            foundIndex = index;
            extLength = ext.length;
          }
        }
        if (foundIndex !== -1) {
          urls.push(remainingUrls.substring(0, foundIndex + extLength).trim());
          remainingUrls = remainingUrls.substring(foundIndex + extLength).trim();
        } else {
          remainingUrls = null;
        }
      }
      return urls;
    };

    const fixedProducts = products.map((product) => {
      const images = product.image_urls
        ? extractImageUrls(product.image_urls)
        : [];
      return {
        ...product,
        image_urls: images,
      };
    });

    res.json({ users, brands, products: fixedProducts });
  } catch (error) {
    console.error("Error searching:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM products");
    const products = rows.map(product => ({
      ...product,
      images: product.image_urls ? product.image_urls.split(',') : []
    }));
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await promisePool.query(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = rows[0];
    product.images = product.image_urls ? product.image_urls.split(",") : []; // Ajusta esto según cómo almacenes las URLs de las imágenes

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Actualizar un producto específico por ID
app.put('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  try {
    // Obtener el precio actual del producto
    const [rows] = await promisePool.query("SELECT price FROM products WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const oldPrice = rows[0].price;
    const priceChange = oldPrice !== price;

    // Actualizar el producto
    const [result] = await promisePool.query(
      "UPDATE products SET name = ?, price = ? WHERE id = ?",
      [name, price, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Crear una notificación si el precio cambió
    if (priceChange) {
      const changeType = price > oldPrice ? 'increased' : 'decreased';
      const message = `The price of product ${name} has ${changeType}`;

      // Obtener todos los user_id que tienen este producto guardado
      const [userRows] = await promisePool.query(
        "SELECT user_id FROM saved_products WHERE product_id = ?",
        [id]
      );

      const notifications = userRows.map(userRow => [
        userRow.user_id, message, req.user.brand_id, changeType
      ]);

      // Insertar notificaciones para todos los usuarios relevantes
      await promisePool.query(
        "INSERT INTO notifications (user_id, message, brand_id, price_change) VALUES ?",
        [notifications]
      );
    }

    res.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.query("DELETE FROM products WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get("/api/brand/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [brand] = await promisePool.query(
      "SELECT * FROM brands WHERE id = ?",
      [id]
    );
    if (brand.length === 0) {
      return res.status(404).json({ error: "Brand not found" });
    }
    res.json(brand[0]);
  } catch (error) {
    console.error("Error fetching brand data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/brand-posts/:brandId", authenticateToken, async (req, res) => {
  const { brandId } = req.params;
  try {
    const [posts] = await promisePool.query(
      "SELECT * FROM posts WHERE brand_id = ? ORDER BY created_at DESC",
      [brandId]
    );
    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/profile-view", async (req, res) => {
  const { brandId } = req.body;
  try {
    await promisePool.query("INSERT INTO profile_views (brand_id) VALUES (?)", [
      brandId,
    ]);
    res.status(200).send("Profile view recorded");
  } catch (error) {
    console.error("Error recording profile view:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/api/profile-views/:brandId", authenticateToken, async (req, res) => {
  const { brandId } = req.params;
  try {
    const [views] = await promisePool.query(
      "SELECT COUNT(*) as views FROM profile_views WHERE brand_id = ? AND viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)",
      [brandId]
    );
    res.json({ views: views[0].views });
  } catch (error) {
    console.error("Error fetching profile views:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para darle "like" a una publicación
app.post("/api/posts/:id/like", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query(
      "INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)",
      [postId, userId]
    );
    res.status(200).send("Liked");
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).send("Error liking post");
  }
});

app.post("/api/posts/:id/unlike", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query(
      "DELETE FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    res.status(200).send("Unliked");
  } catch (error) {
    console.error("Error unliking post:", error);
    res.status(500).send("Error unliking post");
  }
});

// Ruta para obtener el estado inicial
app.get("/api/posts/:id/status", authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    const [likeRows] = await promisePool.query(
      "SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?",
      [postId, userId]
    );
    const [saveRows] = await promisePool.query(
      "SELECT 1 FROM saved_products WHERE product_id = ? AND user_id = ?",
      [postId, userId]
    );
    res.json({ liked: likeRows.length > 0, saved: saveRows.length > 0 });
  } catch (error) {
    console.error("Error fetching status:", error);
    res.status(500).send("Error fetching status");
  }
});

app.get("/api/brand/:brandId/stats", authenticateToken, async (req, res) => {
  const { brandId } = req.params;

  try {
    // Obtén el conteo de likes
    const [likesResult] = await promisePool.query(
      "SELECT COUNT(*) as likes FROM post_likes WHERE post_id IN (SELECT id FROM posts WHERE brand_id = ?)",
      [brandId]
    );
    const likes = likesResult[0]?.likes || 0;

    // Obtén el conteo de productos guardados
    const [savedItemsResult] = await promisePool.query(
      "SELECT COUNT(*) as savedItems FROM saved_products WHERE product_id IN (SELECT id FROM products WHERE id IN (SELECT product_id FROM post_files WHERE post_id IN (SELECT id FROM posts WHERE brand_id = ?)))",
      [brandId]
    );
    const savedItems = savedItemsResult[0]?.savedItems || 0;

    // Obtén las visitas de los últimos 7 días
    const [last7DaysVisitsResult] = await promisePool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count 
       FROM profile_views 
       WHERE brand_id = ? AND viewed_at >= CURDATE() - INTERVAL 7 DAY 
       GROUP BY DATE(viewed_at) 
       ORDER BY date`,
      [brandId]
    );

    // Transformar los resultados en un formato adecuado
    const last7DaysVisits = last7DaysVisitsResult.map(row => ({ date: row.date, count: row.count }));

    // Obtén las visitas de los últimos 30 días
    const [last30DaysVisitsResult] = await promisePool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count 
       FROM profile_views 
       WHERE brand_id = ? AND viewed_at >= CURDATE() - INTERVAL 30 DAY 
       GROUP BY DATE(viewed_at) 
       ORDER BY date`,
      [brandId]
    );

    // Transformar los resultados en un formato adecuado
    const last30DaysVisits = last30DaysVisitsResult.map(row => ({ date: row.date, count: row.count }));

    // Obtén el total de visitas
    const [totalVisitsResult] = await promisePool.query(
      `SELECT COUNT(*) as totalVisits 
       FROM profile_views 
       WHERE brand_id = ?`,
      [brandId]
    );
    const totalVisits = totalVisitsResult[0]?.totalVisits || 0;

    res.json({
      likes,
      savedItems,
      last7DaysVisits,
      last30DaysVisits,
      totalVisits,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/stats", authenticateToken, async (req, res) => {
  try {
    // Obtén el conteo total de usuarios
    const [totalUsersResult] = await promisePool.query(
      "SELECT COUNT(*) as totalUsers FROM users"
    );
    const totalUsers = totalUsersResult[0]?.totalUsers || 0;

    // Obtén las visitas de los últimos 7 días
    const [last7DaysVisitsResult] = await promisePool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count 
       FROM page_views 
       WHERE viewed_at >= CURDATE() - INTERVAL 7 DAY 
       GROUP BY DATE(viewed_at) 
       ORDER BY date`
    );

    // Transformar los resultados en un formato adecuado
    const last7DaysVisits = last7DaysVisitsResult.map(row => ({ date: row.date, count: row.count }));

    // Obtén las visitas de los últimos 30 días
    const [last30DaysVisitsResult] = await promisePool.query(
      `SELECT DATE(viewed_at) as date, COUNT(*) as count 
       FROM page_views 
       WHERE viewed_at >= CURDATE() - INTERVAL 30 DAY 
       GROUP BY DATE(viewed_at) 
       ORDER BY date`
    );

    // Transformar los resultados en un formato adecuado
    const last30DaysVisits = last30DaysVisitsResult.map(row => ({ date: row.date, count: row.count }));

    // Obtén el total de visitas
    const [totalVisitsResult] = await promisePool.query(
      `SELECT COUNT(*) as totalVisits 
       FROM page_views`
    );
    const totalVisits = totalVisitsResult[0]?.totalVisits || 0;

    res.json({
      totalUsers,
      last7DaysVisits,
      last30DaysVisits,
      totalVisits,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/page-view", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    await promisePool.query(
      "INSERT INTO page_views (user_id) VALUES (?)",
      [userId]
    );
    res.status(200).json({ message: "Page view recorded successfully" });
  } catch (error) {
    console.error("Error recording page view:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/users", authenticateToken, async (req, res) => {
  const { role, brand } = req.query;

  try {
    let query = `
      SELECT 
        users.id, 
        users.username, 
        users.email, 
        users.profile_pic, 
        users.role, 
        brands.name as brand 
      FROM 
        users 
      LEFT JOIN 
        brand_users ON users.id = brand_users.user_id 
      LEFT JOIN 
        brands ON brand_users.brand_id = brands.id
    `;
    let params = [];

    if (role || brand) {
      query += " WHERE";
      if (role) {
        query += " users.role = ?";
        params.push(role);
      }
      if (brand) {
        if (role) query += " AND";
        query += " brands.name = ?";
        params.push(brand);
      }
    }

    const [users] = await promisePool.query(query, params);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/admin/brands", authenticateToken, async (req, res) => {
  try {
    const [brands] = await promisePool.query("SELECT id, name FROM brands");
    res.json(brands);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get("/api/users", authenticateToken, async (req, res) => {
  const { brandId } = req.query;

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    const [users] = await promisePool.query(
      `SELECT u.id, u.username, u.email, u.profile_pic, bu.role, bu.created_at 
       FROM users u
       JOIN brand_users bu ON u.id = bu.user_id
       WHERE bu.brand_id = ?`,
      [brandId]
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/users/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    await promisePool.query(
      "UPDATE brand_users SET role = ? WHERE user_id = ?",
      [role, userId]
    );
    res.status(200).send("User role updated");
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).send("Error updating user role");
  }
});


app.get("/api/brandinfo/:brandId", authenticateToken, async (req, res) => {
  const { brandId } = req.params;

  if (!brandId) {
    return res.status(400).json({ error: "Brand ID is required" });
  }

  try {
    // Query to fetch the brand details
    const [brandResult] = await promisePool.query(
      "SELECT id, name, description, logo FROM brands WHERE id = ?",
      [brandId]
    );

    // Check if the brand was found
    if (brandResult.length === 0) {
      return res.status(404).json({ error: "Brand not found" });
    }

    // Queries to fetch followers, posts, and likes counts
    const [followersResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM brand_followers WHERE brand_id = ?",
      [brandId]
    );
    const [postsResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM posts WHERE brand_id = ?",
      [brandId]
    );
    const [likesResult] = await promisePool.query(
      "SELECT COUNT(*) as count FROM post_likes pl JOIN posts p ON pl.post_id = p.id WHERE p.brand_id = ?",
      [brandId]
    );

    // Constructing the response object
    const brandInfo = {
      ...brandResult[0],
      followers: followersResult[0].count,
      posts: postsResult[0].count,
      likes: likesResult[0].count,
    };

    // Sending the response
    res.json(brandInfo);
  } catch (error) {
    // Error handling
    console.error("Error fetching brand info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint para obtener los posts de una marca
app.get("/api/posts/:brandId", authenticateToken, async (req, res) => {
  const { brandId } = req.params;

  try {
    const [posts] = await promisePool.query(
      "SELECT id, title, content, created_at FROM posts WHERE brand_id = ?",
      [brandId]
    );

    const postsWithImages = await Promise.all(
      posts.map(async (post) => {
        const [images] = await promisePool.query(
          "SELECT file_path FROM post_files WHERE post_id = ?",
          [post.id]
        );
        return {
          ...post,
          images: images.map((image) => `${path.basename(image.file_path)}`),
        };
      })
    );

    res.json(postsWithImages);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/api/check-following/:brandId",
  authenticateToken,
  async (req, res) => {
    const { brandId } = req.params;
    const userId = req.user.userId;

    try {
      const [rows] = await promisePool.query(
        "SELECT COUNT(*) as count FROM brand_followers WHERE brand_id = ? AND user_id = ?",
        [brandId, userId]
      );
      res.json({ isFollowing: rows[0].count > 0 });
    } catch (error) {
      console.error("Error checking follow status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post("/api/follow", authenticateToken, async (req, res) => {
  const { brandId } = req.body;
  const userId = req.user.userId;

  console.log("ID del usuario que sigue:", userId);

  try {
    await promisePool.query(
      "INSERT INTO brand_followers (brand_id, user_id) VALUES (?, ?)",
      [brandId, userId]
    );
    res.status(200).json({ message: "Brand followed successfully" });
  } catch (error) {
    console.error("Error following brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/unfollow", authenticateToken, async (req, res) => {
  const { brandId } = req.body;
  const userId = req.user.userId;

  try {
    await promisePool.query(
      "DELETE FROM brand_followers WHERE brand_id = ? AND user_id = ?",
      [brandId, userId]
    );
    res.status(200).json({ message: "Brand unfollowed successfully" });
  } catch (error) {
    console.error("Error unfollowing brand:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Invite by username
app.post("/api/invite-username", authenticateToken, async (req, res) => {
  const { username } = req.body;
  const { brandId } = req.body;

  try {
    const [user] = await promisePool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const userId = user[0].id;

    await promisePool.query(
      "INSERT INTO notifications (user_id, message, brand_id) VALUES (?, ?, ?)",
      [userId, `You have been invited to join the brand ${brandId}`, brandId]
    );
    res.json({ message: "Invitation sent" });
  } catch (error) {
    console.error("Error inviting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Invite by email
app.post("/api/invite-email", authenticateToken, async (req, res) => {
  const { email } = req.body;
  const { brandId } = req.body;

  try {
    const inviteToken = generateInviteToken();
    await sendEmail(email, inviteToken);
    await promisePool.query(
      "INSERT INTO notifications (user_id, message, brand_id) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?)",
      [email, `You have been invited to join the brand ${brandId}`, brandId]
    );
    res.json({ message: "Invitation email sent" });
  } catch (error) {
    console.error("Error sending invitation email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Generate invitation link
app.post("/api/generate-invite-link", authenticateToken, async (req, res) => {
  const { brandId } = req.body;

  try {
    const inviteToken = generateInviteToken();
    const inviteLink = `http://localhost:3000/invite/${inviteToken}`;

    await promisePool.query(
      "INSERT INTO notifications (user_id, message, brand_id) VALUES (?, ?, ?)",
      [
        req.user.id,
        `Invitation link generated for brand ${brandId}: ${inviteLink}`,
        brandId,
      ]
    );
    res.json({ inviteLink });
  } catch (error) {
    console.error("Error generating invitation link:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Accept invitation
app.post("/api/accept-invite", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { brandId } = req.body;

  if (!userId || !brandId) {
    return res.status(400).json({ error: "User ID and Brand ID are required" });
  }

  try {
    // Inserta el usuario en la tabla brand_users
    await promisePool.query(
      'INSERT INTO brand_users (brand_id, user_id, role) VALUES (?, ?, "viewer")',
      [brandId, userId]
    );

    // Borra la notificación después de aceptar la invitación
    await promisePool.query(
      'DELETE FROM notifications WHERE user_id = ? AND brand_id = ? AND message = "You have been invited to join the brand"',
      [userId, brandId]
    );

    await promisePool.query('UPDATE users SET role = "brand" WHERE id = ?', [
      userId,
    ]);

    res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Example for an Express.js backend

app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const notificationId = req.params.id;

  if (!notificationId) {
    return res.status(400).json({ error: "Notification ID not found in request" });
  }

  try {
    const [results] = await promisePool.execute(
      'UPDATE notifications SET readed = ? WHERE id = ?',
      ['yes', notificationId]
    );

    if (results.affectedRows > 0) {
      res.sendStatus(200);
    } else {
      res.status(404).json({ error: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'An error occurred while marking the notification as read' });
  }
});

app.get('/api/notifications/unread/count', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    const [results] = await promisePool.query(
      'SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND readed = ?',
      [userId, 'no']
    );

    res.json({ unreadCount: results[0].unreadCount });
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Obtener notificaciones del usuario autenticado
app.get("/api/notifications", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in request" });
  }

  try {
    const [notifications] = await promisePool.query(
      "SELECT id, message, brand_id, created_at, readed FROM notifications WHERE user_id = ?",
      [userId]
    );

    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para verificar si un producto está guardado
app.get("/api/check-saved/:productId", authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    const [rows] = await promisePool.query(
      "SELECT COUNT(*) as count FROM saved_products WHERE product_id = ? AND user_id = ?",
      [productId, userId]
    );
    res.json({ isSaved: rows[0].count > 0 });
  } catch (error) {
    console.error("Error checking saved status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para guardar un producto
app.post("/api/save-product", authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  try {
    await promisePool.query(
      "INSERT INTO saved_products (product_id, user_id) VALUES (?, ?)",
      [productId, userId]
    );
    res.status(200).json({ message: "Product saved successfully" });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para eliminar un producto de los guardados
app.post("/api/unsave-product", authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId;

  try {
    await promisePool.query(
      "DELETE FROM saved_products WHERE product_id = ? AND user_id = ?",
      [productId, userId]
    );
    res.status(200).json({ message: "Product unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Ruta para obtener los productos guardados
app.get("/api/saved-products", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const [savedProducts] = await promisePool.query(
      `
    SELECT p.id, p.name, p.price, p.image_urls AS image
      FROM saved_products sp
      JOIN products p ON sp.product_id = p.id
      WHERE sp.user_id = ?
    `,
      [userId]
    );

    const products = savedProducts.reduce((acc, product) => {
      if (!acc[product.id]) {
        acc[product.id] = { ...product, images: [] };
      }
      acc[product.id].images.push(product.image);
      return acc;
    }, {});

    console.log("Processed products data:", products);

    res.json(Object.values(products));
  } catch (error) {
    console.error("Error fetching saved products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/userinfo/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const [userInfo] = await promisePool.query('SELECT id, username, profile_pic FROM users WHERE id = ?', [userId]);

    if (userInfo.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userInfo[0]);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/userproducts/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const [products] = await promisePool.query(`
      SELECT p.id, p.name, p.price, p.image_urls, p.url
      FROM saved_products sp
      JOIN products p ON sp.product_id = p.id
      WHERE sp.user_id = ?`, [userId]);

    res.json(products.map(product => ({
      ...product,
      image_urls: product.image_urls ? product.image_urls.split(',').map(url => url.trim()) : [],
    })));
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Node server listening at http://localhost:${port}`);
});
