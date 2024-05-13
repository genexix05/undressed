// En server/src/index.js o donde configures tu servidor
const express = require('express');
const spiderRouter = require('./routes');  // Asegúrate de tener la ruta correcta
const app = express();

app.use('/api', spiderRouter);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

// En tu archivo server/src/index.js o donde configures tu servidor
const cors = require('cors');
app.use(cors());
