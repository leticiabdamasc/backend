const jwt = require('jsonwebtoken');

const createHemoToken = async(user, req, res) => {
    //create token
    const token = jwt.sign({
        name: user.name,
        cnpj: user.cnpj,
    }, "secretHemo");

    //return token
    res.status(200).json({
        message: "Login realizado com sucesso",
        token: token,
        cnpj: user.cnpj
    })
}

module.exports = createHemoToken;