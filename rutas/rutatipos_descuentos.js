//////archivo de conexion
const express = require('express');
const ruteotipos_descuentos = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion


// libreria que utilizaremos para la generacion de nuesrto token
const jwt = require('jsonwebtoken');


//Ruta para listar todos los tipos de descuentos
ruteotipos_descuentos.get('/tiposdescuentos',  validarsesion, (req, res) => {
    
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from tipos_descuentos ORDER BY estado DESC, tipo_descuento', (err, registro) => {
                if (!err) {
                    res.json(registro);
                } else {
                    res.status(500).send('Error de conexión con el servidor al consultar el tipo de descuento');
                    console.log(err)
                }
            })
                 }
    })
});

//ruta para traer los datos de un descuento en particular
ruteotipos_descuentos.get('/tiposdescuentos/:id_tipo_descuento',  validarsesion, (req, res) => {
    const {
        id_tipo_descuento
    } = req.params;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from tipos_descuentos where id_tipo_descuento=?', [id_tipo_descuento], (err, registros) => {
                if (!err) {
                    if (registros.length === 0) {
                        res.status(404).json({
                            message: "El ID de Tipo de Descuento no se encontró en la tabla de la base de datos."
                        });
                    } else {
                        res.json(registros);
                    }
                } else {
                    res.status(500).send('Error de conexión con el servidor al consultar el tipo de descuento');
                    console.log(err)
                }
            })
                 }
    })
});



//ruta para agregar un tipo de descuento
ruteotipos_descuentos.post('/tiposdescuentos',  validarsesion, (req, res) => {
    const {
        tipo_descuento,
        descuento,
    } = req.body;

    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `INSERT INTO tipos_descuentos (tipo_descuento, descuento) VALUES ('${tipo_descuento}', '${descuento}')`;
            mysqlConection.query(query, (err) => {
                if (!err) {
                    res.send('Se insertó correctamente el Tipo de Descuento: ' + tipo_descuento);
                } else {
                    res.status(500).send('Error de conexión con el servidor al insertar el tipo de descuento');
                    console.log(err);
                }
            });
                 }
    })
});

//ruta para editar los datos de un tipo de descuento
ruteotipos_descuentos.put('/tiposdescuentos/:id_tipo_descuento',  validarsesion, (req, res) => {
    const {
        id_tipo_descuento
    } = req.params;
    const {
        tipo_descuento,
        descuento,
    } = req.body;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE tipos_descuentos SET tipo_descuento='${tipo_descuento}', descuento='${descuento}', fecha_modificacion= current_timestamp() WHERE id_tipo_descuento='${id_tipo_descuento}'`;
            mysqlConection.query(query, (err) => {
                if (!err) {
                    res.send('El tipo de descuento "' + tipo_descuento + '" con ID:' + id_tipo_descuento + ' se editó correctamente');
                } else {
                    console.log(err);
                }
            });
                 }
    })
});

//ruta para habilitar o deshabilitar un tipo de descuento
ruteotipos_descuentos.put('/estadostiposdescuentos/:id_tipo_descuento',  validarsesion, (req, res) => {
    const {
        id_tipo_descuento
    } = req.params;
    const {
        estado,
    } = req.body
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
        let query = `UPDATE tipos_descuentos SET estado='${estado}', fecha_modificacion= current_timestamp() WHERE id_tipo_descuento='${id_tipo_descuento}'`;
        mysqlConection.query(query, (err) => {
            if (!err) {
                res.send('Se cambió a "' +estado + '" el estado del descuento con ID ' + id_tipo_descuento);
            } else {
                console.log(err)
            }
        });
             }
    })
});



ruteotipos_descuentos.put('/bajaTipoDescuento/:id_tipo_descuento',  validarsesion, (req, res)=>{
    let id_tipo_descuento = req.params.id_tipo_descuento;
        jwt.verify(req.Token, 'chatGPT', (error) => {
            if (error) {
                res.sendStatus(403)
            } else {
    
            let query=`UPDATE tipos_descuentos SET estado='0' WHERE id_tipo_descuento='${id_tipo_descuento}'`;
            mysqlConection.query(query, (err, registros)=>{
            if(!err){
                res.json({
                    status: true,
                    mensaje:"El tipo de Descuento se dio de Baja correctamente"
                });
            }else{
                console.log(err)
            }
        })
    }
})
        
   
});




ruteotipos_descuentos.put('/altaTipoDescuento/:id_tipo_descuento',  validarsesion, (req, res)=>{
    let id_tipo_descuento = req.params.id_tipo_descuento;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
   
            let query=`UPDATE tipos_descuentos SET estado='1' WHERE id_tipo_descuento='${id_tipo_descuento}'`;
            mysqlConection.query(query, (err, registros)=>{
            if(!err){
                res.json({
                    status: true,
                    mensaje:"El tipo de Descuento se dio de alta correctamente"
                });
            }else{
                console.log(err)
            }
        })
    }
})

});



// Ruta para verificar la existencia del descuento
ruteotipos_descuentos.get('/tiposdescuentos/verificar/:tipo_descuento', (req, res)=>{
    const tipo_descuento = req.params.tipo_descuento;
    let query = `SELECT * FROM tipos_descuentos WHERE tipo_descuento = '${tipo_descuento}'`;
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
        req.Token = bearerToken;
        next();
    } else {
        res.send("Hubo un problema al autenticar la sesion");
    }
}






module.exports = ruteotipos_descuentos