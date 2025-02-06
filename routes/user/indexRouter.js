const { Router } = require('express');
const { userCpanel, userDetails } = require('../../controllers/user/userController.js');
const router = new Router();

router.get('/', userCpanel); //CPANEL ADMIN
router.get('/details', userDetails);
router.use('/prestamos',require('./prestamosRouter.js'));
router.use('/reservas',require('./reservasRouter.js'));


module.exports = router;