const express = require('express');
const app = express();
const port = 3001; // Utiliza un puerto diferente al del cliente de React

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
