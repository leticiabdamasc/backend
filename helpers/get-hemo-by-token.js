const getHemoByTokenUser = async (token) => {
    if(!token){
        return res.status(401).json({message: 'Acesso negado!'});

    }
    const decoded = jwt.verify(token, 'secretHemo');

    const hemoCnpj = decoded.cnpj;
    const hemo = await Hemocentro.findHemoByCnpj(hemoCnpj);
    return hemo;
}

module.exports = getHemoByTokenUser;