require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const {dbConnection} = require('./database/config')

//Servidor express
const app = express();

//Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();
//Rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/invitations', require('./routes/invitations'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});