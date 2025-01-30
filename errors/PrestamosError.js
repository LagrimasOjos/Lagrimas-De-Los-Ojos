const PrestamoError = {
    errorCamposObligatorios: "Todos los campos son obligatorios.",
    errorReservaNoEncontrada: "No se encontró la reserva especificada.",
    errorReservaNoRecogida: "Hubo un error al hacer la reserva, esta reserva no está recogida.",
    errorUsuarioNoEncontrado: "Hubo un error al encontrar el usuario del préstamo.",
    errorUsuarioBloqueado: "El usuario no puede tener más préstamos porque está bloqueado.",
    errorCreacionPrestamo: "No se pudo crear el préstamo. Intente nuevamente.",
    errorPaginacionLimit: "El límite debe ser mayor a 0",
    errorPaginacion: "Error en la paginación",
    errorDevolucionCamposObligatorios: "Se deben especificar tanto el préstamo como la cantidad de semillas a devolver",
    errorPrestamoNoExistente: "El préstamo no existe o no se encontró.",
    errorPrestamoEstadoIncorrecto: "El préstamo no está en estado 'sin devolver'.",
    errorUsuarioNoActivo: "El usuario no está activo.",
    errorSemillaNoExistente: "La semilla asociada al préstamo no existe.",
    errorSemillaNoStock: "La semilla no tiene stock suficiente.",
    errorDevolucionPrestamo: "Hubo un error al devolver el préstamo. Verifica los detalles."
};

module.exports = PrestamoError;