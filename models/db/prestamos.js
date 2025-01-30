const mongoose = require('mongoose');
const Semilla = require('./semillas');
const Usuario = require('./user.js');
const Schema = mongoose.Schema;
const {MessagesError} = require('../../errors/Messages');

const prestamosSchema = new mongoose.Schema(
    {
        idUser: {
            type: Schema.ObjectId,
            ref: "user",
            required: true,
        },

        idReserva: {
            type: Schema.ObjectId,
            ref: "reserva",
        },

        idSemilla: {
            type: Schema.ObjectId,
            ref: "semilla",
            required: true,
        },

        emailUser:{
            type: String,
            required: true
        },

        nameSeed: {
            type: String,
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        amountSeeds: {
            type: Number,
            required: true,
        },

        seedsReturned: {
            type: Number,
            default: 0
        },

        fechaEntregaSemilla: {
            type: Date,
            default: new Date(),
        },

        fechaDevolucion: {
            type: Date,
            default: null,
        },

        status: {
            type: String,
            enum: ["devuelto", "sin devolver"],
            default: "sin devolver",
        },
    },
    {
        collection: "prestamos",
    }
);


prestamosSchema.statics.crearPrestamoReserva = async function (idReserva) {

    const Reserva = require('./reservas');
    const Usuario = require('./user');

    try {
        // Validar los parámetros
        if (!idReserva) {
            throw new Error(MessagesError.Prestamos.errorCamposObligatorios || "Error desconocido");
        }

        const reserva = await Reserva.findById(idReserva);
        if (!reserva) throw new Error(MessagesError.Prestamos.errorReservaNoEncontrada || "Error desconocido");
        if (reserva.status != 'recogidas') throw new Error(MessagesError.Prestamos.errorReservaNoRecogida || "Error desconocido");

        const user = await Usuario.findById(reserva.idUser);
        if (!user) throw new Error(MessagesError.Prestamos.errorUsuarioNoEncontrado || "Error desconocido");
        if (!user.activo) throw new Error(MessagesError.Prestamos.errorUsuarioBloqueado || "Error desconocido");

        // Extraer datos necesarios de la reserva
        const { nameSeed, username, amountSeeds } = reserva;

        // Crear el nuevo préstamo
        const nuevoPrestamo = new this({
            idUser: reserva.idUser,
            idReserva,
            idSemilla: reserva.idSemilla,
            emailUser: reserva.emailUser,
            nameSeed,
            username,
            amountSeeds,
        });

        // Actualizar el estado de la reserva a "recogidas"
        reserva.status = "recogidas";
        await reserva.save();

        // Guardar el nuevo préstamo en la base de datos
        const prestamoGuardado = await nuevoPrestamo.save();

        return prestamoGuardado;
    } catch (error) {
        console.error("Error al crear el préstamo:", error.message);
        throw new Error(error.message || MessagesError.Prestamos.errorCreacionPrestamo || "Error desconocido");
    }
};

prestamosSchema.statics.crearPrestamo = async function (idUser, idSemilla, amountSeeds) {
    try {

        if(!idUser || !idSemilla || !amountSeeds) throw new Error(MessagesError.Prestamos.errorCamposObligatorios || "Error desconocido");
        
        const user = await Usuario.findById(idUser);
        if (!user) throw new Error(MessagesError.Prestamos.errorUsuarioNoEncontrado || "Error desconocido");
        if (!user.activo) throw new Error(MessagesError.Prestamos.errorUsuarioBloqueado || "Error desconocido");

        const semilla = await Semilla.findById(idSemilla);
        if (!semilla || !semilla.activo) throw new Error(MessagesError.Prestamos.errorSemillaNoExistente);

        if(semilla.stock < amountSeeds) throw new Error(MessagesError.Prestamos.errorSemillaNoStock);
        
        semilla.stock = Number(semilla.stock) - Number(amountSeeds);

        await semilla.save();

        const nuevoPrestamo = new this({
            idUser,
            idSemilla,
            emailUser:user.email,
            nameSeed:semilla.nombre,
            username:user.username,
            amountSeeds,
        });

        await nuevoPrestamo.save();
        
    } catch (error) {
        throw new Error(error.message || MessagesError.Prestamos.errorPaginacion || "Error desconocido");
    }
}

prestamosSchema.statics.paginacionPrestamos = async function (pagina = 1, filter = {}, limite = 3) {
    try {
        if (pagina < 1) pagina = 1;

        if (limite < 1) throw new Error(MessagesError.Prestamos.errorPaginacionLimit || "Error desconocido");

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
        throw new Error(error.message || MessagesError.Prestamos.errorPaginacion || "Error desconocido");
    }
};

prestamosSchema.statics.devolverPrestamo = async function (idPrestamo, seedsReturned) {
    try {
        // Validación de parámetros
        if (!idPrestamo || !seedsReturned || seedsReturned <= 0) {
            throw new Error(MessagesError.Prestamos.errorDevolucionCamposObligatorios || "Error desconocido");
        }

        // Buscar el préstamo
        const prestamo = await this.findById(idPrestamo);
        if (!prestamo) {
            throw new Error(MessagesError.Prestamos.errorPrestamoNoExistente || "Error desconocido");
        }

        // Validación del estado del préstamo
        if (prestamo.status != 'sin devolver') {
            throw new Error(MessagesError.Prestamos.errorPrestamoEstadoIncorrecto || "Error desconocido");
        }

        // Buscar al usuario asociado al préstamo
        const user = await Usuario.findById(prestamo.idUser);
        if (!user) {
            throw new Error(MessagesError.Prestamos.errorUsuarioNoActivo || "Error desconocido");
        }

        if (!user.activo) {
            throw new Error(MessagesError.Prestamos.errorUsuarioNoActivo || "Error desconocido");
        }

        // Buscar la semilla asociada al préstamo
        const semilla = await Semilla.findById(prestamo.idSemilla);

        if (semilla) {
            // Actualizar el stock de semillas
            semilla.stock = Number(semilla.stock) + Number(seedsReturned);
            await semilla.save();
        } else {
            console.log(MessagesError.Prestamos.errorSemillaNoExistente || "Error desconocido");
        }

        // Actualizar el estado del préstamo
        prestamo.status = 'devuelto';
        prestamo.fechaDevolucion = new Date();
        prestamo.seedsReturned = seedsReturned;

        // Guardar los cambios en el préstamo
        await prestamo.save();

        return prestamo;
    } catch (error) {
        console.error("Error al devolver el préstamo:", error.message);
        throw new Error(error.message || MessagesError.Prestamos.errorDevolucionPrestamo || "Error desconocido");
    }
};



module.exports = mongoose.model('Prestamo', prestamosSchema);
