//////archivo de conexion
const express = require('express');
const ruteotipos_clientes = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion


// libreria que utilizaremos para la generacion de nuesrto token
const jwt= require('jsonwebtoken');



//Ruta para listar todas las categorias de clientes
ruteotipos_clientes.get('/tipo_Clientes',validarsesion, (req, res) => {
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from tipos_clientes ORDER BY estado DESC, tipo_cliente', (err, registro) => {
                if (!err) {
                    res.json(registro);
                } else {
                    console.log(err)
                }
            })
        }
    })
}
);

//ruta para traer los datos de un tipo de clientes en particular
ruteotipos_clientes.get('/tipo_clientes/:id_tipo_cliente', validarsesion,(req, res) => {
    const { id_tipo_cliente } = req.params;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from tipos_clientes where id_tipo_cliente=?', [id_tipo_cliente], (err, registros) => {
                if (!err) {
                    res.json(registros);
                } else {
                    console.log(err)
                }
            })
        }
    })
}
);

//ruta para agregar un tipo de clientes
ruteotipos_clientes.post('/tipo_clientes', validarsesion, (req, res) => {
    const { tipo_cliente } = req.body
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `INSERT INTO tipos_clientes (tipo_cliente) VALUES ('${tipo_cliente}')`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se inserto correctamente el tipo de clientes: ' + tipo_cliente);
                } else {
                    console.log(err)
                }
            })
        }
    })
}
);

//ruta para editar los datos de un tipo de clientes
ruteotipos_clientes.put('/tipo_clientes/:id_tipo_cliente', validarsesion,(req, res) => {
    const { id_tipo_cliente } = req.params;
    const { tipo_cliente } = req.body
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE tipos_clientes SET tipo_cliente='${tipo_cliente}' WHERE id_tipo_cliente='${id_tipo_cliente}'`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se han editado los datos del tipo de cliente: ' + tipo_cliente);
                } else {
                    console.log(err)
                }
            });
        }
    })
}
);


//ruta para hacer el borrado logico de un tipo de clientes
ruteotipos_clientes.put('/tipo_clientes/d/:id_tipo_cliente', validarsesion,(req, res) => {
    const { id_tipo_cliente } = req.params;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE tipos_clientes SET estado=0 WHERE id_tipo_cliente='${id_tipo_cliente}'`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se ha dado de baja correctamente el tipo de cliente: ' + id_tipo_cliente);
                } else {
                    console.log(err)
                }
            });
        }
    })
}
);

//ruta para volver a dar de alta un tipo de clientes
ruteotipos_clientes.put('/tipo_clientes/a/:id_tipo_cliente', validarsesion,(req, res) => {
    const { id_tipo_cliente } = req.params;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE tipos_clientes SET estado=1 WHERE id_tipo_cliente='${id_tipo_cliente}'`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se ha dado de alta nuevamente el tipo de clientes: ' + id_tipo_cliente);
                } else {
                    console.log(err)
                }
            });
        }
    })
}
);




ruteotipos_clientes.put('/altaTipoCliente/:id_tipo_cliente', validarsesion,(req, res)=>{
     let id_tipo_cliente  = req.params.id_tipo_cliente;
     let query=`UPDATE tipos_clientes SET estado='1' WHERE id_tipo_cliente='${id_tipo_cliente}'`;
     jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query(query, (err, registros)=>{
                if(!err){
                    res.json({
                        status: true,
                        mensaje:"El tipo de Cliente se dio de Alta correctamente"
                    });
                }else{
                    console.log(err)
                }
            })
        }
    })
    
});

ruteotipos_clientes.put('/bajaTipoCliente/:id_tipo_cliente', validarsesion,(req, res)=>{
    let id_tipo_cliente  = req.params.id_tipo_cliente;
    let query=`UPDATE tipos_clientes SET estado='0' WHERE id_tipo_cliente='${id_tipo_cliente}'`;
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query(query, (err, registros)=>{
            if(!err){
                res.json({
                    status: true,
                    mensaje:"El tipo de Cliente se dio de Baja correctamente"
                });
            }else{
                console.log(err)
            }
        })
    }
})
        
   
});



// Ruta para verificar la existencia del tipo de cliente
ruteotipos_clientes.get('/tiposclientes/verificar/:nombre_tipo_cliente', (req, res)=>{
    const nombre_tipo_cliente = req.params.nombre_tipo_cliente;
    let query = `SELECT * FROM tipos_clientes WHERE tipo_cliente = '${nombre_tipo_cliente}'`;
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

module.exports = ruteotipos_clientes