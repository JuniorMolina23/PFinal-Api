const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/',usuariosController.obtenerUsuarios)
router.post('/usuario', usuariosController.registrarUsuario);
router.post('/login', usuariosController.autenticarUsuario);
router.put('/:id', usuariosController.actualizarPerfil);

module.exports = router;
