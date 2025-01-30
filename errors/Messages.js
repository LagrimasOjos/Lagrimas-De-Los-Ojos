const LoginError = require("./LoginError");
const PreferencesError = require("./PreferencesError");
const PrestamoError = require("./PrestamosError");
const RegistrationError = require("./RegisterError");
const ReservasError = require("./ReservasError");
const SemillaError = require("./SemillaError");



const MessagesError = {
    "Login":{...LoginError},
    "Register":{...RegistrationError},
    "Semilla":{...SemillaError},
    "Reservas":{...ReservasError},
    "Prestamos":{...PrestamoError},
    "Preferences":{...PreferencesError}
}


function buscarErrorMensaje(errorKey) {

    if(!errorKey) return "Hubo un error inesperado"; 

    for (const category in MessagesError) {
        if (MessagesError.hasOwnProperty(category)) {
            const subCategory = MessagesError[category];

            for (const error in subCategory) {
                if (subCategory[error] === errorKey) {
                    return subCategory[error]; 
                }
            }
        }
    }
    
    return "Hubo un error inesperado"; 
}

module.exports = {MessagesError, buscarErrorMensaje};