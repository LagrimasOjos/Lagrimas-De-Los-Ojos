const mongoose = require('mongoose');
const subirArchivo = require('../../helper/subirArchivo');
const {MessagesError} = require('../../errors/Messages');
const semillasSchema = new mongoose.Schema({
    fotoPath: {
        type: String,
        required: true
    },

    stock:{
        type: Number,
        required: true
    },
    
    nombre: {
        type: String,
        required: true
    },

    nombreCientifico: {
        type: String
    },

    descripcion: {
        type: String,
        required: true
    },

    tipoDeSuelo: {
        type: String,
    },

    exposicionSolar: {
        type: String,
    },

    frecuenciaRiego: {
        type: String
    },

    cantidadRiego: {
        type: Number
    },
    
    temperaturaIdeal: {
        type: Number
    },

    epocaSiembra: {
        type: String
    },

    profundidadSiembra: {
        type: String,
    },
    
    espaciadoPlantas: {
        type: Number,
    },
    
    tiempoGerminacion: {
        type: Number,
    },
    
    tiempoCosecha: {
        type: Number,
    },
    
    cuidadosPlantas: {
        type: String,
    },

    activo: {
        type: Boolean,
        required: true
    }
});

semillasSchema.statics.paginacionSemilla = async function (pagina = 1, filter = {}, limite = 3) {
    try {
        
        if (pagina < 1) pagina = 1;
        
        if (limite < 1) throw new Error(MessagesError.Semilla.errorPaginacionLimit);

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
        throw new Error(error.message || MessagesError.Semilla.errorUnknown || "Ocurrió un error inesperado");
    }
};

semillasSchema.statics.updateSemilla = async function(id, updates) {
    try {
        // Primero buscamos la semilla por su ID
        const semilla = await this.findById(id);

        // Si no se encuentra la semilla, lanzamos un error
        if (!semilla) {
            throw new Error(MessagesError.Semilla.errorSemillaNoEncontrada);
        }

        // Recorremos las claves de la actualización y verificamos si son válidas
        const fieldsToUpdate = [
            'fotoPath', 'stock', 'nombre', 'nombreCientifico', 'descripcion', 'tipoDeSuelo',
            'exposicionSolar', 'frecuenciaRiego', 'cantidadRiego', 'temperaturaIdeal', 'epocaSiembra',
            'profundidadSiembra', 'espaciadoPlantas', 'tiempoGerminacion', 'tiempoCosecha', 'cuidadosPlantas', 'activo'
        ];

        // Filtramos las claves que están en la lista de campos permitidos
        const validUpdates = {};

        for (let field of fieldsToUpdate) {
            if (updates[field] !== undefined) {
                validUpdates[field] = updates[field];
            }
        }

        // Manejo especial para el campo 'activo', asegurándonos de que se convierta a booleano
        if (updates.activo == 'on') {
            validUpdates.activo = true;
        } else {
            validUpdates.activo = false;
        }

        // Si 'fotoPath' está presente y es un archivo, procesamos la carga de la imagen
        if (updates.fotoPath?.mv) {
            const uploadFolder = '/public/imgs/semillas';
            const maxSize = 10 * 1024 * 1024; // 10 MB
            const extensiones = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.JPEG'];

            // Intentamos subir el archivo
            try {
                const uploadPath = await subirArchivo(updates.fotoPath, uploadFolder, maxSize, extensiones);
                validUpdates.fotoPath = uploadPath.publicPath; // Asignamos la ruta pública de la imagen
            } catch (error) {
                throw new Error(MessagesError.Semilla.errorFotoCarga + ": " + error.message);
            }
        }

        // Si hay actualizaciones, aplicamos los cambios
        if (Object.keys(validUpdates).length > 0) {
            await this.updateOne({ _id: id }, validUpdates);
        }

        // Devolvemos la semilla actualizada
        return semilla;
    } catch (error) {
        console.error(error); // Es recomendable loguear el error para depuración
        throw new Error(error.message || MessagesError.Semilla.errorUnknown || "Ocurrió un error inesperado");
    }
};

semillasSchema.statics.anadirSemilla = async function (dataSemilla) {
    try {
    
        const requiredFields = ["fotoPath", "stock", "nombre", "descripcion", "activo"];

        for (const field of requiredFields) {
            if (!dataSemilla[field]) {
                throw new Error(MessagesError.Semilla.errorCamposObligatorios.replace('${field}', field));
            }
        }

        const uploadFolder = '/public/imgs/semillas';
        const maxSize = 10 * 1024 * 1024; // 10 MB
        const extensiones = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.JPEG'];
        let uploadPath = await subirArchivo(dataSemilla.fotoPath, uploadFolder, maxSize, extensiones);
        uploadPath = uploadPath.publicPath;

        const semillaData = {
            ...dataSemilla,
            fotoPath: uploadPath,
        };

        const newSemilla = new this(semillaData);
        await newSemilla.save();

        return newSemilla;
    } catch (error) {
        console.error(error);
        throw new Error(MessagesError.Semilla.errorSemillaCreacion);
    }
};

semillasSchema.statics.semillaDetalles = async function (idSemilla) {
    try {   
        const semilla = await this.findById(idSemilla);
        if (!semilla || !semilla.activo) {
            throw new Error(MessagesError.Semilla.errorSemillaNoEncontrada);
        }
        return semilla;
    } catch (error) {
        throw new Error(error.message || MessagesError.Semilla.errorUnknown || "Ocurrió un error inesperado");
    }
};



semillasSchema.statics.allSemillasActive = async function () {
    try {   
        const semillas = await this.find({activo:true});
        if (!semillas) {
            throw new Error(MessagesError.Semilla.errorSemillaNoEncontrada);
        }
        return semillas;
    } catch (error) {
        throw new Error(error.message || MessagesError.Semilla.errorUnknown || "Ocurrió un error inesperado");
    }
};


module.exports = mongoose.model('semilla', semillasSchema)