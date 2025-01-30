const mongoose = require('mongoose');
const {MessagesError} = require('../../errors/Messages');

const preferencesSchema = new mongoose.Schema({
    dayToCollect: {
        type: Number,
        default: 25
    },

    maximumSeedReserves: {
        type: Number,
        default: 100
    }
}, {
    collection: "preferences"
});

preferencesSchema.statics.modificar = async function(data) {
    try {
        let preferences = await this.findOne();
        
        if (!preferences) {
            preferences = await this.create({
                dayToCollect: data.dayToCollect || 100,
                maximumSeedReserves: data.maximumSeedReserves || 100
            });
        }

        if (data.dayToCollect !== undefined) {
            if (!Number(data.dayToCollect) || data.dayToCollect < 0) {
                throw new Error(MessagesError.Preferences.errorFormatoInvalido); // Usar el mensaje de error de Preferences
            }
            preferences.dayToCollect = data.dayToCollect;
        }

        if (data.maximumSeedReserves !== undefined) {
            if (!Number(data.maximumSeedReserves) || data.maximumSeedReserves < 0) {
                throw new Error(MessagesError.Preferences.errorFormatoInvalido); // Usar el mensaje de error de Preferences
            }
            preferences.maximumSeedReserves = data.maximumSeedReserves;
        }

        await preferences.save();
        return preferences;

    } catch (error) {
        throw new Error(error.message || MessagesError.Preferences.errorCreacionPrestamo || "Error desconocido");
    }
}


preferencesSchema.statics.getData = async function () {
    try {
        let preferences = await this.findOne();
        
        if (!preferences) {
            // Crear un nuevo documento con valores predeterminados explícitos si no existe
            preferences = await this.create({
                dayToCollect: 100,
                maximumSeedReserves: 25 
            });
        }

        return preferences;

    } catch (error) {
        console.log(error);
        throw new Error(error.message || MessagesError.Preferences.errorCreacionPrestamo || "Error desconocido");
    }
}



module.exports = mongoose.model('preference', preferencesSchema);
