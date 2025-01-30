const createPassword = () => {
    const length = 12; // Longitud mínima de la contraseña
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
};

const sendEmail = async ({ to, subject, text='', html=''}) => {
    const nodemailer = require('nodemailer');
    try {
        // Configuración del transportador de correo para Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Usamos el servicio de Gmail
            auth: {
                user: 'lagrimasdelosojos@gmail.com', // Tu dirección de Gmail
                pass: 'ries ckcg inap fhmt', // Tu contraseña o contraseña de aplicación
            },
            tls: {
                rejectUnauthorized: false,
            }
        });

        // Detalles del correo
        const mailOptions = {
            from: '"Lagrimas de los ojos" lagrimasdelosojos@gmail.com', // Nombre y correo del remitente
            to,
            subject,
            text,
            html
        };

    
        // Enviar el correo
        const info = await transporter.sendMail(mailOptions);
        console.log(`Correo enviado: ${info.messageId}`);
        return true
    } catch (error) {
        console.error('Error enviando correo:', error);
        return false
    }
};
module.exports = { createPassword, sendEmail };
