const ReservasError = {
        errorPaginacionLimit: 'El límite debe ser mayor a 0',
        errorUnknown: 'Hubo un error inesperado en la paginación.',
        errorReservaNoEncontrada: 'No se encontró la reserva especificada.',
        errorEstadoReservaNoPendiente: 'El estado de la reserva no es pendiente',
        errorUsuarioNoEncontrado: 'Hubo un error al encontrar el usuario del préstamo.',
        errorUsuarioBloqueado: 'El usuario no puede tener más préstamos porque está bloqueado.',
        errorPrestamoCreacion: 'Hubo un error al crear el préstamo.',
        errorSemillaNoDisponible: 'No se puede reservar esa semilla, o no hay stock disponible.',
        errorUsuarioNoActivo: 'Este usuario no puede reservar ninguna semilla.',
        errorMaxReservasAlcanzadas: 'El usuario ya tiene demasiadas semillas reservadas y no puede reservar más hasta recogerlas, o la cantidad que intenta reservar excede el límite permitido.',
        errorFechaRecoleccion: 'Hubo un error al calcular la fecha de recolección.',
        errorCreacionReserva: 'Error al crear la reserva: ${error.message}',
        errorReservaNoEspecificada: 'No se especificó el usuario o la reserva.',
        errorUsuarioNoActivoParaCancelar: 'No se encontró al usuario o el usuario no está activo.',
        errorReservaNoExistente: 'No se encontró la reserva.',
        errorReservaNoPerteneceUsuario: 'El usuario con ID ${idUser} no es propietario de la reserva con ID ${idReserva}.',
        errorEstadoReservaNoCancelada: 'Solo se pueden cancelar reservas en estado "pendiente".',
        errorSemillaNoEncontrada: 'No se encontró la semilla asociada a la reserva.',
        errorRestablecerStockSemilla: 'La semilla asociada fue eliminada; no se pudo restablecer el stock.',
        errorCancelarReserva: 'Hubo un error al cancelar la reserva.',
        errorNotFields:'Faltan campos por enviar',
        errorDateAfter:'La fecha debe ser posterior a la fecha actual'
};

module.exports = ReservasError;
