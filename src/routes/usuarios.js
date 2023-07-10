const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

router.get('/',usuariosController.obtenerUsuarios);
router.get('/:usuCodigo/perfil', usuariosController.verPerfil);
router.post('/login', usuariosController.autenticarUsuario);
router.post('/actualizar-password',usuariosController.cambiarPassword);
router.post('/', usuariosController.registrarUsuario);
router.put('/:id', usuariosController.actualizarPerfil);

module.exports = router;