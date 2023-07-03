const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/',usuariosController.obtenerUsuarios)
router.post('/login', usuariosController.registrarUsuario);
router.post('/usuarios', usuariosController.autenticarUsuario);
router.put('/:id', usuariosController.actualizarPerfil);

module.exports = router;
