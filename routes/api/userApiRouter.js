const {Router} = require('express');
const { prestamosUser, ultimoPrestamoActualizado } = require('../../controllers/api/user/userApiController');
const router = new Router();
router.get('/prestamos', prestamosUser);
router.post('/ultimo-prestamo', ultimoPrestamoActualizado);
module.exports = router;