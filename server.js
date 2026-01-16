const express = require('express');
const app = express();
// Render nos dice en qué puerto escuchar a través de esta variable.
const port = process.env.PORT || 3000;

// Cuando alguien entra a la página principal ('/'), envía un saludo.
app.get('/', (req, res) => {
  res.send('¡Hola! Esta es mi primera aplicación desplegada en Render.');
});

// Le decimos a la aplicación que empiece a "escuchar" en el puerto.
app.listen(port, () => {
  console.log(`Aplicación Node.js lista en el puerto ${port}`);
});
