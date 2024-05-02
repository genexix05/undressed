// routes.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/start-scrapy', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5001/run_spider/spider_name');
        res.send(response.data);
    } catch (error) {
        console.error('Error al llamar a Flask:', error);
        res.status(500).send('Error al ejecutar el spider');
    }
});

module.exports = router;
