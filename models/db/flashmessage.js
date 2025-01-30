const mongoose = require('mongoose');

// Definir el esquema de mensajes flash
const flashMessageSchema = new mongoose.Schema({
    session_id: { type: String, required: true },
    key: { type: String, required: true },
    message: { type: String},
    created_at: { type: Date, default: Date.now },
    is_shown: { type: Boolean, default: false }
});

// Crear el modelo basado en el esquema
const FlashMessage = mongoose.model('FlashMessage', flashMessageSchema);

module.exports = FlashMessage;
