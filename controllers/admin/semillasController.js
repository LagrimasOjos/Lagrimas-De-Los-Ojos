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

        if(!req.params.id) throw new Error("Hubo un error al intentar eliminar la semilla");
        
        await Semillas.deleteSemilla(req.params.id);

        return res.redirectMessage('/admin/semillas/', 'Se ha eliminado correctamente la semilla');
    } catch (e) {
        return res.redirectMessage('/admin/semillas/', buscarErrorMensaje(e.message));
    }
};


const addCreate = async (req, res) => {
    try {

        if (!req.files || !req.files.fotoPath) {
            throw new Error('Es obligatorio la foto/s de la semilla.');
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
            epocaSiembra,
            activo: true
        };

        for (const [field, value] of Object.entries(requiredFields)) {
            if (!value) {
                throw new Error("Faltan campos obligatorios");
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
        return res.redirectMessage('/admin/semillas',e.message);
    }
};


module.exports = { updatePage, indexPage, addCreate, updateSemilla, deleteSemilla }