const { Router } = require('express');
const { addPage, updatePage, indexPage, addCreate } = require('../../controllers/admin/semillasController');
const { cpanelAdminPage } = require('../../controllers/admin');
const router = new Router();

router.get('/', cpanelAdminPage); //CPANEL ADMIN

router.use('/semillas',require('./semillasRouter'));
router.use('/usuarios',require('./usersRouter')); 
router.use('/prestamos',require('./prestamosRouter'));
router.use('/reservas',require('./reservasRouter')); 
router.use('/preferences',require('./preferencesRouter')); 


module.exports = router;