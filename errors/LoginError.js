const LoginError = {
    errorPassword: 'La contraseña proporcionada es incorrecta.',
    errorUserNotFound: 'El usuario no existe. Verifica el correo o regístrate.',
    errorUserDisabled: 'La cuenta está deshabilitada. Contacta con soporte.',
    errorTooManyAttempts: 'Demasiados intentos fallidos. Intenta nuevamente más tarde.',
    errorEmptyFields: 'Todos los campos son obligatorios. Por favor completa el formulario.',
    errorInvalidEmail: 'El correo electrónico no tiene un formato válido.',
    errorAccountLocked: 'La cuenta está bloqueada temporalmente. Revisa tu correo para más información.',
    errorUnknown: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
};

module.exports = LoginError;