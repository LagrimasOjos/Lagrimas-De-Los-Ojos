const { buscarErrorMensaje } = require('../../errors/Messages');
const { generarJWT, validarJWT } = require('../../helper/utils');
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

const forgotpasswordPage = (req, res) => {
    return res.view("public/forgotPassword.ejs", { title: "Olvidar contraseña" });
}

const forgotpassword = async(req, res) => {
    try {

        if(!req.body.email) throw new Error("Falta el campo email");
        
        await User.forgotPasswordJWTEmail(req.body.email, req);

        return res.redirectMessage('/', `Se ha enviado los pasos a seguir al email: ${req.body.email}`);
        
    } catch (error) {
        return res.redirectMessage('/', `Se ha enviado los pasos a seguir al email: ${req.body.email}`);
    }
}

const resetpasswordPage = async (req, res) => {
    try {
        
        if(!req.query.jwt) throw new Error("Hubo un error al intentar leer el jwt");
        
        await validarJWT(req.query.jwt);
        
        return res.view('public/resetPassword.ejs', {title:'resetar password', jwt:req.query.jwt});
    
    } catch (error) {
        
        return res.redirectMessage('/', '');
    }
}

const resetpassword = async (req,res) => {
    try {
        
        if(!req.body.jwt || !req.body.password || !req.body.repassword) throw new Error("Hubo un error");
        if(req.body.password.length < 8) throw new Error('demasiado corta')
        if(req.body.password != req.body.repassword) throw new Error('Las contraseñas deben de ser iguales')
        
        const {uid} = await validarJWT(req.body.jwt);

        await User.resetearPassword(uid, req.body.password);

        return res.redirectMessage('/', `Su contraseña ha sido cambiada correctamente. Por favor, inicie sesión para continuar.`);
    } catch (error) {
        console.log(error)
        return res.redirectMessage('/', `Algo salio mal...`);
    }
}


module.exports = { loginPage, registerPage, registerCreate, loginAccess, logout, existEmailRegister, forgotpasswordPage, forgotpassword,  resetpasswordPage, resetpassword}