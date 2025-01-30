const Reserva = require('../../models/db/reservas');
const Preferencias = require('../../models/db/preferences');
const { buscarErrorMensaje } = require('../../errors/Messages');
const Semilla = require('../../models/db/semillas');
const Usuario = require('../../models/db/user');

const reservasCpanel = async (req, res) => {
    try {

        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const filter = {};

        const resultadoPaginacion = await Reserva.paginacionReservas(pagina, filter, limite);
        const preferences = await Preferencias.getData();
        const {dayToCollect, maximumSeedReserves} = preferences;
        const users = await Usuario.allUser();
        const semillas = await Semilla.allSemillasActive();
        
        // Renderizar la vista con los datos de las reservas
        return res.view('admin/reservas/index', {
            reservas: resultadoPaginacion.documentos,
            totalPaginas: resultadoPaginacion.totalPaginas,
            paginaActual: resultadoPaginacion.paginaActual,
            tieneMasPaginas: resultadoPaginacion.tieneMasPaginas,
            diasParaRecoger:dayToCollect,
            maximoSemillas:maximumSeedReserves,
            users,
            semillas
        });
    } catch (e) {
        console.log(e)
        return res.redirectMessage('/admin/', buscarErrorMensaje(e.message));
    }
}

const confirmarReserva = async (req,res)=>{
    try {
        if(!req.body.idReserva) throw new Error("No se encontro la reserva");
        
        const prestamo = await Reserva.atenderReservaId(req.body.idReserva);
        
        return res.redirectMessage('/admin/reservas', 'Se ha realizado correctamente la reserva, dale las semillas al usuario');
    } catch (e) {
        return res.redirectMessage('/admin/reservas', buscarErrorMensaje(e.message));
    }
}

const crearReserva = async(req,res) => {
    try {
        const reservar = await Reserva.crearReservas(req.body.idSemilla, req.body.idUser, req.body.cantidadSemillas, req.body.datecollection);
        return res.redirectMessage('/admin/reservas', 'Reserva creada correctamente');
    } catch (e) {
        return res.redirectMessage('/admin/reservas', buscarErrorMensaje(e.message));
    }
}

const cancelarReserva = async (req,res) => {
    try {
        const reservar = await Reserva.cancelarReserva(req.body.userId, req.body.reservaId);
        return res.redirectMessage('/admin/reservas', 'Se cancelo correctamente la reserva');
    } catch (e) {
        return res.redirectMessage('/admin/reservas', buscarErrorMensaje(e.message));
    }
}

module.exports = { reservasCpanel, confirmarReserva, crearReserva, cancelarReserva}