const express = require('express');
const router = express.Router();
const trabajadoresController = require('../controllers/trabajadoresController');

router.get('/', trabajadoresController.obtenerTrabajadores);
router.post('/', trabajadoresController.crearTrabajador);
router.put('/:id', trabajadoresController.actualizarTrabajador);
router.delete('/:id', trabajadoresController.eliminarTrabajador);

module.exports = router;
