const jwt = require('jsonwebtoken');
//===================
// verificar token
//===================

let verificaToken = (req, res, next) => {
    let tokens = req.get('authorization');

    jwt.verify(tokens, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

//===================
// verificar ADMINROLE
//===================


let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role === 'ADMIN_ROLE') {
         next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'el usuario no es administrador'
            }
        });
    }


};


module.exports = {
    verificaToken,
    verificaAdminRole
}