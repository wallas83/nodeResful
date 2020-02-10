require('./config/config')
const express  = require('express');
const mongoose = require('mongoose');

const app = express();

const bodyParser = require('body-parser')
//parse application/x-www-form urlencoded

app.use(bodyParser.urlencoded({ extended: false }));
//parse aplication/json

app.use(bodyParser.json());

app.use(require('./routes/usuario'));
 mongoose.connect('mongodb://localhost:27017/cafe', (err) => {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
if(err) throw err;

console.log("DATA BASE ONLINE");
});


app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto local', process.env.PORT);
});