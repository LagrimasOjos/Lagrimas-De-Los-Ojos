const { buscarErrorMensaje } = require('../../errors/Messages');
const {sendEmail} = require('../../helper/utils');
const Semillas = require('../../models/db/semillas');
const path = require("path");
const paginaInicio = async(req,res) => {
    return res.view('public/index', {title: 'Inicio'});
}

const noscript = async(req,res) => {
        return res.sendFile(path.resolve(__dirname, "../../views/public/noscript.html"))
    
}

const semillasDetallesPagina = async(req,res) => {
        try {
            if(!req.params.id) throw new Error("Falta especificar el id");
            const semilla = await Semillas.semillaDetalles(req.params.id)
            return res.view('public/semilladetalles', {title:'Semilla Detalles', semilla});
        } catch (e) {
            return res.redirectMessage('/',buscarErrorMensaje(e.message));
        }
}

const contactoPage = (req, res) => {
    return res.view("public/contact", { title: "Contacto" });
}

const aboutPage = (req, res) => {
    return res.view("public/about", { title: "Sobre nosotros" });
}

const contactPost = async (req, res) => {
    try {
        const {email, phone, message} = req.body
        text = `${email} con tlf ${phone}: ${message}`
        await sendEmail({to:"lagrimasdelosojos@gmail.com", subject:"Mesaje de la pagina web", text})
        return res.redirectMessage('/', "El mensaje se ha enviado correctamente")
    } catch (error) {
        return res.redirectMessage('/',"El email no se ha podido enviar");
    }
}


module.exports = {paginaInicio, semillasDetallesPagina, contactoPage, aboutPage, noscript, contactPost};



