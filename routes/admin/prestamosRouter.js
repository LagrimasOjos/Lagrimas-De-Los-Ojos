const {Router} = require('express');
const { prestamosCpanel, devueltaPrestamo, prestamoNotUserPage, crearPrestamo } = require('../../controllers/admin/prestamosController');
const router = new Router();

router.get('/', prestamosCpanel);

router.post('/devuelto', devueltaPrestamo);

router.post('/crearPrestamo', crearPrestamo);

module.exports = router;