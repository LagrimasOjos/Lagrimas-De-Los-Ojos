const {Router} = require('express');
const { prestamosCpanel } = require('../../controllers/user/prestamosController');
const router = new Router();

router.get('/', prestamosCpanel);

module.exports = router;