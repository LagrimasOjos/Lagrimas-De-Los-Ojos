const Reservas = require('../../../models/db/reservas');
const Usuario = require('../../../models/db/user');
const reservasUserId = async (req,res) => {

    try {
    
        if(!req.query.idUser) throw new Error("Es necesario pasar todos los parametros");

        const user = await Usuario.findById(req.query.idUser);

        if(!user) throw new Error("No se ha encontrado el usuario");

        const pagina = req.query.pagina || 1;

        const paginacion_reservasUser = await Reservas.paginacionReservas(pagina, {idUser:req.query.idUser}, 4);

        return res.json({data:paginacion_reservasUser, error:null});

    } catch (error) {
        console.log(error)
        return res.json({data:null, error:'error'});
    }


}


module.exports = {reservasUserId}