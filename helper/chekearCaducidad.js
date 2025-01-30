const mongoose = require('mongoose');
const Reserva = require('../models/db/reservas'); 
const Semilla = require('../models/db/semillas');


const chekearCaducidad = () => {
    setInterval(async () => {
        try {
            console.log('Chequeando caducidad...');

            // Fecha de prueba fija (puedes modificarla según tus necesidades)
            //const fechaActual = new Date('2025-01-29T19:46:34.975Z');
            const fechaActual = new Date();
            // Buscar reservas caducadas
            const reservasCaducadas = await Reserva.find({
                status: "pendiente",
                collectionDate: { $lt: fechaActual },
            });

            for (const reserva of reservasCaducadas) {
                // Actualizar el estado de la reserva
                reserva.status = "no recogida";
                await reserva.save();

                // Incrementar el stock de la semilla asociada
                const semilla = await Semilla.findById(reserva.idSemilla);
                if (semilla) {
                    semilla.stock += reserva.amountSeeds;
                    await semilla.save();
                }

                console.log(`Reserva ${reserva._id} ha caducado. Estado actualizado a 'no recogida'.`);
            }
        } catch (error) {
            console.error("Error al comprobar reservas caducadas:", error.message);
        }
    }, 100000);
};

module.exports = chekearCaducidad;
