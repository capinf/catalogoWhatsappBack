//////archivo de conexion
const express= require('express');
const ruteoprincipal = express();
//const mysqlConection = require('../conexion/db');
//////fin archivo de conexion

///// libreria que utilizaremos para la encriptacion de los password
//const bcrypt= require('bcrypt');



//pantalla principal
ruteoprincipal.get('/', (req, res)=>{
    res.send('Pantalla principal');
});


module.exports = ruteoprincipal