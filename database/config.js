const mongoose = require('mongoose');

require('dotenv').config();

const dbConnection = async () => {

    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
        });

        console.log('Base de Datos en linea');

    } catch (error) {
        console.log(error);
        throw new Error('Erro al iniciar la BD logs')
    }

}

module.exports = {
    dbConnection
}