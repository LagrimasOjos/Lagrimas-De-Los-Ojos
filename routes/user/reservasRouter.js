const {Router} = require('express');
const { reservarIdPage, reservarId, reservasCpanel, reservaCancelar } = require('../../controllers/user/userController');
const router = new Router();

router.get('/', reservasCpanel);
router.post('/cancelar', reservaCancelar);
router.get('/:id', reservarIdPage);
router.post('/:id', reservarId); //Crear reserva


module.exports = router;