const {Router} = require('express');
const { paginateSeeds, userLogin, seedId } = require('../../controllers/api/public/publicApiController');
const router = new Router();
router.get('/paginateSeeds', paginateSeeds);
router.get('/userActive', userLogin);
router.get('/seedId',seedId);
module.exports = router;