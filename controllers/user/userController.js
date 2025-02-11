const Semilla = require('../../models/db/semillas');
const Reserva = require('../../models/db/reservas');
const Usuario = require('../../models/db/user');
const { buscarErrorMensaje } = require('../../errors/Messages');
const userCpanel = async (req, res) => {
    try {
        return res.view('user/index', { title: 'Cpanel Usuarios' });
    } catch (e) {
        return res.redirectMessage('/', 'Hubo un error al mostrar la pagina');
    }
}


const reservasCpanel = async (req, res) => {
    try {

        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const filter = {idUser:req.session.userId}; 
        
        const resultadoPaginacion = await Reserva.paginacionReservas(pagina, filter, limite);

        // Renderizar la vista con los datos de las reservas
        return res.view('user/reservas/index', {
            reservas: resultadoPaginacion.documentos,
            totalPaginas: resultadoPaginacion.totalPaginas,
            paginaActual: resultadoPaginacion.paginaActual,
            tieneMasPaginas: resultadoPaginacion.tieneMasPaginas,
        });
    } catch (e) {
        return res.redirectMessage('/', buscarErrorMensaje(e.message));
    }
}


const reservarIdPage = async (req, res) => {
    try {
        const semilla = await Semilla.findOne({ _id: req.params.id, activo: true });
        if (!semilla) throw new Error("Hubo un error al acceder a la semilla o esta inactiva");
        return res.view('user/reservas/reservarSemilla', { title: 'Reservar Semilla', semilla });
    } catch (e) {
        return res.redirectMessage('/', buscarErrorMensaje(e.message));
    }
}

const reservarId = async (req, res) => {
    try {
        if (!req.body.amountSeeds || !req.params.id) throw new Error("Es necesario expecificar la cantidad o la semilla id");
        const reservar = await Reserva.crearReservas(req.params.id, req.session.userId, req.body.amountSeeds);
        return res.redirectMessage('/', 'Se registro correctamente la reserva');
    } catch (e) {
        return res.redirectMessage('/', buscarErrorMensaje(e.message));
    }
}

const reservaCancelar = async (req,res) => {
    try {
        if(!req.body.idReserva) throw new Error("Hubo un error al obtener el id de la reserva");
        const cancelar = await Reserva.cancelarReserva(req.session.userId, req.body.idReserva);
        if(!cancelar) throw new Error("Hubo un error al cancelar la reserva");
        else return res.redirectMessage('/', 'Se cancelo correctamente la reserva');
    } catch (error) {
        console.log(error)
        return res.redirectMessage('/me/reservas', buscarErrorMensaje(e.message))
    }
}

const userDetails = async(req, res) => {
    try {
        let userData = await Usuario.detailsID(req.session.userId);
        return res.view('user/details/index', {userData, title: "Mi perfil"})
    } catch (error) {
        return res.send(error)
    }
}

const changeDetails = async(req, res) => {
    try {
        const {phone} = req.body;
        const user = await Usuario.findById(req.session.userId);
        if (user.phone === phone) {
            return res.redirectMessage('/me/details', "Ese telefono ya esta activo")
        }
        user.phone = phone;
        await user.save();
        return res.redirectMessage('/me/details', "Tu telefono ha sido actualizada correctamente");
    } catch (e) {
        return res.redirectMessage('/me/details', buscarErrorMensaje(e.message))
    }
}


module.exports = { reservarIdPage, reservarId, reservasCpanel, userCpanel, reservaCancelar, userDetails, changeDetails }