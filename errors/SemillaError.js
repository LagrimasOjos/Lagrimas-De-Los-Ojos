const SemillaError = {
    errorPaginacionLimit: 'El límite debe ser mayor a 0. Por favor, ajusta el valor.',
    errorSemillaNoEncontrada: 'La semilla que buscas no existe. Verifica el ID o intenta con otro.',
    errorActualizacionSemilla: 'Hubo un error al intentar actualizar la semilla. Intenta nuevamente.',
    errorFotoCarga: 'Hubo un problema al cargar la imagen. Verifica el archivo y su tamaño.',
    errorSemillaExistente: 'La semilla con ese nombre ya existe. Intenta con otro nombre.',
    errorSemillaCreacion: 'Hubo un problema al crear la semilla. Asegúrate de que todos los campos sean correctos.',
    errorSemillaDetalles: 'No se pudo obtener los detalles de la semilla. Intenta nuevamente más tarde.',
    errorCamposObligatorios: 'Algunos campos obligatorios están vacíos. Por favor, completa toda la información.',
    errorFormatoIncorrecto: 'Algunos de los datos ingresados no tienen el formato correcto. Verifica e intenta de nuevo.',
    errorTamañoArchivoExcedido: 'El tamaño del archivo excede el límite permitido de 10 MB. Por favor, sube un archivo más pequeño.',
    errorTipoArchivoInvalido: 'El tipo de archivo no es válido. Solo se permiten imágenes en formato .jpg, .png o .jpeg.',
    errorUnknown: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.'
};

module.exports = SemillaError;