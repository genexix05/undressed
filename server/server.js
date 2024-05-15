const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001; // Asegúrate de que este puerto no choque con otros servicios
const mysql = require('mysql');
const bcrypt = require('bcrypt');

app.use(cors());
app.use(bodyParser.json());

app.get('/start_spider', (req, res) => {
    axios.get('http://localhost:5000/run_spider/stussy')
        .then(flaskRes => res.send(flaskRes.data))
        .catch(err => res.status(500).send({ message: 'Error al iniciar el spider', error: err.message }));
});

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'undressed'
});

// server.js
app.post('/register', (req, res) => {
    const { name, surname, date, username, email, password } = req.body;
    // Aquí deberías hashear la contraseña antes de almacenarla usando bcrypt
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            return res.status(500).send({ error: 'Error al hashear la contraseña' });
        }
        pool.query(
            'INSERT INTO users (name, surname, date, username, email, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, surname, date, username, email, hashedPassword],
            (error, results) => {
                if (error) {
                    return res.status(500).send({ error: 'Error registrando el usuario: ' + error.message });
                }
                res.send({ message: 'Usuario registrado correctamente', userId: results.insertId });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Node server listening at http://localhost:${port}`);
});