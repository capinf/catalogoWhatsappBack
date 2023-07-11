//////archivo de conexion
const express = require('express');
const ruteocategorias = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion

///uso de libreria jwt para la generacion del token para validar la sesión iniciada
const jwt = require('jsonwebtoken');


//Ruta para listar todos las categorias
ruteocategorias.get('/categorias', validarsesion,(req, res) => {
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from categorias_productos ORDER BY estado DESC, categoria ASC', (err, registro) => {
                if (!err) {
                    res.json(registro);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para traer los datos de una categoría en particular
ruteocategorias.get('/categorias/:id_categoria', validarsesion,(req, res) => {
    
    const {
        id_categoria
    } = req.params;

    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
    


            mysqlConection.query('select * from categorias_productos where id_categoria_producto=?', [id_categoria], (err, registros) => {
                if (!err) {
                    res.json(registros);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para agregar una categoría
ruteocategorias.post('/categorias', validarsesion,(req, res) => {
    const {
        categoria
    } = req.body
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `INSERT INTO categorias_productos (categoria) VALUES ('${categoria}')`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se inserto correctamente la categoría: ' + categoria);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para editar los datos de una categoría
ruteocategorias.put('/categorias/:id_categoria',  validarsesion, (req, res) => {
    const {
        id_categoria
    } = req.params;
    const {
        categoria,
    } = req.body

    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
                    
            let query = `UPDATE categorias_productos SET categoria='${categoria}', fecha_modificacion= current_timestamp() WHERE id_categoria_producto='${id_categoria}'`;
            mysqlConection.query(query, (err) => {
                if (!err) {
                    res.send('La categoría "' + categoria + '" con ID:' + id_categoria + ' se editó correctamente');;
                } else {
                    console.log(err)
                }
            })
        }
    })
});


//ruta para habilitar o deshabilitar  categoria
ruteocategorias.put('/estadoscategorias/:id_categoria', (req, res) => {
    const {
        id_categoria
    } = req.params;
    const {
        estado,
    } = req.body
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE categorias_productos SET estado='${estado}', fecha_modificacion= current_timestamp() WHERE id_categoria_producto='${id_categoria}'`;
            mysqlConection.query(query, (err) => {
                if (!err) {
                    res.send('Se cambió a "' +estado + '" el estado de la categoría con ID ' + id_categoria);
                } else {
                    console.log(err)
                }
            })
        }
    })
});



ruteocategorias.put('/altaCategoria/:id_categoria', validarsesion, (req, res)=>{
    // asigna a id_usuario el valor que recibe por el parametro 
     let id_categoria  = req.params.id_categoria;
     let query=`UPDATE categorias_productos SET estado='1' WHERE id_Categoria_producto='${id_categoria}'`;
     jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query(query, (err, registros)=>{
                if(!err){
                    res.json({
                        status: true,
                        mensaje:"La categoria se dio de Alta correctamente"
                    });
                }else{
                    console.log(err)
                }
            })
        }
    })
});



ruteocategorias.put('/bajaCategoria/:id_categoria', validarsesion, (req, res)=>{
    // asigna a id_usuario el valor que recibe por el parametro 
     let id_categoria  = req.params.id_categoria;
     let query=`UPDATE categorias_productos SET estado='0' WHERE id_categoria_producto='${id_categoria}'`;
     jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query(query, (err, registros)=>{
                if(!err){
                    res.json({
                        status: true,
                        mensaje:"La categoría se dio de BAJA correctamente"
                    });
                }else{
                    console.log(err)
                }
            })
        }
    })
    
});



// Ruta para verificar la existencia de la categoria
ruteocategorias.get('/categorias/verificar/:categoria', (req, res)=>{
    const categoria = req.params.categoria;
    let query = `SELECT * FROM categorias_productos WHERE categoria = '${categoria}'`;
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







module.exports = ruteocategorias