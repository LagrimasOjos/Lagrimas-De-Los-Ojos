
class RenderMyView {
    constructor(req, res) {
        this.sessionUser = req.session?.user || null;
        this.req = req;
        this.res = res;
    }

    async view(pathView, { messageInfo = null, title = 'Ojos lagrimas', ...data }) {
        try {
            // Obtener el mensaje flash, si existe, sino asignar null
            let flash = await this.res.getFlash('info') || null;
        
            // Intentar guardar la sesión
            this.req.session.save(err => {
                if (err) {
                    console.error("Error al guardar la sesión:", err);
                    throw new Error("Hubo un error al guardar la sesión");
                }
            });
        
            // Preparar los datos para la vista
            const datos = {
                user: this.sessionUser,           // Usuario de la sesión
                message: messageInfo || null,     // Mensaje de información (puede ser null si no hay mensaje)
                info: flash,                      // Mensaje flash
                title: title || "Título predeterminado", // Título de la vista (valor predeterminado)
                ...data                           // Otros datos adicionales
            };
        
            // Renderizar la vista con los datos proporcionados
            return this.res.render(pathView, datos);
        
        } catch (error) {
            // Capturar y mostrar el error al intentar renderizar la vista
            console.error("Error al renderizar la vista:", error);
            throw new Error("Error al renderizar la vista. Consulta los detalles en la consola.");
        }
    }
}

const renderView = (req, res, next) => {
    const myView = new RenderMyView(req, res);
    res.view = myView.view.bind(myView);
    return next();
}

module.exports = {renderView};