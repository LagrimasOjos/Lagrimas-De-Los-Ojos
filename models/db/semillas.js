const mongoose = require('mongoose');
const { subirArchivos } = require('../../helper/subirArchivo');
const { MessagesError } = require('../../errors/Messages');
const path = require('path');
const fs = require('fs');

const semillasSchema = new mongoose.Schema({
    fotoPath: {
        type: [String],
        required: true
    },

    stock: {
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
        type: String,
        enum: ['primavera', 'verano', 'otoño', 'invierno'],
        set: (value) => value.toLowerCase() // Asegura que el valor se guarde en minúsculas
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
}, { timestamps: true });

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

semillasSchema.statics.updateSemilla = async function (id, updates) {
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
                if (field != "fotoPath")
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
        if (updates.fotoPath) {

            if (!Array.isArray(updates.fotoPath)) updates.fotoPath = [updates.fotoPath]

            const uploadFolder = '/public/imgs/semillas';
            const maxSize = 10 * 1024 * 1024; // 10 MB
            const extensiones = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.JPEG'];

            try {
                const uploadPaths = await subirArchivos(updates.fotoPath, uploadFolder, maxSize, extensiones);
                semilla.fotoPath.push(...uploadPaths);
                validUpdates['fotoPath'] = semilla.fotoPath;
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

        const requiredFields = ["fotoPath", "stock", "nombre", "descripcion", "activo", "epocaSiembra"];

        for (const field of requiredFields) {
            if (!dataSemilla[field]) {
                throw new Error(MessagesError.Semilla.errorCamposObligatorios.replace('${field}', field));
            }
        }

        if (!Array.isArray(dataSemilla.fotoPath)) dataSemilla.fotoPath = [dataSemilla.fotoPath]

        const uploadFolder = '/public/imgs/semillas';
        const maxSize = 10 * 1024 * 1024; // 10 MB
        const extensiones = ['.jpg', '.png', '.JPG', '.PNG', '.jpeg', '.JPEG'];

        let pathsPublicImg = null;

        try {
            pathsPublicImg = await subirArchivos(dataSemilla.fotoPath, uploadFolder, maxSize, extensiones);
        } catch (error) {
            throw new Error(MessagesError.Semilla.errorFotoCarga + ": " + error.message);
        }



        const semillaData = {
            ...dataSemilla,
            fotoPath: [...pathsPublicImg],
        };

        const newSemilla = new this(semillaData);

        await newSemilla.save();

        return newSemilla;

    } catch (error) {
        console.log(error)
        throw new Error(MessagesError.Semilla.errorSemillaCreacion || 'Error al crear la semilla');
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
        const semillas = await this.find({ activo: true });
        if (!semillas) {
            throw new Error(MessagesError.Semilla.errorSemillaNoEncontrada);
        }
        return semillas;
    } catch (error) {
        throw new Error(error.message || MessagesError.Semilla.errorUnknown || "Ocurrió un error inesperado");
    }
};

semillasSchema.statics.deletePhotoIdSeed = async function (idSemilla, photo) {
    try {
        const semilla = await this.findById(idSemilla);
        if (!semilla) throw new Error("Semilla no encontrada");

        const rutaFisicaSemilla = path.join(__dirname + `/../../public${photo}`);

        if (fs.existsSync(rutaFisicaSemilla)) {
            fs.unlinkSync(rutaFisicaSemilla);
        } else {
            console.warn("La foto no existe en el sistema de archivos:", rutaFisicaSemilla);
        }

        semilla.fotoPath = semilla.fotoPath.filter(img => img !== photo);

        await semilla.save();
        return true;
    } catch (error) {
        console.log(error)
        throw new Error("Error al eliminar la foto de la semilla");
    }
};

semillasSchema.statics.deleteSemilla = async function (idSemilla) {
    try {

        if (!idSemilla) throw new Error("Hubo un error al eliminar la semilla");

        const semilla = await this.findById(idSemilla);

        const rutaFisicaSemilla = path.join(__dirname + `/../../public${semilla.fotoPath}`);

        if (fs.existsSync(rutaFisicaSemilla)) {
            fs.unlinkSync(rutaFisicaSemilla);
        } else {
            console.warn("La foto no existe en el sistema de archivos:", rutaFisicaSemilla);
        }

        await this.findByIdAndDelete(idSemilla);

        return true;
    } catch (error) {
        throw new Error("Error al eliminar la semilla");
    }
}


module.exports = mongoose.model('semilla', semillasSchema)