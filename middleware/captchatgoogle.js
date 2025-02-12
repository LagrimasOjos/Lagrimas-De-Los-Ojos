const { verificarCaptcha } = require("../helper/validarCaptchat");

const validarCaptchat = async (req, res, next) => {
    const { 'g-recaptcha-response': recaptchaToken } = req.body;
    const esValido = await verificarCaptcha(recaptchaToken);

    if (esValido) {
        return next();
    } else {
        return res.redirectMessage('/','Debes completar el captchat correctamente');
    }
};

module.exports = {validarCaptchat}