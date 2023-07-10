const express = require('express');
const router = express.Router();
const horariosxtraController = require('../controllers/horariosxtraController');

router.get('/', horariosxtraController.obtenerHorariosxEntidad);
router.get('/:id', horariosxtraController.obtenerHorarioPorId);
router.post('/:trabajadorId', horariosxtraController.crearHorarioxentidad);
router.put('/:id', horariosxtraController.actualizarHorarioxentidad);
router.delete('/:hxe_id', horariosxtraController.eliminarHorarioxentidad);

module.exports = router;