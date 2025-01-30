require('dotenv').config();
const mongoose = require('mongoose');
const chekearCaducidad = require('./helper/chekearCaducidad');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGOURI)
    .then(() => {
        const Server = require('./models/Server');
        const server = new Server();
        server.listen();
        chekearCaducidad();
    })
    .catch((err) => console.log(err));