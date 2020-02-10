
const express  = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _      = require('underscore');
const Usuario = require('../models/usuario');



app.get('/usuario', function(req, res) {
    //res.json('Get Usuario local');
    let desde = req.query.desde || 0 ;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Usuario.find({})
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err) {
                    return res.status(400).json({
                            ok: false,
                            err
                    });
                }
                res.json({
                    ok : true,
                    usuarios
                });

            });
});
//post crear
app.post('/usuario', function(req, res) {
    let persona = req.body;

    let usuario = new Usuario({

        nombre   : persona.nombre,
        email    : persona.email,
        password : bcrypt.hashSync(persona.password, 10) ,
        role     : persona.role
    });
usuario.save( (err, usuarioDB) => {
    if(err) {
        return res.status(400).json({
                ok: false,
                err
        });
    }
    // usuarioDB.password = null;
    res.json({
        ok: true,
        usuario: usuarioDB
    });


  });
});

//put actualiza
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body,['nombre','email','img','role', 'estado']) ;
    //el new hace que se actualice en la respuesta para el frontEnd el cual se ve en el postman
    Usuario.findByIdAndUpdate(id, body,{new : true, runValidators : true},(err, usuarioDB) => {
        
        if(err) {
            return res.status(400).json({
                    ok: false,
                    err
            });
        }
      
        res.json({
        ok:true,
        usuario: usuarioDB
        });        
    });

});

app.delete('/usuario', function(req, res) {
    res.json('delete Usuario');
});
module.exports = app;
