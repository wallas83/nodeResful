require('./config/config')
const express = require('express');
const app = express();
const bodyParser = require('body-parser')


//parse application/x-www-form urlencoded

app.use(bodyParser.urlencoded({ extended: false }));
//parse aplication/json

app.use(bodyParser.json());


app.get('/usuario', function(req, res) {
    res.json('Get Usuario local');
});
//post crear
app.post('/usuario', function(req, res) {
    let persona = req.body;
    if (persona.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'Nombre necesario'
        });
    } else {
        res.json({
            persona
        });
    }
});

//put actualiza
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id
    });
});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});



app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto local', process.env.PORT);
});