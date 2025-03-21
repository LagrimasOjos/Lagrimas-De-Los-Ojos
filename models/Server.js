const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fileUpload = require('express-fileupload');
const { notLogged, loggedAndRol } = require('../middleware/user');
const flashMessage = require('../middleware/messageflash');
const { renderView } = require('../middleware/renderview');
const { getPublicPath } = require('../middleware/publicPath');
const { redirectWidthMsg } = require('../middleware/redirectWidthMessage');
const expressLayouts = require('express-ejs-layouts');
const { logout } = require('../controllers/auth/authController');
const nocache = require("nocache");
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const cors = require('cors');

class Server {
    constructor() {
        this.path = {
            auth: '/auth',
            public: '/',
            admin: '/admin',
            user: '/me',
            api: '/api',
            logout: '/logout',
        };

        this.app = express();
        this.middleware();
        this.routes();
    }

    middleware() {

        this.app.use(helmet({ contentSecurityPolicy: false }));
        
        this.app.use(cors({origin: process.env.DOMAIN}));

        const limiter = rateLimit({
            windowMs: 5 * 60 * 1000,
            max: 550,
            message: "Demasiadas solicitudes, por favor intente de nuevo más tarde.",
            standardHeaders: true,
            legacyHeaders: false,
        });

        this.app.use(limiter);

        // Configuración de vistas
        this.app.set('views', path.join(__dirname, '../views'));
        this.app.set('view engine', 'ejs');
        this.app.use(cookieParser());


        this.app.use(expressLayouts);
        this.app.set('layout', 'layout');

        // Middlewares básicos
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(mongoSanitize());
        this.app.use(xss());
        // Sesiones
        this.app.use(
            session({
                secret: process.env.CLAVESESSIONES,
                resave: false,
                saveUninitialized: true, //IMPORTANTE PARA LOS RedirectWidthMsg
                store: MongoStore.create({
                    mongoUrl: `${process.env.MONGOURI}/sesiones`,
                    collectionName: 'sessions',
                }),
                cookie: {
                    maxAge: 6000 * 60 * 60, // 1 hora
                    httpOnly: true,  // Impide el acceso desde JavaScript
                    sameSite: 'strict',  // Previene el envío de cookies en solicitudes de otros sitios
                }
            })
        );

        this.app.use(getPublicPath);

        this.app.use(flashMessage);

        this.app.use(redirectWidthMsg);

        this.app.use(this.path.api, require('../routes/api/indexApiRouter'));

        //No guarde la
        this.app.use(nocache());


        // Middleware para gestionar vistas
        this.app.use(renderView);

        // Middleware para subir archivos
        this.app.use(fileUpload());

    }

    routes() {
        // Rutas públicas
        this.app.use(this.path.public, require('../routes/public/publicRouter'));

        // Rutas de autenticación
        this.app.use(this.path.auth, [notLogged], require('../routes/auth/authRouter'));

        // Ruta para cerrar sesión
        this.app.use(this.path.logout, [loggedAndRol(['user', 'admin'])], logout);

        // Rutas de administrador
        this.app.use(this.path.admin, [loggedAndRol(['admin'])], require('../routes/admin/indexRouter'));

        this.app.use(this.path.user, [loggedAndRol(['user'])], require('../routes/user/indexRouter'));

        //Api publica, user, administradores
        this.app.use(this.path.api, require('../routes/api/indexApiRouter'));

    }

    listen() {
        const port = process.env.PORT || 3000;
        this.app.listen(port, () => {
            console.log(`Servidor funcionando en el puerto ${port}`);
        });
    }
}

module.exports = Server;

