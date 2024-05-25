const jwt = require('jsonwebtoken');
const promisePool = require('../config/db'); // Ajusta la ruta según tu configuración

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log("No token provided");
    return res.sendStatus(401); // No se proporcionó token
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
    if (err) {
      console.log("Invalid token:", err.message);
      return res.sendStatus(403); // El token no es válido o ha expirado
    }

    try {
      const [rows] = await promisePool.query("SELECT * FROM users WHERE id = ?", [user.userId]);
      if (rows.length === 0) {
        console.log("User not found in database");
        return res.status(404).json({ error: "Usuario no encontrado." });
      }
    } catch (queryError) {
      console.error("Database query error:", queryError);
      return res.status(500).json({ error: "Error interno del servidor." });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
