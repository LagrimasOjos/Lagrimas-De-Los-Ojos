const express = require('express');
const router = express.Router();

const {loginPage, registerPage, registerCreate, loginAccess,  existEmailRegister, forgotpasswordPage, forgotpassword, resetpasswordPage, resetpassword} = require('../../controllers/auth/authController');

router.get('/login', loginPage);
router.get('/register', registerPage);
router.get("/forgot-password", forgotpasswordPage);
router.get("/reset-password", resetpasswordPage);


router.post('/register', registerCreate);
router.post('/login', loginAccess);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password", resetpassword);
//ASINCRONO
router.post('/existEmail', existEmailRegister);



module.exports = router;