const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const createUserToken = require('../helpers/create-user-token');
const bcrypt = require('bcrypt');

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UsersController {
    static async Allusers(req, res) {
        try {
            const [allUsers] = await Users.getAllUsers();
            res.status(200).json({ users: allUsers });
        } catch (err) {
            console.log(err);
        }
    }

    static async insert(req, res) {
        try {
            const { cpf, name, birth_date, weight, type_blood, id_address, password, sexo} = req.body;
            const [use] = await Users.findUserByCpf(cpf);
            console.log(use);
            if (use.length >= 1) {
                res.status(200).json({ message: 'já existe um usuario com esse cpf' });
                return;
            }
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            const users = ({
                cpf,
                name,
                birth_date,
                weight,
                type_blood, 
                id_address,
                password: passwordHash,
                sexo
            });
            const result = await Users.insertUser(users);
            res.status(201).json(result);
        } catch (err) {
            console.log(err);
        };
    }

    static async updateAddressUser(req, res) {
        try {
            const cpf = req.body.cpf;
            const id_address = req.body.id_address;
            const result = await Users.updateUserAddress(cpf, id_address);
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
        }
    }
    static async deleteByCPF(req, res) {
        try {
            const cpf = req.body.cpf;
            const result = await Users.deleteUserByCPF(cpf);
            res.status(200).json(result);
        } catch (err) {
            console.log(err);
        }
    }

    static async login(req, res) {
        try {
            const { cpf, pass } = req.body;
            const [result] = await Users.loginUser(cpf, pass);
            console.log(result.length);
            if (result.length === 0) {
                res.status(422).json({ message: 'ops, esse colaborador não foi encontrado!' });
                return;
            }
            const checkPassword = await bcrypt.compare(pass, result[0].password);
            if (!checkPassword) {
                res.status(422).json({ message: 'Senha invalida' });
                return;
            }
            await createUserToken(result[0], req, res);
        } catch (err) {
            console.log(err);
        }
    }

    static async getUserByCpf(req, res){
        const cpf = req.params.cpf;
        const [users] = await Users.findUserByCpf(cpf);
        res.status(200).json({user: users[0].name});

    }

    static async getInfoUser(req, res){
        const cpf = req.params.cpf;
        const [users] = await Users.findUserByCpf(cpf);
        res.status(200).json({user: users[0]});
    }
}