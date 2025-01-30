const express = require('express');
const router = express.Router();

const {loginPage, registerPage, registerCreate, loginAccess, preRegisterCheck, existEmailRegister} = require('../../controllers/auth/authController');

router.get('/login', loginPage);
router.get('/register', registerPage);

router.post('/register', registerCreate);
router.post('/login', loginAccess);

//ASINCRONO
router.post('/existEmail', existEmailRegister);

module.exports = router;