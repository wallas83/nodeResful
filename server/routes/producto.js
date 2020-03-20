
const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');


let app = express();
let Producto = require('../models/producto');

//=======================
// Obtener productos 
//=======================

app.get('/productos', verificaToken,(req, res) => {
    //trae todos los prodcutos
    // populate: usuario categoria
    // paginado

    let desde = req.params.desde || 0;
    desde = Number(desde);

    Producto.find({disponible: true})
                .skip(desde)
                .limit(5)
                .populate('usuario', 'nombre email')
                .populate('categoria', 'descripcion')
                .exec((err, productos) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    res.json({
                        ok: true,
                        productos
                    });
            
                });

});


//=======================
// Obtener productos por ID
//=======================
app.get('/productos/:id',verificaToken, (req, res) => {
    //populate: usuario categoria 
    // paginado

    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'nombre')
            .exec((err, productoBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!productoBD) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'el Id no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    producto: productoBD
                });
            });
});

//=======================
//buscar  productos 
//=======================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i')
    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err, productos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos
                });

            });
});




//=======================
// Crear un nuevo productos 
//=======================
app.post('/productos', verificaToken, (req, res) => {
    //Grabar un usuario 
    // Grabar una categoria del listado
    // console.log('muestra el usuario de entrada');
    // console.log(req);
    // console.log('muestra el body de entrada');
    // console.log(req.body);

    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });


});




//=======================
// Actualiza un  productos 
//=======================
app.put('/productos/:id',verificaToken, (req, res) => {
    //Grabar un usuario 
    // Grabar una categoria del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El id no existe'
                }
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto:productoGuardado
            });
        })
       
    });


});




//=======================
// Borrar un  productos 
//=======================
app.delete('/productos/:id',verificaToken, (req, res) => {
    //Borrar un usuario 
    //  una categoria del listado

    let id = req.params.id;

    Producto.findById(id,(err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        productoBD.disponible = false;

        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado,
                message: 'producto Borrado'
            });
        });
    });
});

module.exports = app;