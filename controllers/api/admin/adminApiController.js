const Reservas = require('../../../models/db/reservas');
const Usuario = require('../../../models/db/user');
const reservasUserId = async (req,res) => {

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


module.exports = {reservasUserId}