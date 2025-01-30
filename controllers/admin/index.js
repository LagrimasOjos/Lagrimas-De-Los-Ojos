const cpanelAdminPage = (req,res) => {
    return res.view('admin/index.ejs', {title:'Cpanel Administrador'});
}

module.exports = {cpanelAdminPage}