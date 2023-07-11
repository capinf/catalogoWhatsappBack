//////archivo de conexion
const express = require('express');
const ruteologin = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion

///uso de libreria bcrypt para desencriptar la contraseña
const bcrypt = require('bcrypt');
///uso de libreria jwt para la generacion del token para validar la sesión iniciada
const jwt = require('jsonwebtoken');


ruteologin.post('/login', (req, res) => {
    const { usuario, password } = req.body
    if (usuario != undefined && password != undefined) {
        mysqlConection.query('SELECT u.usuario, u.password, u.nombre, u.apellido from usuarios AS u WHERE u.estado=1 AND u.usuario=?', [usuario], (err, rows) => {
            if (!err) {
                if (rows.length != 0 && rows.length != undefined) {
                    const comparapassword = bcrypt.compareSync(password, rows[0].password);
                    if (comparapassword) {
                        jwt.sign({ rows }, 'chatGPT', (err, token) => {
                            res.json(
                                {
                                    status: true,
                                    Logueado: rows,
                                    Token: token
                                });
                        });
                    } else {
                        res.json(
                            {
                                status: false,
                                mensaje: "El usuario y/o la contraseña no corresponden a un usuario registrado en la base de datos"
                            });
                    }
                } else {
                    res.json(
                        {
                            status: false,
                            mensaje: "El usuario y/o la contraseña no corresponden a un usuario registrado en la base de datos"
                        });

                }
            } else {
                res.json(
                    {
                        status: false,
                        mensaje: "Error en el servidor"
                    });
            }
        })
    } else {
        res.json({
            status: false,
            mensaje: "Faltan completar datos"
        });
    }

});

module.exports = ruteologin
