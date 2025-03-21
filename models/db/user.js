const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {MessagesError} = require('../../errors/Messages');
const { sendEmail, generarJWT } = require('../../helper/utils');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        match: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,6})$/
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^[6-9]\d{8}$/
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    rol: {
        type: String,
        enum: ['admin', 'user'],
        required: true,
        select: false
    },

    activo: {
        type: Boolean,
        required: true
    }

}, {
    timestamps: true,
    collection: "users"
});


userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
});

userSchema.statics.registerUser = async function ({ name, phone, email, password, repassword }) {
    try {
        // Validación de campos vacíos
        if (!name || !phone || !email || !password || !repassword) {
            throw new Error(MessagesError.Register.errorEmptyFields || "Todos los campos son obligatorios.");
        }

        // Validación de coincidencia de contraseñas
        if (password !== repassword) {
            throw new Error(MessagesError.Register.errorInvalidInput || "Las contraseñas no coinciden.");
        }

        // Validación de longitud mínima de la contraseña
        if (password.length < 8) {
            throw new Error(MessagesError.Register.errorWeakPassword || "La contraseña debe tener al menos 8 caracteres.");
        }

        // Validación de formato de email
        const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\-]*[a-zA-Z0-9])?(?:\.[a-zA-Z]{2,6})$/
        if (!emailRegex.test(email)) {
            throw new Error(MessagesError.Register.errorInvalidEmail || "El correo electrónico no tiene un formato válido.");
        }

        const phoneRegex = /^[6-9]\d{8}$/
        if (!phoneRegex.test(phone)) {
            throw new Error(MessagesError.Register.errorInvalidPhone || "El telefono no tiene un formato válido.");
        }

        const existPhone = await this.findOne({phone});

        if(existPhone) throw new Error(MessagesError.Register.telefonoDuplicado || "El usuario ya existe.");

        // Verificar si el usuario ya existe
        const existingUser = await this.findOne({ email });
        if (existingUser) {
            throw new Error(MessagesError.Register.errorUserExists || "El usuario ya existe.");
        }

        // Creación del usuario
        const newUser = new this({
            username: name,
            phone,
            email,
            password,
            rol: 'user',
            activo: true,
        });

        await newUser.save();
        return newUser;
    } catch (error) {
        throw new Error(error.message || MessagesError.Register.errorUnknown || "Ocurrió un error inesperado al registrar al usuario.");
    }
};


userSchema.statics.loginUser = async function ({ email, password }) {
    try {
        const userdb = await this.findOne({ email }).select('+password +rol');

        if (!userdb || !userdb.activo) {
            throw new Error(MessagesError.Login.errorUserNotFound || "Usuario no existe o usuario no activo");
        }

        const passwordValid = await bcrypt.compare(password, userdb.password);

        if (!passwordValid) {
            throw new Error(MessagesError.Login.errorPassword || "Contraseña errónea");
        }

        return userdb;
    } catch (error) {
        // Si el mensaje de error no está en los mensajes definidos, se lanza el original
        throw new Error(error.message || MessagesError.Login.errorUnknown || "Ocurrió un error inesperado");
    }
};

userSchema.statics.existEmailRegister = async function(email) {
    try { 
        
        if(!email) throw new Error("Es necesario pasar el email");
        

        const emailExist = await this.findOne({email});

        if(emailExist) return true;
        else return false;

    } catch (error) {
        throw new Error('Hubo un error al intentar acceder al registro para comprobar si existe');
    }
}


userSchema.statics.allUser = async function () {
    try {   
        const users = await this.find({activo:true});
        if (!users) {
            throw new Error('Usuarios no encontrados');
        }
        return users;
    } catch (error) {
        throw new Error("Ocurrió un error inesperado");
    }
};

userSchema.statics.paginacionUsers = async function (pagina = 1, filter = {}, limite = 3) {
    try {
        if (pagina < 1) pagina = 1;

        if (limite < 1) throw new Error('error en el limite' || "Error desconocido");

        let saltar = limite * (pagina - 1);

        const documentos = await this.find(filter).select('+rol').skip(saltar).limit(limite);
        const totalDocumentos = await this.find(filter).countDocuments();
        const totalPaginas = Math.ceil(totalDocumentos / limite);

        return {
            documentos,
            totalPaginas,
            paginaActual: pagina,
            limite,
            tieneMasPaginas: pagina < totalPaginas,
        };

    } catch (error) {
        throw new Error('error en la paginacion' || "Error desconocido");
    }
};

userSchema.statics.deleteUserId = async function (idUser, borrarHistorico) {

    const Reservas = require('./reservas');
    const Prestamos = require('./prestamos');
    const Semilla = require('./semillas');

    try {
        
        if(!idUser || !borrarHistorico) throw new Error("Faltan campos");

        if(borrarHistorico != 'true' && borrarHistorico != 'false') throw new Error("Error en borrarHistorico");

        const user = await this.findById(idUser).select('+rol');
        
        if(!user) throw new Error("El usuario no existe");


        if(borrarHistorico == 'false'){
        
            const reservasUser = await Reservas.find({idUser});
            const prestamosUser = await Prestamos.find({idUser});

            reservasUser.forEach(async(doc) => {
                try {
                    doc.status = 'deshabilitado';
                    await doc.save();
                } catch (error) {
                    console.log(error)
                }
            })

            prestamosUser.forEach(async(doc) => {
                try {
                    doc.status = 'deshabilitado';
                    await doc.save();
                } catch (error) {
                    console.log(error)
                }
            })


            if(user.rol == 'admin'){
                const admins = await this.find({rol:'admin'});
                if(admins.length <= 1){
                    throw new Error("No se puede eliminar el unico administrador");
                }else{
                    await this.findByIdAndDelete(idUser);
                }
            }else{
                await this.findByIdAndDelete(idUser);
            }


        
        }else{
            
            const reservasUser = await Reservas.find({idUser});
            
            const prestamosUser = await Prestamos.find({idUser});

            if(reservasUser.length > 0){
                reservasUser.forEach(async(doc) => {
                    if(doc.status == 'pendiente'){
                        const semilla = await Semilla.findById(doc.idSemilla);
                        if(!semilla){
                            console.log('Se intento restaurar el stock semilla');
                        }else{
                            semilla.stock = Number(semilla.stock) + Number(doc.amountSeeds);
                            await semilla.save();
                        }
                        
                    }
                    await doc.deleteOne();
                })
            }


            if(prestamosUser.length > 0){
                prestamosUser.forEach(async(doc )=> {
                    await doc.deleteOne();
                })
            }

            if(user.rol == 'admin'){
                const admins = await this.find({rol:'admin'});
                if(admins.length <= 1){
                    throw new Error("No se puede eliminar el unico administrador");
                }else{
                    await this.findByIdAndDelete(idUser);
                }
            }else{
                await this.findByIdAndDelete(idUser);
            }

        }

        return true;

    } catch (error) {
        console.log(error)
        throw new Error("Hubo un error al borrar el usuario");
    }
}

userSchema.statics.detailsID = async function(id){
    try {
        let userDetails = await this.find({_id: id});
        if(!userDetails){
            throw new Error("No existe tal usuario");
        }
        return userDetails;
    } catch (error) {
        console.log(error)
        throw new Error("Error al mostrar los detalles")
    }
}

userSchema.statics.forgotPasswordJWTEmail = async function (email, req) {
    try {
        const user = await this.findOne({ email });
        
        if (!user || !user.activo) throw new Error("El usuario no existe");
        
        const token = await generarJWT({ uid: user._id });
        const domain = `${req.protocol}://${req.get('host')}`; // Obtiene el dominio dinámicamente
        const resetLink = `${domain}/auth/reset-password?jwt=${token}`;
        
        const htmlContent = `
            <h2>Recuperación de contraseña</h2>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no realizaste esta solicitud, puedes ignorar este correo.</p>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 15px; color: white; background: blue; text-decoration: none; border-radius: 5px;">Restablecer contraseña</a>
            <p>Este enlace expirará en 1 hora.</p>
        `;
        
        await sendEmail({ to: email, subject: 'Recuperar contraseña - Lágrimas de los Ojos', text: '', html: htmlContent });
        
        return true;
    } catch (error) {
        console.log(error);
        throw new Error("Error al intentar enviar el email");
    }
};


userSchema.statics.resetearPassword = async function (idUser, newPassword) {
    try {
        const user = await this.findById(idUser).select('+password');
        
        if (!user || !user.activo || newPassword.length < 8) throw new Error("El usuario no existe");
        
        user.password = newPassword;

        await user.save();
        
        return true;
    } catch (error) {
        throw new Error("Hubo un error al intentar cambiar la contraseña");
    }
};



module.exports = mongoose.model('', userSchema);

