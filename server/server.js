require('./config/config')
const express  = require('express');
const mongoose = require('mongoose');
const path     = require('path');

const app = express();

const bodyParser = require('body-parser')
//parse application/x-www-form urlencoded

app.use(bodyParser.urlencoded({ extended: false }));
//parse aplication/json

app.use(bodyParser.json());

//habilitar la carpeta public

app.use(express.static(path.resolve(__dirname , '../public')))

//configuracion global de las rutas
app.use(require('./routes/index'));

 mongoose.connect(process.env.urlDB, 
 {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
if(err) throw err;

console.log("DATA BASE ONLINE");
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto local', process.env.PORT);
});