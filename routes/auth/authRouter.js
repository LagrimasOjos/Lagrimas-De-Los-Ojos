const express = require('express');
const router = express.Router();

const {loginPage, registerPage, registerCreate, loginAccess,  existEmailRegister, forgotpasswordPage, forgotpassword, resetpasswordPage, resetpassword} = require('../../controllers/auth/authController');
const { validarCaptchat } = require('../../middleware/captchatgoogle');

router.get('/login', loginPage);
router.get('/register', registerPage);
router.get("/forgot-password", forgotpasswordPage);
router.get("/reset-password", resetpasswordPage);


router.post('/register', validarCaptchat, registerCreate);
router.post('/login', validarCaptchat, loginAccess);
router.post("/forgot-password", validarCaptchat, forgotpassword);
router.post("/reset-password", validarCaptchat, resetpassword);


router.post('/existEmail', existEmailRegister);



module.exports = router;