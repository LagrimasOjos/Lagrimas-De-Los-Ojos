const {Router} = require('express');
const { reservasCpanel, confirmarReserva, crearReserva, cancelarReserva } = require('../../controllers/admin/reservasController.');
const router = new Router();
router.get('/', reservasCpanel);
router.post('/atender/', confirmarReserva);
router.post('/crearReserva', crearReserva);
router.post('/cancelar', cancelarReserva);

module.exports = router;