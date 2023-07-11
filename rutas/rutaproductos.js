//////archivo de conexion
const express = require("express");
const ruteoproductos = express();
const mysqlConection = require("../conexion/db");
//////fin archivo de conexion

///uso de libreria jwt para la generacion del token para validar la sesión iniciada
const jwt = require("jsonwebtoken");

//Ruta para listar todos los productos
ruteoproductos.get("/productos", validarsesion, (req, res) => {
  jwt.verify(req.Token, "chatGPT", (error) => {
    if (error) {
      res.sendStatus(403);
    } else {
      mysqlConection.query(
        "SELECT m.marca, c.categoria, p.id_producto, p.sku, p.nombre, p.imagen, p.thumb, p.precio_lista, p.disponibilidad, p.estado FROM productos AS p JOIN marcas_productos AS m ON p.id_marca_producto = m.id_marca_producto JOIN categorias_productos AS c ON p.id_categoria_producto = c.id_categoria_producto ORDER BY p.estado DESC, p.disponibilidad DESC, p.nombre ASC;",
        (err, registro) => {
          if (!err) {
            res.json(registro);
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

//ruta para traer los datos de un producto particular
ruteoproductos.get("/productos/:id_producto", validarsesion, (req, res) => {
  const { id_producto } = req.params;
  jwt.verify(req.Token, "chatGPT", (error) => {
    if (error) {
      res.sendStatus(403);
    } else {
      mysqlConection.query(
        "select * from productos where id_producto=?",
        [id_producto],
        (err, registros) => {
          if (!err) {
            res.json(registros);
          } else {
            console.log(err);
          }
        }
      );
    }
  });
});

// Ruta para verificar la existencia del SKU
ruteoproductos.get("/productos/sku/:sku", (req, res) => {
  const sku = req.params.sku;
  let query = `SELECT * FROM productos WHERE sku = '${sku}'`;
  mysqlConection.query(query, (err, registros) => {
    if (!err) {
      res.send(registros);
    } else {
      console.log(err);
      res.status(500).send("Error interno del servidor");
    }
  });
});

//ruta para agregar un producto

ruteoproductos.post("/productos", validarsesion, (req, res) => {
  const {
    id_marca_producto,
    id_categoria_producto,
    sku,
    nombre,
    descripcion,
    ux_bulto,
    imagen,
    precio_lista,
  } = req.body;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      let query = `INSERT INTO productos (id_marca_producto, id_categoria_producto, sku, nombre, descripcion, ux_bulto, imagen, precio_lista) VALUES ('${id_marca_producto}', '${id_categoria_producto}', '${sku}', '${nombre}', '${descripcion}', '${ux_bulto}', '${imagen}', '${precio_lista}')`;
      mysqlConection.query(query, (err, registros) => {
        if (!err) {
          res.send("Se inserto correctamente nuestro producto: " + nombre);
        } else {
          console.log(err);
        }
      });
    }
  });
});

//ruta para editar los datos de un producto
ruteoproductos.put("/productos/:id_producto", validarsesion, (req, res) => {
  const { id_producto } = req.params;
  const {
    id_marca_producto,
    id_categoria_producto,
    sku,
    nombre,
    descripcion,
    ux_bulto,
    imagen,
    precio_lista,
    disponibilidad,
    estado,
  } = req.body;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      let query = `UPDATE productos SET id_marca_producto = '${id_marca_producto}', id_categoria_producto = '${id_categoria_producto}', sku = '${sku}', nombre ='${nombre}', descripcion ='${descripcion}', ux_bulto = '${ux_bulto}', imagen = '${imagen}', precio_lista = '${precio_lista}', disponibilidad = '${disponibilidad}', estado = '${estado}', fecha_modificacion = current_timestamp WHERE id_producto = ${id_producto}`;
      mysqlConection.query(query, (err, registros) => {
        if (!err) {
          res.send('El producto "' + nombre + '" se editó correctamente.');
        } else {
          console.log(err);
        }
      });
    }
  });
});

ruteoproductos.put("/altaProducto/:id_producto", validarsesion,(req, res) => {
  // asigna a id_producto el valor que recibe por el parametro
  let id_producto = req.params.id_producto;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
  
  let query = `UPDATE productos SET estado='1' WHERE id_producto='${id_producto}'`;
  let query2 = `SELECT nombre FROM productos where id_producto='${id_producto}'`;

  
      mysqlConection.query(query, (err) => {
        if (!err) {
          mysqlConection.query(query2, (err, result) => {
            if (!err) {
              res.json({
                status: true,
                mensaje: `Producto ${result[0].nombre} dado de "ALTA" correctamente`,
              });
            } else {
              console.log(err);
            }
          });
        }
      });
    }
  });
});

ruteoproductos.put("/bajaProducto/:id_producto", validarsesion, (req, res) => {
  // asigna a id_producto el valor que recibe por el parametro
  let id_producto = req.params.id_producto;
 
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      
      let query = `UPDATE productos SET estado='0' WHERE id_producto='${id_producto}'`;
      let query2 = `SELECT nombre FROM productos where id_producto='${id_producto}'`;
      mysqlConection.query(query, (err) => {
        if (!err) {
          mysqlConection.query(query2, (err, result) => {
            if (!err) {
              res.json({
                status: true,
                mensaje: `Producto ${result[0].nombre} dado de "BAJA" correctamente`,
              });
            } else {
              console.log(err);
            }
          });
        }
      });
    }
  });
});

//Ruta para setear un producto disponible //
ruteoproductos.put("/ProductoDisponible/:id_producto", validarsesion,(req, res) => {
  // asigna a id_producto el valor que recibe por el parametro
  let id_producto = req.params.id_producto;
  let query = `UPDATE productos SET disponibilidad='1' WHERE id_producto='${id_producto}'`;
  let query2 = `SELECT nombre FROM productos where id_producto='${id_producto}'`;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      mysqlConection.query(query, (err) => {
        if (!err) {
          mysqlConection.query(query2, (err, result) => {
            if (!err) {
              res.json({
                status: true,
                mensaje: `Producto ${result[0].nombre} "DISPONIBLE"`,
              });
            } else {
              console.log(err);
            }
          });
        }
      });
    }
  });
});

//Ruta para setear un NO producto disponible //
ruteoproductos.put("/ProductoNoDisponible/:id_producto", validarsesion, (req, res) => {
  // asigna a id_producto el valor que recibe por el parametro
  let id_producto = req.params.id_producto;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      let query = `UPDATE productos SET disponibilidad='0' WHERE id_producto='${id_producto}'`;
      let query2 = `SELECT nombre FROM productos where id_producto='${id_producto}'`;
      mysqlConection.query(query, (err) => {
        if (!err) {
          mysqlConection.query(query2, (err, result) => {
            if (!err) {
              res.json({
                status: true,
                mensaje: `Producto ${result[0].nombre} "NO DISPONIBLE"`,
              });
            } else {
              console.log(err);
            }
          });
        }
      });
    }
  });
});

//ruta para traer un SKU de un producto particular
ruteoproductos.get("/productos/:id_producto", validarsesion,(req, res) => {
  const { id_producto } = req.params;
  jwt.verify(req.Token, "chatGPT", (error, valido) => {
    if (error) {
      res.sendStatus(403);
    } else {
      mysqlConection.query(
        "select * from productos where id_producto=?",
        [id_producto],
        (err, registros) => {
          if (!err) {
            res.json(registros);
          } else {
            console.log(err);
          }
        }
      );
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

module.exports = ruteoproductos;
