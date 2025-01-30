const {Router} = require('express');
const { updatePage, indexPage, addCreate, updateSemilla, deleteSemilla } = require('../../controllers/admin/semillasController');
const router = new Router();

router.get('/', indexPage);

router.get('/update/:id', updatePage);

router.post('/update/:id', updateSemilla);

router.post('/delete/:id', deleteSemilla);

router.post('/addCreate', addCreate);

module.exports = router;