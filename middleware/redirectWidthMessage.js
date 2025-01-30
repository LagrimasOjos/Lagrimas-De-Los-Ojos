const redirectWidthMsg = (req, res, next) => {
    res.redirectMessage = function (url, message = '') {
        res.setFlash('info', message);
        return req.session.save(err => {
            if (err) return res.send('Hubo un error al guardar la sesion');
            return res.redirect(url);
        });

    }
    
    return next();
}

module.exports = { redirectWidthMsg };