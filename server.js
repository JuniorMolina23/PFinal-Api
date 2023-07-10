const express = require('express');
const cors = require('cors');
const ipLogger = require('./src/middleware/ipLogger');

const app = express();
app.use(express.json());
app.use(cors());
app.use(ipLogger);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Importar rutas
const usuariosRouter = require('./src/routes/usuarios');
const trabajadoresRouter = require('./src/routes/trabajadores');
const horariosRouter = require('./src/routes/horarios');
const horarioxtrabajador = require('./src/routes/horariosxtrabajador')
const areas = require('./src/routes/areas')

// Configurar rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/trabajadores', trabajadoresRouter);
app.use('/api/horarios', horariosRouter);
app.use('/api/horariosxentidad', horarioxtrabajador);
app.use('/api/areas', areas);

// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
