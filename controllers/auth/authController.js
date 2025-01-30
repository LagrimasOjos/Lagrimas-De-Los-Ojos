const { buscarErrorMensaje } = require('../../errors/Messages');
const User = require('../../models/db/user');

const loginPage = (req, res) => {
    return res.view('public/login', { title: 'Login' });
}

const registerPage = (req, res) => {
    return res.view('public/register', { title: 'Register' });
}

const loginAccess = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userLogin = await User.loginUser({ email, password });
        req.session.userId = userLogin._id;
        req.session.user = { rol: userLogin.rol, username: userLogin.username };
        return res.redirectMessage('/', 'Te has logeado correctamente');
    } catch (e) {
        return res.redirectMessage('/auth/login', buscarErrorMensaje(e.message));
    }
}

const existEmailRegister = async (req, res) => {
    try {
        const existEmail = await User.existEmailRegister(req.body.email);

        return res.json({status:existEmail});

    } catch (error) {
        return res.json({status:true, msg:error.message});
    }
}

const registerCreate = async (req, res) => {
    try {
        const { name, phone, email, password, repassword } = req.body;
        const newUser = await User.registerUser({ name, phone, email, password, repassword });
        req.session.userId = newUser._id;
        req.session.user = { rol: newUser.rol, username: newUser.username };
        return res.redirectMessage('/', 'Te has registrado correctamente');
    } catch (e) {
        return res.redirectMessage('/auth/register', buscarErrorMensaje(e.message));
    }
}


const logout = (req, res) => {
    res.clearCookie('connect.sid');

    if (req.session.user) {
        delete req.session.user;
    }
    if (req.session.userId) {
        delete req.session.userId;
    }

    return req.session.save((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesion');
        }
        return res.redirectMessage('/', 'Has cerrado sesion');
    });
}

module.exports = { loginPage, registerPage, registerCreate, loginAccess, logout, existEmailRegister }