const {Router} = require('express');
const { reservasUserId } = require('../../controllers/api/admin/adminApiController');
const router = new Router();

router.get('/reservarsUserId', reservasUserId);

module.exports = router;