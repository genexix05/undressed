const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 3001; // Asegúrate de que este puerto no choque con otros servicios

app.use(cors());

app.get('/start_spider', (req, res) => {
    axios.get('http://localhost:5000/run_spider/stussy')
        .then(flaskRes => res.send(flaskRes.data))
        .catch(err => res.status(500).send({ message: 'Error al iniciar el spider', error: err.message }));
});

app.listen(port, () => {
    console.log(`Node server listening at http://localhost:${port}`);
});
