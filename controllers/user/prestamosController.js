const Prestamos = require('../../models/db/prestamos');

const prestamosCpanel = async(req,res) => {
    try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = 10;
            const filter = {idUser:req.session.userId}; 
            
            const resultadoPaginacion = await Prestamos.paginacionPrestamos(pagina, filter, limite);
    
            return res.view('user/prestamos/index.ejs', {
                prestamos: resultadoPaginacion.documentos,
                totalPaginas: resultadoPaginacion.totalPaginas,
                paginaActual: resultadoPaginacion.paginaActual,
                tieneMasPaginas: resultadoPaginacion.tieneMasPaginas,
            });
        } catch (e) {
            return res.redirectMessage('/', 'Hubo un error al mostrar la pagina');
        }
}

module.exports = {prestamosCpanel}