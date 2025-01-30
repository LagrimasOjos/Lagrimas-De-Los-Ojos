const { buscarErrorMensaje } = require('../../errors/Messages');
const Semillas = require('../../models/db/semillas');

const indexPage = async (req, res) => {
    try {
        const { documentos, totalPaginas, paginaActual } = await Semillas.paginacionSemilla(req.query.pagina || 1, {}, 10);
        return res.view('admin/semillas/index', { semillas: documentos, totalPaginas, paginaActual });
    } catch (e) {
        return res.redirectMessage('/admin/', buscarErrorMensaje(e.message));
    }
}


const updatePage = async (req, res) => {
    try {
        const semilla = await Semillas.findById(req.params.id);
        if (!semilla) throw new Error("No existe la semilla");
        return res.view('admin/semillas/updateSemillas.ejs', { semilla })
    } catch (e) {
        return res.redirectMessage('/admin/', buscarErrorMensaje(e.message))
    }
}

const updateSemilla = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id) throw new Error("No existe el id");

        if (req.files && req.files.fotoPath) {
            updates.fotoPath = req.files.fotoPath;
        }

        await Semillas.updateSemilla(id, updates);

        return res.redirectMessage('/admin/semillas/', 'Se ha actualizado correctamente');
    } catch (e) {
        return res.redirectMessage('/admin/semillas/', buscarErrorMensaje(e.message));
    }
}

const deleteSemilla = async (req, res) => {
    try {
        // Intentamos eliminar la semilla por su ID
        const semilla = await Semillas.findByIdAndDelete(req.params.id);

        // Si la semilla fue eliminada, redirigimos con un mensaje de éxito
        return res.redirectMessage('/admin/semillas/', 'Se ha eliminado correctamente la semilla');
    } catch (e) {
        // Si ocurre un error, redirigimos con un mensaje de error
        return res.redirectMessage('/admin/semillas/', buscarErrorMensaje(e.message));
    }
};


const addCreate = async (req, res) => {
    try {

        if (!req.files || !req.files.fotoPath) {
            return res.status(400).json({ message: 'Es obligatorio la foto de la semilla.' });
        }

        const fotoPath = req.files.fotoPath;


        const {
            nombre,
            nombreCientifico,
            tipoDeSuelo,
            descripcion,
            exposicionSolar,
            frecuenciaRiego,
            cantidadRiego,
            temperaturaIdeal,
            epocaSiembra,
            profundidadSiembra,
            espaciadoPlantas,
            tiempoGerminacion,
            tiempoCosecha,
            cuidadosPlantas,
            stock
        } = req.body;


        const requiredFields = {
            nombre,
            descripcion,
            fotoPath,
            stock,
            activo: true
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                return res.redirectMessage('/admin/semillas/add', `El campo obligatorio '${field}' está ausente.`);
            }
        }


        const dataSemilla = {
            nombre,
            nombreCientifico,
            tipoDeSuelo,
            descripcion,
            exposicionSolar,
            frecuenciaRiego,
            cantidadRiego,
            temperaturaIdeal,
            epocaSiembra,
            profundidadSiembra,
            espaciadoPlantas,
            tiempoGerminacion,
            tiempoCosecha,
            cuidadosPlantas,
            fotoPath,
            stock,
            activo: true
        };

        await Semillas.anadirSemilla(dataSemilla);
        return res.redirectMessage('/admin/semillas', 'Semilla creada correctamente');
    } catch (e) {
        console.error(e);
        return res.redirectMessage('/admin/semillas', e.message || buscarErrorMensaje(e.message));
    }
};


module.exports = { updatePage, indexPage, addCreate, updateSemilla, deleteSemilla }