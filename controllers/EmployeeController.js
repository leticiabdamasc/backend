const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');
const createUserToken = require('../helpers/create-user-token');
const bcrypt = require('bcryptjs');

//helpers
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const { json } = require('express');

module.exports = class EmployeeController {
    static async insertEmployee(req, res) {
        const { cpf, name, birth_date, admission_date, office, approved, password, adm } = req.body;
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        try {
            if (adm === 1) {
                const employee = ({
                    cpf: cpf,
                    name: name,
                    birth_date: birth_date,
                    admission_date: admission_date,
                    office: office,
                    approved: 1,
                    password: passwordHash,
                    adm: adm
                });
                await Employee.insertEmployee(employee);
                await createUserToken(employee, req, res);
            } else {
                const employee = ({
                    cpf: cpf,
                    name: name,
                    birth_date: birth_date,
                    admission_date: admission_date,
                    office: office,
                    approved: 0,
                    password: passwordHash,
                    adm: 0
                });
                await Employee.insertEmployee(employee);
                res.status(200).send("dados enviados, aguarde o administrador aceitar");
            }

        } catch (err) {
            res.status(500).json({ message: err })
        }
    }

    static async verifySolicitation(req, res) {
        try {
            const [result] = await Employee.findAllByApproved();
            res.status(200).json({ 'solicitations': result });
        } catch (err) {
            console.log(err);
        }
    }

    static async acceptSolicitation(req, res) {
        try {
            const token = getToken(req);
            const [user] = await getUserByToken(token);
            const status = parseInt(req.body.status);
            console.log(status);
            const cpf = req.body.cpf;
            if (user[0].adm === 1) {
                if (status === 1) {
                    await Employee.acceptEmployee(status, cpf);
                    res.status(200).json('o usuario foi aceito no sistema');
                } else {
                    await Employee.acceptEmployee(status, cpf);
                    res.status(200).json('o usuario foi recusado no sistema');
                }

            }

        } catch (err) {
            console.log(err);
        }
    }

    static async checkUser(req, res) {
        let currentUser;
        console.log(req.headers.authorization);
        if (req.headers.authorization) {
            const token = getToken(req);
            const decoded = jwt.verify(token, 'nossosecret');
            [currentUser] = await Employee.findByCpf(decoded.cpf);
            [currentUser].password = undefined;
        } else {
            currentUser = null;
        }
        res.status(200).send({ "employee": currentUser });
    }

    static async login(req, res) {
        try {
            const { cpf, pass } = req.body;
            const [result] = await Employee.loginEmployee(cpf, pass);
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
            if (result[0].approved === 1) {
                await createUserToken([result], req, res);
            } else if (result[0].approved === 2) {
                res.status(422).json({ message: 'voce não esta autorizado a usar esse sistema' });
            } else if (result[0].approved === 0) {
                res.status(422).json({ message: 'aguarde, seu cadastro esta sendo avaliado pelo adm' });
            }
        } catch (err) {
            console.log(err);
        }
    }

    static async changeDataEmployee(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const { cpf, password } = req.body;
        if (user[0].adm === 1) {
            const salt = await bcrypt.genSalt(12);
            const passwordHash = await bcrypt.hash(password, salt);
            await Employee.changePass(cpf, passwordHash);
            res.status(201).json({ message: 'Senha alterada com sucesso!' });
        } else {
            res.json(201).json({ message: 'Voce não tem permissão para alterar a senha do usuário' })
        }
    }

    static async deleteEmployee(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const { cpf, password } = req.body;
        const checkPassword = await bcrypt.compare(password, user[0].password);
        if (user[0].adm === 1 && checkPassword === true) {
            await Employee.deleteUserByCPF(cpf);
            res.status(201).json({ message: 'Usuario excluido' });
        } else {
            res.status(400).json({ message: 'não foi possivel excluir usuário, sua senha esta incorreta' });
        }
    }
}