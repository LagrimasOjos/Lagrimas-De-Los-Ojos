const {Router} = require('express');
const {reservasEmailFind, prestamosEmailFind, usuariosEmailFind } = require('../../controllers/api/admin/adminApiController');
const router = new Router();

router.get('/reservasEmailFind', reservasEmailFind);

router.get('/prestamosEmailFind', prestamosEmailFind);

router.get('/usuariosEmailFind', usuariosEmailFind);

module.exports = router;