//////archivo de conexion
const express = require('express');
const ruteoclientes = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion



//Ruta para listar todos los clientes
ruteoclientes.get('/clientes', (req, res) => {
    mysqlConection.query('SELECT id_cliente, tc.tipo_cliente, td.tipo_descuento, cuit, razon_social, direccion, email, contacto_tel, c.estado, c.fecha_registro, c.fecha_modificacion FROM v2catalogo_whatsapp.clientes c join tipos_clientes tc on tc.id_tipo_cliente=c.id_tipo_cliente    join tipos_descuentos td on td.id_tipo_descuento=c.id_tipo_descuento', (err, registro) => {
        if (!err) {
            res.json(registro);
        } else {
            console.log(err)
        }
    })
});


//ruta para traer los datos de un cliente en particular
ruteoclientes.get('/clientes/:id_cliente', (req, res) => {
    const {
        id_cliente
    } = req.params;
    mysqlConection.query('select * from clientes where id_cliente=?', [id_cliente], (err, registros) => {
        if (!err) {
            res.json(registros);
        } else {
            console.log(err)
        }
    })
});

//ruta para agregar un cliente
ruteoclientes.post('/clientes', (req, res) => {
    const { id_tipo_cliente, id_tipo_descuento, cuit, razon_social, direccion, email, contacto_tel } = req.body
    let query = `INSERT INTO clientes (id_tipo_cliente, id_tipo_descuento, cuit, razon_social, direccion, email, contacto_tel) VALUES ('${id_tipo_cliente}', '${id_tipo_descuento}', '${cuit}', '${razon_social}', '${direccion}', '${email}', '${contacto_tel}')`;
    mysqlConection.query(query, (err, registros) => {
        if (!err) {
            res.send('Se insertó correctamente el cliente: ' + razon_social);
        } else {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                res.status(400).send('El tipo de cliente o el tipo de descuento especificado no existe en la tabla de referencia');
            } else {
                res.json({
                    status: false,
                    mensaje: "Ocurrio un error al insertar el cliente"
                });
            };
        }
    });
});

//ruta para editar los datos de un cliente
ruteoclientes.put('/clientes/:id_cliente', (req, res) => {
    const {
        id_cliente
    } = req.params;
    const {
        id_tipo_cliente,
        id_tipo_descuento,
        cuit,
        razon_social,
        direccion,
        email,
        contacto_tel,
    } = req.body
    let query = `UPDATE clientes SET id_tipo_cliente='${id_tipo_cliente}', id_tipo_descuento='${id_tipo_descuento}', cuit='${cuit}', razon_social='${razon_social}', direccion='${direccion}', email='${email}', contacto_tel='${contacto_tel}', fecha_modificacion= current_timestamp() WHERE id_cliente='${id_cliente}'`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El Cliente ' + razon_social + ' con ID:' + id_cliente + ' se editó correctamente');
        } else {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                res.status(400).send('El tipo de cliente o el tipo de descuento especificado no existe en la tabla de referencia');
            } else {
                res.status(500).send('Error al insertar el cliente');
            }
            console.log(err);
        }
    });
});

//ruta para hacer el borrado logico de un usuario
ruteoclientes.put('/clientes/d/:id_cliente', (req, res) => {
    let id_cliente = req.params.id_cliente;
    // jwt.verify(req.token, 'chatGPT', (error, valido)=>{
    //     if (error){
    //         res.sendStatus(403)
    //     }else{
    let query = `UPDATE clientes SET estado=0 WHERE id_cliente='${id_cliente}'`;
    mysqlConection.query(query, (err, registros) => {
        if (!err) {
            res.json({
                status: true,
                mensaje: "El cliente ha sido dado de Baja correctamente"
            });
        } else {
            console.log(err)
        }
    });
}
);


//ruta para volver a dar de alta un usuario
ruteoclientes.put('/clientes/a/:id_cliente', (req, res) => {
    let id_cliente = req.params.id_cliente;
    // jwt.verify(req.token, 'chatGPT', (error, valido)=>{
    //     if (error){
    //         res.sendStatus(403)
    //     }else{
    let query = `UPDATE clientes SET estado=1 WHERE id_cliente='${id_cliente}'`;
    mysqlConection.query(query, (err, registros) => {
        if (!err) {
            res.json({
                status: true,
                mensaje: "El cliente ha sido dado de Alta correctamente"
            });
        } else {
            console.log(err)
        }
    });
}
);


// Ruta para verificar la existencia del CUIT
ruteoclientes.get('/clientes/cuit/:cuit', (req, res)=>{
    const cuit = req.params.cuit;
    let query = `SELECT * FROM clientes WHERE cuit = '${cuit}'`;
    mysqlConection.query(query, (err, registros)=>{
        if(!err){
            res.send(registros);
        } else {
            console.log(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});



/// funcion para verificar la validez del token de JWT
function validarsesion(req, res, next) {
    const BearerHeader = req.headers['authorization']
    if (typeof BearerHeader !== 'undefined') {
        const bearerToken = BearerHeader.split(" ")[1]
        req.token = bearerToken;
        next();
    } else {
        res.send("Hubo un problema al autenticar la sesion");
    }
}









module.exports = ruteoclientes