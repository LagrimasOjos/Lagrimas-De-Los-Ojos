
const User = require("../models/db/user");

const loggedAndRol = (ArrayRolesAccess) => {
    return async (req, res, next) => {

        if(!Array.isArray(ArrayRolesAccess)){
            return res.redirectMessage('/','Error del servidor... intentalo de nuevo mas tarde');
        }

        if (!req.session.userId || !req.session.user.rol) {
            return res.redirectMessage('/auth/login','Debes iniciar sesion para poder acceder');
        }

        const user = await User.findById(req.session.userId);

        if (!user || !user.activo) {
            return res.redirectMessage('/','Tu cuenta esta inactiva o usuario no existente');
        }

        if(!ArrayRolesAccess.includes(req.session.user.rol)){
            return res.redirectMessage('/',' Acceso restringido');
        }
        
        return next();
    };
};

const notLogged = (req, res, next) => {
    if (req.session.userId) {
        return res.redirectMessage('/', 'Ya has iniciado sesion');
    }

    return next();
}

module.exports = {loggedAndRol, notLogged}
