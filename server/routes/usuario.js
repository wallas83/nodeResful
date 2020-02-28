
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
    // en el estring de abajo se hace el filtrado de que es lo que se va a mandar al frontend
    Usuario.find({estado: true}, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                if(err) {
                    return res.status(400).json({
                            ok: false,
                            err
                    });
                }
                Usuario.count({estado: true},(err,conteo)=>{
                    res.json({
                        ok : true,
                        usuarios,
                        cuantos : conteo
                    });
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

app.delete('/usuario/:id', function(req, res) {
    
    //eliminacion fisica en la base de datos 

    // let id = req.params.id;
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado)=> {
    //     if(err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if(!usuarioBorrado){
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }    
            
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });
    // });

    //eliminacion virtual


    let id = req.params.id;
    let cambioEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambioEstado,{new: true},(err, usuarioBorrado)=> {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }    
            
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

});
module.exports = app;