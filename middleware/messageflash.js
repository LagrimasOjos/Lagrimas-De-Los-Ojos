const FlashMessage = require('../models/db/flashmessage');
const flashMessage = (req, res, next) => {
    // Método para establecer el mensaje flash
    res.setFlash = async (key, message) => {
        const sessionId = req.sessionID;  // Usamos el ID de la sesión para asociar el mensaje
        const flashMessage = new FlashMessage({
            session_id: sessionId,
            key: key,
            message
        });

        await flashMessage.save();  // Guardamos el mensaje en la base de datos
    };

    // Método para obtener y eliminar el mensaje flash
    res.getFlash = async (key) => {
        const sessionId = req.sessionID;  // Usamos el ID de la sesión para asociar el mensaje
        
        // Buscamos el mensaje flash no mostrado en la base de datos
        const flashMessage = await FlashMessage.findOneAndUpdate(
            { session_id: sessionId, key: key, is_shown: false },
            { $set: { is_shown: true } },  // Marcamos el mensaje como mostrado
            { new: true }  // Retorna el documento actualizado
        );
        
        if (flashMessage) {
            // Eliminamos el mensaje de la base de datos después de mostrarlo
            await FlashMessage.deleteOne({ _id: flashMessage._id });
            
            return flashMessage.message;  // Devuelve el mensaje flash
        }
        
        return null;  // Si no hay mensaje flash, devolvemos null
    };

    next();
}

module.exports = flashMessage;