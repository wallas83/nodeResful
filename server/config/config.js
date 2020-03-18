//====================
// puerto
//=====================

process.env.PORT = process.env.PORT || 3000;


//====================
// entorno
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
// vencimiento del token
//=====================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30        


//====================
//SEED de autenticacion
//====================

process.env.SEED = process.env.seed || 'este-es-el-seed-desarrollo';


//====================
// base de datos
//=====================

let urlDB;

 if(process.env.NODE_ENV === 'dev'){
     urlDB = 'mongodb://localhost:27017/cafe'
    
 }else{
    urlDB = process.env.MONGO_URI
    
}

process.env.urlDB = urlDB;


//====================
// google client ID
//====================


process.env.CLIENT_ID = process.env.CLIENT_ID || '49401770103-mg53dq2pdg1d1588k82nfcvltl4sgn1n.apps.googleusercontent.com';