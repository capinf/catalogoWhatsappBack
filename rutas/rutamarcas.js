//////archivo de conexion
const express = require('express');
const ruteomarcas = express();
const mysqlConection = require('../conexion/db');
//////fin archivo de conexion

///uso de libreria jwt para la generacion del token para validar la sesión iniciada
const jwt = require("jsonwebtoken");

//Ruta para listar todos las marcas
ruteomarcas.get('/marcas', validarsesion, (req, res) => {
    jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
    mysqlConection.query('select * from marcas_productos ORDER BY estado DESC, marca ASC', (err, registro) => {
        if (!err) {
            res.json(registro);
        } else {
            console.log(err)
        }
    }
  );
}
});
});

//ruta para traer los datos de una marca particular
ruteomarcas.get('/marcas/:id_marca', validarsesion,(req, res) => {
    const { id_marca } = req.params;
    jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
    mysqlConection.query('select * from marcas_productos where id_marca_producto=?', [id_marca], (err, registros) => {
        if (!err) {
            res.json(registros);
        } else {
            console.log(err)
        }
    }
  );
}
});
});

//ruta para agregar una marca
ruteomarcas.post('/marcas', validarsesion,(req, res) => {
    const { marca } = req.body
    let query = `INSERT INTO marcas_productos (marca) VALUES ('${marca}')`;
    jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.json({
                status: true,
                mensaje: `La marca ${marca} fue >> CREADA <<  correctamente`
            });
        } else {
            console.log(err)
        }
    });
  }
});
});

//ruta para editar los datos de una marca
ruteomarcas.put("/marcas/:id_marca_producto", validarsesion,(req, res) => {
    const {id_marca_producto} = req.params;
    const {
        marca,
        estado,

    } = req.body

    let query = `UPDATE marcas_productos SET marca='${marca}', estado='${estado}', fecha_modificacion= current_timestamp() WHERE id_marca_producto='${id_marca_producto}'`;
    jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
    mysqlConection.query(query, (err) => {
        if (!err) {
            res.send('Se editó correctamente la marca "' + id_marca_producto +'"');
        } else {
            console.log(err)
        }
    });
  }
});
});

ruteomarcas.put('/altaMarca/:id_marca_producto', validarsesion,(req, res)=>{
    // asigna a id_marca_producto el valor que recibe por el parametro 
     let id_marca_producto  = req.params.id_marca_producto;
     let query=`UPDATE marcas_productos SET estado='1' WHERE id_marca_producto='${id_marca_producto}'`;
     let query2=`SELECT marca FROM marcas_productos where id_marca_producto='${id_marca_producto}'`;
     jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
     mysqlConection.query(query, (err)=>{
        if(!err){
            mysqlConection.query(query2, (err, result) => {
                if (!err) {
                    res.json({
                        status: true,
                        mensaje: `La marca "${result[0].marca}" fue dada de >> ALTA << correctamente`
                    });
                } else {
                    console.log(err)
                }
            });
          }
        });
      }
    });
  });



ruteomarcas.put('/bajaMarca/:id_marca_producto', validarsesion,(req, res)=>{
    // asigna a id_marca_producto el valor que recibe por el parametro 
     let id_marca_producto  = req.params.id_marca_producto;
     let query=`UPDATE marcas_productos SET estado='0' WHERE id_marca_producto='${id_marca_producto}'`;
     let query2=`SELECT marca FROM marcas_productos where id_marca_producto='${id_marca_producto}'`;
     jwt.verify(req.Token, "chatGPT", (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
     mysqlConection.query(query, (err)=>{
        if(!err){
            mysqlConection.query(query2, (err, result) => {
                if (!err) {
                    res.json({
                        status: true,
                        mensaje: `La marca "${result[0].marca}" fue dada de >> BAJA << correctamente`
                    });
                } else {
                    console.log(err)
                }
            });
          }
        });
      }
    });
  });

// Ruta para verificar la existencia de la marca
ruteomarcas.get('/marcas/verificar/:marca', (req, res)=>{
    const marca = req.params.marca;
    let query = `SELECT * FROM marcas_productos WHERE marca = '${marca}'`;
    mysqlConection.query(query, (err, registro)=>{
        if(!err){
            res.send(registro);
        } else {
            console.log(err);
            res.status(500).send('Error interno del servidor');
        }
    });
});


/// funcion para verificar la validez del token de JWT
function validarsesion(req, res, next) {
    const BearerHeader = req.headers["authorization"];
    if (typeof BearerHeader !== "undefined") {
      const bearerToken = BearerHeader.split(" ")[1];
      req.Token = bearerToken;
      next();
    } else {
      res.send("Hubo un problema al autenticar la sesion");
    }
  }


module.exports = ruteomarcas