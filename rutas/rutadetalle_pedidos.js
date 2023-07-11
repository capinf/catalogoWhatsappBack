//////archivo de conexion
const express = require('express');
const ruteodetalle_pedidos = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion


//ruta para traer los detalles  un pedido en particular
ruteodetalle_pedidos.get('/detallepedidos/:id_cabecera_pedido', (req, res) => {
    const {
        id_cabecera_pedido
    } = req.params;
    mysqlConection.query('SELECT * FROM detalle_pedidos WHERE id_cabecera_pedido=?', [id_cabecera_pedido], (err, registros) => {
        if (!err) {
            if (registros.length === 0) {
                res.status(404).json({
                    message: "El ID de cabecera de pedido no se encontró en la tabla de la base de datos."
                });
            } else {
                res.json(registros);
            }
        } else {
            res.status(500).send('Error de conexión con el servidor al consultar el detalle de pedido');
            console.log(err)
        }
    })
});



//ruta para agregar un producto al detalle de pedido
ruteodetalle_pedidos.put('/creardetallepedidos/:id_cabecera_pedido', (req, res) => {
    const {
        id_cabecera_pedido
    } = req.params;
    const {
        id_producto,
        precio_lista,
        cantidad,
        descuentos_producto,
        precio_final,
        subtotal
    } = req.body
    let query = `INSERT INTO detalle_pedidos (id_cabecera_pedido, id_producto, precio_lista, cantidad, descuentos_producto, precio_final, subtotal) VALUES ('${id_cabecera_pedido}', '${id_producto}', '${precio_lista}', '${cantidad}', '${descuentos_producto}', '${precio_final}', '${subtotal}')`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El producto"' + id_producto + 'se ha agregado correctamente al pedido ' + id_cabecera_pedido);
        } else {
            console.log(err);
        }
    });
});

//ruta para editar los datos de un producto ó detalle de pedido
ruteodetalle_pedidos.put('/editardetallepedidos/:id_detalle_pedido', (req, res) => {
    const {
        id_detalle_pedido
    } = req.params;
    const {
        cantidad,
        descuentos_producto,
        precio_final,
        subtotal
    } = req.body
    let query = `UPDATE detalle_pedidos SET cantidad = '${cantidad}', descuentos_producto = '${descuentos_producto}', precio_final = '${precio_final}', subtotal = '${subtotal}', fecha_modificacion= current_timestamp() WHERE id_detalle_pedido = ${id_detalle_pedido};`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El detalle de pedido con ID' + id_detalle_pedido + ' se editó correctamente');
        } else {
            console.log(err);
        }
    });
});

//ruta para habilitar o deshabilitar un detalle de pedido
ruteodetalle_pedidos.put('/estadodetallepedidos/:id_detalle_pedido', (req, res) => {
    const {
        id_detalle_pedido
    } = req.params;
    const {
        estado
    } = req.body
    let query = `UPDATE detalle_pedidos SET estado = '${estado}', fecha_modificacion= current_timestamp() WHERE id_detalle_pedido = ${id_detalle_pedido};`;
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('El estado de detalle de pedido con ID' + id_detalle_pedido + ' se editó correctamente');
        } else {
            console.log(err);
        }
    });
});


//ruta para agregar un producto al detalle de pedido para un cliente en específico
ruteodetalle_pedidos.put('/2creardetallepedidos/:id_cliente', (req, res) => {
    const {
        id_cliente
    } = req.params;
    const {
        id_producto,
        precio_lista,
        cantidad,
        descuentos_producto,
        precio_final,
        subtotal
    } = req.body;

    // Primera consulta para obtener el último id_cabecera_pedido para el id_cliente especificado
    let buscandoCabecera = `SELECT id_cabecera_pedido FROM cabecera_pedidos WHERE id_cliente = ${id_cliente} ORDER BY id_cabecera_pedido DESC LIMIT 1`;

    mysqlConection.query(buscandoCabecera, (err, rows) => {
        if (!err) {
            let id_cabecera_pedido = rows[0].id_cabecera_pedido;

            // Segunda consulta para insertar el nuevo detalle de pedido
            let insertandoProducto = `INSERT INTO detalle_pedidos (id_cabecera_pedido, id_producto, precio_lista, cantidad, descuentos_producto, precio_final, subtotal) 
                          VALUES (${id_cabecera_pedido}, '${id_producto}', '${precio_lista}', '${cantidad}', '${descuentos_producto}', '${precio_final}', '${subtotal}')`;

                          mysqlConection.query(insertandoProducto, (err) => {
                if (!err) {
                    res.send(`El producto ${id_producto} se ha agregado correctamente al pedido ${id_cabecera_pedido}`);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
});



module.exports = ruteodetalle_pedidos

//directo al ignore