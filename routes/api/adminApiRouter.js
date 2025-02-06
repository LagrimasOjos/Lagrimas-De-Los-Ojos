const {Router} = require('express');
const {reservasEmailFind, prestamosEmailFind, usuariosEmailFind, deletePhotoIdSeed } = require('../../controllers/api/admin/adminApiController');
const router = new Router();

router.get('/reservasEmailFind', reservasEmailFind);

router.get('/prestamosEmailFind', prestamosEmailFind);

router.get('/usuariosEmailFind', usuariosEmailFind);

router.post('/deletePhotoIdSeed', deletePhotoIdSeed);

module.exports = router;