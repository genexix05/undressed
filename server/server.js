require("dotenv").config();
const express = require("express");
const subdomain = require("express-subdomain");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2");
const path = require('path');
const app = express();
const port = 3001;

const bodyParser = require("body-parser");
const multer = require('multer');
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
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Crear Marca

app.post("/create-brand", authenticateToken, upload.single('logo'), async (req, res) => {
  const { name, description } = req.body;

  if (req.user.role !== 'brand') {
    return res.status(403).send("Acceso denegado. Solo los usuarios con el rol 'brand' pueden crear marcas.");
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
      [result.insertId, req.user.userId, 'admin']
    );

    res.send({ message: "Marca creada correctamente.", brandId: result.insertId, success: true });
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

// Api

// Obtener marcas

app.get('/api/check-in-brand', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT 1 FROM brand_users WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );
    if (rows.length > 0) {
      res.json({ isInBrand: true });
    } else {
      res.json({ isInBrand: false });
    }
  } catch (error) {
    console.error('Error checking brand status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Obtener ID de la marca

app.get('/api/get-brand-id', authenticateToken, async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT brand_id FROM brand_users WHERE user_id = ? LIMIT 1',
      [req.user.userId]
    );
    if (rows.length > 0) {
      res.json({ brandId: rows[0].brand_id });
    } else {
      res.json({ brandId: null });
    }
  } catch (error) {
    console.error('Error retrieving brand ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Posts

app.post("/api/create-post", authenticateToken, upload.array('images'), async (req, res) => {
  const { title, content, brandId } = req.body;
  const files = req.files;

  if (req.user.role !== 'brand') {
    return res.status(403).send("Acceso denegado. Solo los usuarios con el rol 'brand' pueden crear publicaciones.");
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
      const fileInsertQueries = files.map(file => {
        return promisePool.query(
          "INSERT INTO post_files (post_id, file_path) VALUES (?, ?)",
          [postId, file.path]
        );
      });
      await Promise.all(fileInsertQueries);
    }

    res.send({ message: "Publicación creada correctamente.", postId: result.insertId });
  } catch (error) {
    console.error("Error al crear la publicación:", error);
    res.status(500).send(`Error al crear la publicación: ${error.message}`);
  }
});

// Obtener publicaciones

app.get('/api/posts', authenticateToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [rows] = await promisePool.query(
      `SELECT 
        p.id, 
        p.title, 
        p.content, 
        p.created_at as createdAt, 
        b.name as brandName, 
        b.logo as brandLogo, 
        (SELECT GROUP_CONCAT(file_path) FROM post_files WHERE post_id = p.id) as images 
      FROM 
        posts p 
      JOIN 
        brand_users bu ON p.created_by = bu.user_id 
      JOIN 
        brands b ON bu.brand_id = b.id 
      ORDER BY 
        p.created_at DESC 
      LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    const posts = rows.map(row => ({
      ...row,
      images: row.images ? row.images.split(',').map(image => `/uploads/${path.basename(image)}`) : [],
      brandLogo: row.brandLogo ? `/uploads/${path.basename(row.brandLogo)}` : null
    }));

    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Buscar

app.get('/api/search', authenticateToken, async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const lowerCaseQuery = `%${query.toLowerCase()}%`;

  try {
    const [users] = await promisePool.query(
      'SELECT id, username, profile_pic FROM users WHERE LOWER(username) LIKE ?',
      [lowerCaseQuery]
    );

    const [brands] = await promisePool.query(
      'SELECT id, name, logo FROM brands WHERE LOWER(name) LIKE ?',
      [lowerCaseQuery]
    );

    const [products] = await promisePool.query(
      'SELECT id, name, image_urls, price FROM products WHERE LOWER(name) LIKE ?',
      [lowerCaseQuery]
    );

    // Parsear las URLs de las imágenes
    const fixedProducts = products.map(product => {
      const images = product.image_urls ? product.image_urls.split(',').map(url => url.trim()) : [];
      return {
        ...product,
        image_urls: images.length > 0 ? images : []
      };
    });

    res.json({ users, brands, products: fixedProducts });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await promisePool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = rows[0];
    product.images = product.image_urls.split(','); // Ajusta esto según cómo almacenes las URLs de las imágenes

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/brand/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [brand] = await promisePool.query('SELECT * FROM brands WHERE id = ?', [id]);
    if (brand.length === 0) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    res.json(brand[0]);
  } catch (error) {
    console.error('Error fetching brand data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/brand-posts/:brandId', authenticateToken, async (req, res) => {
  const { brandId } = req.params;
  try {
    const [posts] = await promisePool.query('SELECT * FROM posts WHERE brand_id = ? ORDER BY created_at DESC', [brandId]);
    res.json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/profile-view', async (req, res) => {
  const { brandId } = req.body;
  try {
    await promisePool.query('INSERT INTO profile_views (brand_id) VALUES (?)', [brandId]);
    res.status(200).send('Profile view recorded');
  } catch (error) {
    console.error('Error recording profile view:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/api/profile-views/:brandId', authenticateToken, async (req, res) => {
  const { brandId } = req.params;
  try {
    const [views] = await promisePool.query(
      'SELECT COUNT(*) as views FROM profile_views WHERE brand_id = ? AND viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [brandId]
    );
    res.json({ views: views[0].views });
  } catch (error) {
    console.error('Error fetching profile views:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta para darle "like" a una publicación
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
    res.status(200).send('Liked');
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).send('Error liking post');
  }
});

app.post('/api/posts/:id/unlike', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    res.status(200).send('Unliked');
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).send('Error unliking post');
  }
});

// Rutas para manejar guardar productos
app.post('/api/products/:id/save', authenticateToken, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query('INSERT INTO saved_products (product_id, user_id) VALUES (?, ?)', [productId, userId]);
    res.status(200).send('Saved');
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).send('Error saving product');
  }
});

app.post('/api/products/:id/unsave', authenticateToken, async (req, res) => {
  const productId = req.params.id;
  const userId = req.user.userId;
  try {
    await promisePool.query('DELETE FROM saved_products WHERE product_id = ? AND user_id = ?', [productId, userId]);
    res.status(200).send('Unsaved');
  } catch (error) {
    console.error('Error unsaving product:', error);
    res.status(500).send('Error unsaving product');
  }
});

// Ruta para obtener el estado inicial
app.get('/api/posts/:id/status', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  try {
    const [likeRows] = await promisePool.query('SELECT 1 FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
    const [saveRows] = await promisePool.query('SELECT 1 FROM saved_products WHERE product_id = ? AND user_id = ?', [postId, userId]);
    res.json({ liked: likeRows.length > 0, saved: saveRows.length > 0 });
  } catch (error) {
    console.error('Error fetching status:', error);
    res.status(500).send('Error fetching status');
  }
});


// Ruta para guardar un producto
app.post('/api/products/:productId/save', authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  try {
    await promisePool.query(
      'INSERT INTO saved_products (product_id, user_id) VALUES (?, ?)',
      [productId, userId]
    );
    res.status(200).json({ message: 'Product saved successfully' });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.listen(port, () => {
  console.log(`Node server listening at http://localhost:${port}`);
});
