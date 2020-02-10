const mongoose = require('mongoose');
const mongooseValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;
let rolesValidos = {
    values : ['ADMIN_ROLE','USER_ROLE'],
    message: '{VALUE} no es un rol valido'
}

let usuarioSchema = new Schema({
    nombre : {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email : { 
        type: String,
        unique:true,
        required:[true, 'el correo en necesario']
    },
    password : {
        type: String,
        required: [true, 'password necesario']
    },
    img : {
        type: String,
        required: false
    },
    role : {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos

    },
    estado : {
        type: Boolean,
        default: true
        //required: [true, 'EStado requerido']
    },
    google: {
        type : Boolean,
        default: false
    }
});
// hace que la salida del backeend no devuelva el password
usuarioSchema.methods.toJSON = function() {
      
    let user = this;
      let userObject = user.toObject();
      delete userObject.password;
      
      return userObject;
}
usuarioSchema.plugin(mongooseValidator, { message: '{PATH} debe ser unico'})

module.exports = mongoose.model('Usuario', usuarioSchema);