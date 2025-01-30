const {Router} = require('express');
const { paginateSeeds, userLogin } = require('../../controllers/api/public/publicApiController');
const router = new Router();
router.get('/paginateSeeds', paginateSeeds);
router.get('/userActive', userLogin);
module.exports = router;