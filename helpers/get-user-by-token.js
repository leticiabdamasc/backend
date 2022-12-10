const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const Hemocentro = require('../models/Hemocentro');
const Users = require('../models/Users');
const User = require('../models/Users');


const getUserByToken = async (token) => {
    if(!token){
        return res.status(401).json({message: 'Acesso negado!'});

    }
    const decoded = jwt.verify(token, 'nossosecret');

    const employeeCpf = decoded.cpf;
    const employee = await Employee.findByCpf(employeeCpf);
    return employee;
}

module.exports = getUserByToken;

const getUserByTokenUser = async (token) => {
    if(!token){
        return res.status(401).json({message: 'Acesso negado!'});

    }
    const decoded = jwt.verify(token, 'nossosecret');
    const userCpf = decoded.cpf;
    const user = await Users.findUserByCpf(userCpf);
    return user;
}

module.exports = getUserByTokenUser;

