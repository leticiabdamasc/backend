const jwt = require('jsonwebtoken');

const createUserToken = async(user, req, res) => {

    //create token
    const token = jwt.sign({
        name: user.name,
        cpf: user.cpf,
    }, "nossosecret");

    //return token
    res.status(200).json({
        message: "Autenticacao realizada",
        token: token,
        cpf: user.cpf
    })
}

module.exports = createUserToken;

