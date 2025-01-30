const RegistrationError = {
    errorUserExists: 'El usuario ya existe. Intenta con otro correo electrónico.',
    errorWeakPassword: 'La contraseña es demasiado débil. Asegúrate de que cumpla con los requisitos de seguridad.',
    errorInvalidEmail: 'El correo electrónico proporcionado no tiene un formato válido.',
    errorInvalidPhone: 'El numero de telefono proporcionado no tiene un formato válido.',
    errorEmptyFields: 'Todos los campos son obligatorios. Por favor completa el formulario.',
    errorUnderage: 'Debes ser mayor de edad para registrarte.',
    errorInvalidInput: 'Algunos datos proporcionados no son válidos. Verifica la información ingresada.',
    errorServerIssue: 'Hubo un problema al procesar tu solicitud. Intenta nuevamente más tarde.',
    errorUnknown: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
};

module.exports = RegistrationError;
