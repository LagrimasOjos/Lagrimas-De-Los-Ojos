const { buscarErrorMensaje } = require('../../errors/Messages');
const Preferencias = require('../../models/db/preferences');

const modificarPreferencias = async (req, res) => {
    try {
        const modificado = await Preferencias.modificar(req.body);
        return res.redirectMessage('/admin/', 'Se cambiaron correctamente las preferencias');
    } catch (e) {
        return res.redirectMessage('/admin/', buscarErrorMensaje(e.message));
    }
}

module.exports = { modificarPreferencias }