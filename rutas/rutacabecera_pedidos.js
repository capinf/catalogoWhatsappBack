//////archivo de conexion
const express = require('express');
const ruteocabecerapedidos = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion



//Ruta para listar todas las cabeceras
ruteocabecerapedidos.get('/cabecerapedidos', (req, res) => {
    mysqlConection.query('select * from cabecera_pedidos', (err, registros) => {
        if (!err) {
            res.json(registros);
        } else {
            console.log(err)
        }
    })
});

//ruta para traer los datos de una cabecera particular
ruteocabecerapedidos.get('/cabecerapedidos/:id_cabecera_pedido', (req, res) => {
    const { id_cabecera_pedido } = req.params;
    mysqlConection.query('SELECT ca.id_cabecera_pedido, ca.id_cliente, ca.subtotal, ca.descuentos_total, ca.total, ca.estado, ca.fecha_registro, ca.fecha_modificacion, c.razon_social, tc.tipo_cliente, td.tipo_descuento, td.descuento FROM cabecera_pedidos ca INNER JOIN clientes c ON ca.id_cliente = c.id_cliente INNER JOIN tipos_clientes tc ON tc.id_tipo_cliente = c.id_tipo_cliente INNER JOIN tipos_descuentos td ON td.id_tipo_descuento =  c.id_tipo_descuento WHERE id_cabecera_pedido = ?', [id_cabecera_pedido], (err, registros) => {
        if (!err) {
            res.json(registros);
        } else {
            console.log(err)
        }
    })
});

//ruta para agregar una cabecera con estado "0"
ruteocabecerapedidos.post('/cabecerapedidos', (req, res) => {
    const {
        id_cliente,
        subtotal,
        descuentos_total,
        total
    } = req.body
    let query = `INSERT INTO cabecera_pedidos (id_cliente, subtotal, descuentos_total, total) VALUES (${id_cliente}, ${ subtotal}, ${descuentos_total}, ${total}, '0')`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('Se inserto correctamente nuestra cabecera de pedido');
        } else {
            console.log(err)
        }
    })
});

//ruta para editar los datos de una cabecera
ruteocabecerapedidos.put('/cabecerapedidos/:id_cabecera_pedido', (req, res) => {
    const {
        id_cabecera_pedido
    } = req.params;
    const {
        id_cliente,
        subtotal,
        descuentos_total,
        total,
        fecha_pedido

    } = req.body

    let query = `UPDATE cabecera_pedidos SET id_cliente = ${id_cliente}, subtotal = ${subtotal}, descuentos_total = ${descuentos_total}, total =${total}, fecha_pedido ='${fecha_pedido}',  fecha_modificacion = current_timestamp WHERE id_cabecera_pedido = ${id_cabecera_pedido}`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El Id que editamos es : ' + id_cabecera_pedido);
        } else {
            console.log(err)
        }
    });
});






//ruta para borrar logicamente los datos de una cabecera
ruteocabecerapedidos.put('/cabecerapedidos/d/:id_cabecera_pedido', (req, res) => {
    const {
        id_cabecera_pedido
    } = req.params;
    const {
        estado,
    } = req.body

    let query = `UPDATE cabecera_pedidos SET estado= 0, fecha_modificacion= current_timestamp() WHERE id_cabecera_pedido='${id_cabecera_pedido}'`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El Id que editamos es : ' + id_cabecera_pedido);
        } else {
            console.log(err)
        }
    });
});





module.exports = ruteocabecerapedidos 

//directo al .ignore