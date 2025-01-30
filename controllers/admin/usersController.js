
const { createPassword, sendEmail } = require('../../helper/utils.js');
const Usuario = require('../../models/db/user.js')

const createUserSendPasswordEmail = async (req, res) => {
    try {
        const { name, phone, email } = req.body;
        const password = createPassword();
        const repassword = password;
        console.log(password);
        await Usuario.registerUser({ name, phone, email, password, repassword });
        await sendEmail({
            to: email,
            subject: 'Contraseña Lágrimas de los Ojos',
            text:'',
            html: `
              <!DOCTYPE html>
              <html lang="es">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Contraseña de tu cuenta</title>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                  }
                  .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                  }
                  .header {
                    text-align: center;
                    background-color: #FF7F00; /* Naranja */
                    padding: 20px;
                    border-radius: 8px 8px 0 0;
                  }
                  .header img {
                    max-width: 120px;
                  }
                  .content {
                    margin: 20px 0;
                    text-align: center;
                  }
                  .content h2 {
                    color: #333;
                  }
                  .content p {
                    color: #555;
                  }
                  .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #aaa;
                    padding: 10px;
                  }
                  .button {
                    display: inline-block;
                    background-color: #007BFF; /* Azul */
                    color: #ffffff;
                    padding: 10px 20px;
                    border-radius: 5px;
                    text-decoration: none;
                    font-weight: bold;
                  }
                  .button:hover {
                    background-color: #0056b3;
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="content">
                    <h2>Bienvenido a Lágrimas de los Ojos</h2>
                    <p>¡Hola!</p>
                    <p>Tu cuenta ha sido creada correctamente. Aquí tienes tus datos de acceso:</p>
                    <h3 style="color: #0056b3;">Tu email: <strong>${email}</strong></h3>
                    <h3 style="color: #FF7F00;">Tu Contraseña: <strong>${password}</strong></h3>
                    <p>Por favor, guarda esta información de manera segura.</p>
                    <p>Si tienes algún problema, no dudes en contactarnos.</p>
                  </div>
                  <div class="footer">
                    <p>Gracias por unirte a Lágrimas de los Ojos.</p>
                    <p>Si no solicitaste este registro, por favor ignora este correo.</p>
                  </div>
                </div>
              </body>
              </html>
            `
        });

        return res.redirectMessage('/admin/users/', `Se ha creado el usuario correctamente, los datos de acceso fueron mandados a su email: ${email}`);
    } catch (e) {
        console.log(e)
        return res.redirectMessage('/', 'Hubo un error al crear el usuario');
    }
}

const userCpanel = async (req,res) => {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const filter = {}; 
               
    const resultadoPaginacion = await Usuario.paginacionUsers(pagina, filter, limite);
   
  return res.view('admin/users/index.ejs', {title:'Cpanel usuarios', 
    usuarios: resultadoPaginacion.documentos,
    totalPaginas: resultadoPaginacion.totalPaginas,
    paginaActual: resultadoPaginacion.paginaActual,
    tieneMasPaginas: resultadoPaginacion.tieneMasPaginas,
  });
}

const eliminarUsuarioId = async (req,res) => {
  try {
    await Usuario.deleteUserId(req.body.idUser, req.body.borrarHistorico);
    return res.redirectMessage('/admin/usuarios/', 'Se borro correctamente el usuario');
  } catch (error) {
    return res.redirectMessage('/admin/usuarios/', 'hubo un error al borrar el usuario');
  }
  
}


module.exports = { createUserSendPasswordEmail, userCpanel, eliminarUsuarioId }


