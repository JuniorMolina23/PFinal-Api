const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/',usuariosController.obtenerUsuarios)
router.post('/login', usuariosController.autenticarUsuario);
router.post('/', usuariosController.registrarUsuario);
router.put('/:id', usuariosController.actualizarPerfil);

module.exports = router;
