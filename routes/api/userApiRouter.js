const {Router} = require('express');
const { prestamosUser, ultimoPrestamoActualizado, reservarId } = require('../../controllers/api/user/userApiController');
const router = new Router();
router.get('/prestamos', prestamosUser);
router.post('/ultimo-prestamo', ultimoPrestamoActualizado);
router.post('/reservarId/:id', reservarId);
module.exports = router;