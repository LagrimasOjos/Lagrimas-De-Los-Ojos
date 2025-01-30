const { Router } = require('express');
const { loggedAndRol } = require('../../middleware/user');
const router = new Router();

router.use('/public', require('./publicApiRouter')); 
router.use('/admin', [loggedAndRol(['admin'])], require('./adminApiRouter'));
router.use('/user', [loggedAndRol(['user'])], require('./userApiRouter'));


module.exports = router;