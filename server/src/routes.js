// En tu archivo de rutas de Node.js (por ejemplo, server/src/routes.js)
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/start-spider', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5001/run_spider/stussy');
        res.json(response.data);  // Asegúrate de que response.data es un objeto JSON
    } catch (error) {
        console.error('Error al iniciar el spider:', error);
        res.status(500).json({ message: 'Error al iniciar el spider', error: error.message });
    }
});


module.exports = router;
