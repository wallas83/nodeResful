//====================
// puerto
//=====================

process.env.PORT = process.env.PORT || 3000;


//====================
// entorno
//=====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
// base de datos
//=====================

let urlDB;

 if(process.env.NODE_ENV === 'dev'){
     urlDB = 'mongodb://localhost:27017/cafe'
    
 }else{
    urlDB = 'mongodb+srv://wallas:v9z4lsfP4UcV6TpX@cluster0-7nzxp.mongodb.net/cafe'
    
}

process.env.urlDB = urlDB;

