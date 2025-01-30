const Reservas = require('../../../models/db/reservas');
const Prestamos = require('../../../models/db/prestamos');

const reservasEmailFind = async (req,res) => {

    try {

        let filtro = { emailUser: { $regex: req.query.emailUser || '', $options: 'i' } }

        const pagina = req.query.pagina || 1;

        const paginacion_reservasUser = await Reservas.paginacionReservas(pagina, filtro, 5);

        return res.json({data:paginacion_reservasUser, error:null});

    } catch (error) {
        console.log(error)
        return res.json({data:null, error:'error'});
    }

}


const prestamosEmailFind = async (req,res) => {

    try {

        let filtro = { emailUser: { $regex: req.query.emailUser || '', $options: 'i' } }

        const pagina = req.query.pagina || 1;

        const paginacion_prestamosUser = await Prestamos.paginacionPrestamos(pagina, filtro, 5);

        return res.json({data:paginacion_prestamosUser, error:null});

    } catch (error) {
        console.log(error)
        return res.json({data:null, error:'error'});
    }

}



module.exports = {reservasEmailFind, prestamosEmailFind}