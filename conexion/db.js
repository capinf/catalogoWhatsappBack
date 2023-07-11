// conexion a la Base de datos

//uso mysql2 porque node no soporta la autenticacion a la BD por mysql comun por algun motivo.
const mysql = require('mysql');

//hago la conexion
const mysqlConnection = mysql.createConnection({
    host: 'mysql.elproveedor.com.ar',
    user: 'silicon',
    password: 'AbM.db.2017.silicon',
    database: 'v2catalogo_whatsapp'
});

mysqlConnection.connect(function(err){
    if(err){
        console.log('mi error es', err)
        return;
    }else{
        console.log('El backend se ha conectado correctamente a la Base de Datos')
    }
})

module.exports = mysqlConnection

