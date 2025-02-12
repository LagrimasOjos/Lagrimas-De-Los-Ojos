const axios = require('axios');
const verificarCaptcha = async (recaptchaToken) => {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.PRIVATEKEYCAPTCHAS, 
                response: recaptchaToken,    
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });

        const { success } = response.data;

        if (success) {
            return true; 
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
};
module.exports = { verificarCaptcha }