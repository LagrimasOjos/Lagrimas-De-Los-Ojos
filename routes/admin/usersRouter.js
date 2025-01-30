const {Router} = require('express');
const { createUserSendPasswordEmail, userCpanel, eliminarUsuarioId } = require('../../controllers/admin/usersController');
const router = new Router();
router.get('/', userCpanel);
router.post('/crearUsuario', createUserSendPasswordEmail);
router.post('/eliminarUsuario', eliminarUsuarioId);
module.exports = router;