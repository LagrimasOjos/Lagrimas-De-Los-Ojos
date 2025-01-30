const { buscarErrorMensaje } = require('../../errors/Messages');
const Prestamo = require('../../models/db/prestamos');
const Semilla = require('../../models/db/semillas');
const Usuario = require('../../models/db/user');

const prestamosCpanel = async(req,res) => {
    try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const filter = {}; 
            
            const resultadoPaginacion = await Prestamo.paginacionPrestamos(pagina, filter, limite);

            const users = await Usuario.allUser();
            const semillas = await Semilla.allSemillasActive();

            return res.view('admin/prestamos/index.ejs', {
                prestamos: resultadoPaginacion.documentos,
                totalPaginas: resultadoPaginacion.totalPaginas,
                paginaActual: resultadoPaginacion.paginaActual,
                tieneMasPaginas: resultadoPaginacion.tieneMasPaginas,
                users, semillas
            });
        } catch (e) {
            return res.redirectMessage('/', buscarErrorMensaje(e.message));
        }
}

const devueltaPrestamo = async(req,res) => {
    try {
        if(!req.body.idPrestamo || !req.body.seedsReturned) throw new Error("Hubo un error al recoger el id");
        const prestamoDevuelto = await Prestamo.devolverPrestamo(req.body.idPrestamo, req.body.seedsReturned);
        return res.redirectMessage('/admin/prestamos', 'Se devolvio correctamente el prestamo, coloque las semillas');
    } catch (e) {
        return res.redirectMessage('/admin/prestamos', buscarErrorMensaje(e.message));
    }
}


const crearPrestamo = async (req,res) => {
    try {
        const {idUser, idSemilla, cantidadSemillas} = req.body;

        await Prestamo.crearPrestamo(idUser, idSemilla, cantidadSemillas);
        
        return res.redirectMessage('/admin/prestamos', 'Se ha creado correctamente el prestamo');
    } catch (e) {
        console.log(e.message);
        return res.redirectMessage('/admin/prestamos', buscarErrorMensaje(e.message));
    }
}   

module.exports = {prestamosCpanel, devueltaPrestamo, crearPrestamo}