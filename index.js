////constantes

const morgan =require('morgan')
const express= require('express');
const app = express();
const bcrypt =require('bcrypt')
const cors =require('cors')

/////solucion conexion BD si no funciona la app.use
//const rutas = require('./Rutas/rutausuario.js')
//app.use(rutas)

app.use(cors())

//configuraciones
app.set('puerto' , process.env.PORT || 3300);

// middlewares
app.use(morgan('dev'));

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type', 'Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.use(express.json());
app.use(require('./rutas/rutaprincipal'));
app.use(require('./rutas/rutausuario'));
app.use(require('./rutas/rutaproductos'));
app.use(require('./rutas/rutacategorias'));
app.use(require('./rutas/rutacabecera_pedidos'));
app.use(require('./rutas/rutatipos_clientes'));
app.use(require('./rutas/rutalogin'));
app.use(require('./rutas/rutaclientes'));
app.use(require('./rutas/rutamarcas'));
app.use(require('./rutas/rutatipos_descuentos'));
app.use(require('./rutas/rutadetalle_pedidos'));


// inicia el servidor NODE
app.listen(app.get('puerto'), ()=>{
    console.log('El servidor backend esta corriendo en el puerto',app.get('puerto') )
})