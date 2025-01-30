const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Semilla = require('./semillas');
const Usuario = require('./user');
const Prestamo = require('./prestamos');
const Preferencias = require('./preferences');
const {MessagesError} = require('../../errors/Messages');

const reservasSchema = new mongoose.Schema({
    idUser: {
        type: Schema.ObjectId,
        ref: "user",
        required: true
    },

    idSemilla: {
        type: Schema.ObjectId,
        ref: "semilla",
        required: true
    },

    emailUser:{
        type: String,
        required: true
    },

    nameSeed: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    collectionDate: {
        type: Date,
        required: true
    },

    amountSeeds: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['pendiente', 'recogidas', 'no recogida']
    }

}, {
    collection: "reservas"
});


reservasSchema.statics.paginacionReservas = async function (pagina = 1, filter = {}, limite = 3) {
    try {
        if (pagina < 1) pagina = 1;

        if (limite < 1) throw new Error(MessagesError.Reservas.errorPaginacionLimit);

        let saltar = limite * (pagina - 1);

        const documentos = await this.find(filter).skip(saltar).limit(limite);
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
        throw new Error(error.message || MessagesError.Reservas.errorUnknown);
    }
};

reservasSchema.statics.atenderReservaId = async function (idReserva) {
    try {
        if (!idReserva) throw new Error(MessagesError.Reservas.errorReservaNoEspecificada);

        const reserva = await this.findById(idReserva);

        if (!reserva) throw new Error(MessagesError.Reservas.errorReservaNoEncontrada);
    
        if (reserva.status != 'pendiente') throw new Error(MessagesError.Reservas.errorEstadoReservaNoPendiente);

        const user = await Usuario.findById(reserva.idUser);

        if (!user) throw new Error(MessagesError.Reservas.errorUsuarioNoEncontrado);

        if (!user.activo) throw new Error(MessagesError.Reservas.errorUsuarioBloqueado);

        reserva.status = 'recogidas';

        await reserva.save();

        const prestamo = await Prestamo.crearPrestamoReserva(idReserva);

        if(!prestamo) throw new Error(MessagesError.Reservas.errorPrestamoCreacion);
        
        return prestamo;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || MessagesError.Reservas.errorUnknown);
    }
};

reservasSchema.statics.crearReservas = async function (idSemilla, idUser, amountSeeds, datecollection = '') {
    try {

        if(!idSemilla || !idUser || !amountSeeds){
            throw new Error(MessagesError.Reservas.errorNotFields);
        }


        // Buscar la semilla
        const semilla = await Semilla.findById(idSemilla);

        if (!semilla || !semilla.activo || semilla.stock == 0 || (semilla.stock - amountSeeds < 0)) {
            throw new Error(MessagesError.Reservas.errorSemillaNoDisponible);
        }

        // Buscar el usuario
        const usuario = await Usuario.findById(idUser);

        if (!usuario || !usuario.activo) {
            throw new Error(MessagesError.Reservas.errorUsuarioNoActivo);
        }

        // Configuración administrativa (se puede extraer de preferencias)
        const { dayToCollect, maximumSeedReserves } = await Preferencias.getData();

        // Comprobar reservas pendientes del usuario
        const semillasReservadasNoRecogidas = await this.find({ idUser, status: "pendiente" });

        let totalSemillasReservadas = amountSeeds;

        if (totalSemillasReservadas > maximumSeedReserves) throw new Error(MessagesError.Reservas.errorMaxReservasAlcanzadas);

        for (const reserva of semillasReservadasNoRecogidas) {
            totalSemillasReservadas = Number(reserva.amountSeeds) + Number(totalSemillasReservadas);
            if (totalSemillasReservadas > maximumSeedReserves) {
                throw new Error(MessagesError.Reservas.errorMaxReservasAlcanzadas);
            }
        }

    
        let collectionDate = null;
    
        
        if(datecollection != ''){
            collectionDate = new Date(datecollection);
        }else{
            collectionDate = new Date()
            collectionDate.setDate(collectionDate.getDate() + parseInt(dayToCollect));
        }

        if(collectionDate <= new Date()){
            throw new Error(MessagesError.Reservas.errorDateAfter);
        }
        

        // Crear la reserva
        const reserva = new this({
            idUser,
            idSemilla,
            nameSeed: semilla.nombre,
            username: usuario.username,
            emailUser:usuario.email,
            collectionDate,
            amountSeeds,
            status: "pendiente",
        });

        semilla.stock -= amountSeeds;

        await semilla.save();

        // Guardar la reserva
        await reserva.save();

        return reserva;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || MessagesError.Reservas.errorCreacionReserva);
    }
};

reservasSchema.statics.cancelarReserva = async function (idUser, idReserva) {
    try {
        if (!idUser || !idReserva) {
            throw new Error(MessagesError.Reservas.errorReservaNoEspecificada);
        }

        const user = await Usuario.findById(idUser);
        if (!user || !user.activo) {
            throw new Error(MessagesError.Reservas.errorUsuarioNoActivoParaCancelar);
        }

        const reserva = await this.findById(idReserva);
        if (!reserva) {
            throw new Error(MessagesError.Reservas.errorReservaNoExistente);
        }

        if (reserva.idUser != idUser) {
            throw new Error(MessagesError.Reservas.errorReservaNoPerteneceUsuario);
        }

        if (reserva.status !== 'pendiente') {
            throw new Error(MessagesError.Reservas.errorEstadoReservaNoCancelada);
        }

        const semilla = await Semilla.findById(reserva.idSemilla);
        if (semilla) {
            semilla.stock = Number(reserva.amountSeeds) + Number(semilla.stock);
            await semilla.save();
        } else {
            console.warn(MessagesError.Reservas.errorRestablecerStockSemilla);
        }

        await reserva.deleteOne();

        return true;
    } catch (error) {
        console.error(error);
        throw new Error(error.message || MessagesError.Reservas.errorUnknown);
    }
};

module.exports = mongoose.model('reserva', reservasSchema);