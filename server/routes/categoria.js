const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');



// ==========================
//  Crear una Nueva Categoria
// ==========================

app.post('/categoria', verificaToken, (req, res) => {
    //regresa una nueva categoria
    // req.usuario._id

    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==========================
//  Update de una  Categoria
// ==========================

app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query', useFindAndModify: false }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });



    })


});


// ==========================
//  Borra una  Categoria
// ==========================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo un administrador puede borrar una categoria
    //categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'categoria borrada'
        }
        )
    });
});

// ==============================
//  Mostrar todas las categorias
// ==============================

app.get('/categoria',verificaToken, (req, res) => {
   console.log('entra al get de la funcion categoria')
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

       
        res.json({
            ok: true,
            categoria
        });
    });
});

// ==========================
//  Mostrar una  Categoria por ID
// ==========================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
        Categoria.findById(id, (err, categoriaDB) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if(!categoriaDB) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            });
        });
    
});


module.exports = app;