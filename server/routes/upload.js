const express = require('express');
const fileUpload = require('express-fileupload');

const Usuario = require('../models/usuario');

const app = express();

//default options
// es un midleware que pasa lo de 'req' a un objeto fileUpload
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo;
    let id  = req.params.id;
    if(!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'no se ha seleccionado ningun archivo'
            }
        });
    }

    //validar tipo

    let tiposValidos = ['producto', 'usuario'];
    if(tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'los tipos permitidos son' + tiposValidos.join(', ')
                
            }
        });
    }
    //archivo seria el dato de entrada
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length-1];

    
    // Extensiones permitidas 
    let ExtensionesValidas = ['png', 'jpg','gif','jpeg'];

    if(ExtensionesValidas.indexOf( extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extesiones permitidas son ' + ExtensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //Cambiar el nombre del archivo

    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`

    archivo.mv(`uploads/${ tipo }/${archivo.name}`, (err) =>{
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: 'Imagen subida correctamente'
        });
    });

});

module.exports = app;