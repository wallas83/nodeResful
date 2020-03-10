
const express  = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _      = require('underscore');
const Usuario = require('../models/usuario');

const { verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');




app.get('/usuario', verificaToken ,(req, res) => {
    
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
                Usuario.countDocuments({estado: true},(err,conteo)=>{
                    res.json({
                        ok : true,
                        usuarios,
                        cuantos : conteo
                    });
                });
             

            });
});
//post crear
app.post('/usuario', [verificaToken,verificaAdminRole], (req, res) =>{
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
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
   
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

      //  console.log('es el usuario en la db',usuarioDB);
      console.log('es el usuario en la db',err);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

       


        res.json({
            ok: true,
            usuario: usuarioDB
        });
      
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole],(req, res) => {
    
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
