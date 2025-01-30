const Seeds = require('../../../models/db/semillas');

const paginateSeeds = async (req, res) => {
    try {

        let filtro = {
            $and: [
                { nombre: { $regex: req.query.nameseed || '', $options: 'i' } },
                { activo: true }
            ]
        };

        const seeds = await Seeds.paginacionSemilla(req.query.page || 1, filtro, 3);

        return res.json({ data: seeds, error: null });

    } catch (error) {
        return res.status(500).json({ data: null, error: 'err' });
    }
}

const userLogin = async (req, res) => {
    try {
        // Verificar si req.session está definido y contiene userId y user
        const isUserActive = req.session && req.session.userId && req.session.user;
        
        return res.json({
            data: isUserActive ? true : false,
            error: null
        });
    } catch (error) {
        console.error('Error en el servidor:', error);
        return res.status(500).json({
            data: null,
            error: 'Ocurrió un error en el servidor'
        });
    }
}

module.exports = { paginateSeeds, userLogin };