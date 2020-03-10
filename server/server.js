require('./config/config')
const express  = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser')
//parse application/x-www-form urlencoded

app.use(bodyParser.urlencoded({ extended: false }));
//parse aplication/json

app.use(bodyParser.json());

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