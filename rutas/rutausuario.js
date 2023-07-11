//////archivo de conexion
const express = require('express');
const ruteousuarios = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion

///// libreria para la encriptacion de los password
const bcrypt = require('bcrypt');
///uso de libreria jwt para la generacion del token para validar la sesión iniciada
const jwt = require('jsonwebtoken');



//Ruta para listar todos los usuarios
ruteousuarios.get('/usuarios', validarsesion, (req, res) => {
    jwt.verify(req.Token, 'chatGPT', (error) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select *, DATE_FORMAT(fecha_nacimiento, "%d-%m-%Y") as fecha_formateada from usuarios ORDER BY estado DESC, usuario', (err, registro) => {
                if (!err) {
                    res.json(registro);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para traer los datos de un usuario particular
ruteousuarios.get('/usuarios/:id_usuario', validarsesion, (req, res) => {
    const { id_usuario } = req.params;
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from usuarios where id_usuario=?', [id_usuario], (err, registros) => {
                if (!err) {
                    res.json(registros);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para agregar un usuario
ruteousuarios.post('/usuarios', validarsesion, (req, res) => {
    const { usuario, password, correo_electronico, nombre, apellido, fecha_nacimiento, dni, celular } = req.body
    let hash = bcrypt.hashSync(password, 5)
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `INSERT INTO usuarios (usuario, password, correo_electronico, nombre, apellido, fecha_nacimiento, dni, celular) VALUES ('${usuario}','${hash}','${correo_electronico}','${nombre}','${apellido}','${fecha_nacimiento}','${dni}','${celular}')`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se inserto correctamente el usuario: ' + usuario);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para editar los datos de un usuario
ruteousuarios.put('/usuarios/:id_usuario', validarsesion, (req, res) => {
    const { id_usuario } = req.params;
    const { usuario, password, correo_electronico, nombre, apellido, fecha_nacimiento, dni, celular } = req.body
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            var query = `UPDATE usuarios SET usuario='${usuario}',correo_electronico='${correo_electronico}',nombre='${nombre}',apellido='${apellido}',fecha_nacimiento='${fecha_nacimiento}',dni='${dni}',celular='${celular}' WHERE id_usuario='${id_usuario}'`;
            if (password) {
                let hash = bcrypt.hashSync(password, 5)
                var query = `UPDATE usuarios SET usuario='${usuario}',password='${hash}',correo_electronico='${correo_electronico}',nombre='${nombre}',apellido='${apellido}',fecha_nacimiento='${fecha_nacimiento}',dni='${dni}',celular='${celular}' WHERE id_usuario='${id_usuario}'`;
            }
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.send('Se han editado los datos del usuario: ' + usuario);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para hacer el borrado logico de un usuario
ruteousuarios.put('/usuarios/d/:id_usuario', validarsesion, (req, res) => {
    let id_usuario = req.params.id_usuario;
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE usuarios SET estado=0 WHERE id_usuario='${id_usuario}'`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.json({
                        status: true,
                        mensaje: "El usuario ha sido dado de Baja correctamente"
                    });
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para volver a dar de alta un usuario
ruteousuarios.put('/usuarios/a/:id_usuario', validarsesion, (req, res) => {
    let id_usuario = req.params.id_usuario;
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            let query = `UPDATE usuarios SET estado=1 WHERE id_usuario='${id_usuario}'`;
            mysqlConection.query(query, (err, registros) => {
                if (!err) {
                    res.json({
                        status: true,
                        mensaje: "El usuario ha sido dado de Alta correctamente"
                    });
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para traer el nombre de usuario de un usuario particular
ruteousuarios.get('/usuarios/user/:usuario', validarsesion, (req, res) => {
    const usuario = req.params.usuario;
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from usuarios where usuario=?', [usuario], (err, registros) => {
                if (!err) {
                    res.send(registros);
                } else {
                    console.log(err)
                }
            })
        }
    })
});

//ruta para traer el mail de un usuario particular
ruteousuarios.get('/usuarios/correo/:correo', validarsesion, (req, res) => {
    const mail = req.params.correo;
    jwt.verify(req.Token, 'chatGPT', (error, valido) => {
        if (error) {
            res.sendStatus(403)
        } else {
            mysqlConection.query('select * from usuarios where correo_electronico=?', [mail], (err, registros) => {
                if (!err) {
                    res.send(registros);
                } else {
                    console.log(err)
                }
            })
        }
    })
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

module.exports = ruteousuarios