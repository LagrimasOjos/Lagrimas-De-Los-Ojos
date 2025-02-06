const express = require('express');
const router = express.Router();

const {loginPage, registerPage, registerCreate, loginAccess, preRegisterCheck, existEmailRegister, forgotpasswordPage, forgotpassword} = require('../../controllers/auth/authController');

router.get('/login', loginPage);
router.get('/register', registerPage);
router.get("/forgot-password", forgotpasswordPage);

router.post('/register', registerCreate);
router.post('/login', loginAccess);
router.post("/forgot-password", forgotpassword);
//ASINCRONO
router.post('/existEmail', existEmailRegister);



module.exports = router;