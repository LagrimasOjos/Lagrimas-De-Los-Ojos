const {Router} = require('express');
const { modificarPreferencias } = require('../../controllers/admin/preferences');
const router = new Router();
router.post('/modificar', modificarPreferencias);
module.exports = router;