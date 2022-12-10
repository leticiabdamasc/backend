const jwt = require('jsonwebtoken');

const getToken = require('./get-token');


//middleware to validate token
const checkTokenHemo = (req, res, next) => {

    if(!req.headers.authorization){
        return res.status(401).json({message: 'Acesso negado!'});
    }
    const token = getToken(req);
    if(!token){
        return res.status(401).json({message: 'Acesso negado!'});

    }

    try{
        const verified = jwt.verify(token, 'secretHemo');
        req.user = verified;
        next();
    }catch(err){
        return res.status(400).json({message: 'Seu token é invalido por favor, refaça o login e repita a operação!'});
    }
}

module.exports = checkTokenHemo
