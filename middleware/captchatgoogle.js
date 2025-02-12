const { verificarCaptcha } = require("../helper/validarCaptchat");

const validarCaptchat = async (req, res, next) => {
    const { 'g-recaptcha-response': recaptchaToken } = req.body;
    const esValido = await verificarCaptcha(recaptchaToken);

    if (esValido) {
        return next();
    } else {
        return res.status(400).json({ error: 'Captcha no válido o no resuelto correctamente' });
    }
};

module.exports = {validarCaptchat}