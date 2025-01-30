const {Router} = require('express');
const {reservasEmailFind, prestamosEmailFind } = require('../../controllers/api/admin/adminApiController');
const router = new Router();

router.get('/reservasEmailFind', reservasEmailFind);
router.get('/prestamosEmailFind', prestamosEmailFind);

module.exports = router;