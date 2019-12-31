const express = require('express');
const app = express();

app.get('/', function(req, res) {
    res.json('Hello world');
});

app.listen(3000, () => {
    console.log('Escuchando el puerto 3000');
});