
const Hemocentro = require('../models/Hemocentro');
const createHemoToken = require('../helpers/create-hemo-token');
const getToken = require('../helpers/get-token');
const getHemoByTokenUser = require('../helpers/get-hemo-by-token');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = class HemocentroController {
    static async create(req, res){
        const {cnpj, name, cep, street, number_address, point_references, latitude, longitude, district, opening_hour, password, image} = req.body;
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log()
        const [result] = await Hemocentro.findHemoByCnpj(cnpj);
        if(result.length !== 0){
            res.status(200).json({message: "Ops, essa empresa já esta cadastrada!"});
            return;
        }
        const hemocentro = ({
            cnpj,
            name, 
            cep, 
            street,
            number_address,
            point_references,
            latitude,
            longitude,
            district,
            image,
            opening_hour,
            password: passwordHash
        });
        try{
            await Hemocentro.createHemocentro(hemocentro);
            res.status(200).send({message: "cadastro de hemocentro efetuado com sucesso, faça o login!"});
        }catch(err){
            console.log(err);
        }
    }

    static async loginHemocentro(req, res){
        try {
            const { cnpj, pass } = req.body;
            const [result] = await Hemocentro.findHemoByCnpj(cnpj);
            if (result.length === 0) {
                res.status(422).json({ message: 'ops, esse hemocentro não foi encontrado!' });
                return;
            }
            const checkPassword = await bcrypt.compare(pass, result[0].password);
            if (!checkPassword) {
                res.status(422).json({ message: 'Senha invalida' });
                return;
            }
            await createHemoToken(result[0], req, res);
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteHemocentro(req, res){
        const {cnpj, pass} = req.body;
        const token = getToken(req);
        const [user] = await getHemoByTokenUser(token);
        const checkPassword = await bcrypt.compare(pass, user[0].password);
            if (!checkPassword) {
                res.status(422).json({ message: 'Senha invalida' });
                return;
            }else{
                await Hemocentro.delete(cnpj);
                res.status(201).json({ message: 'Hemocentro excluido'});
            }
    }

    static async updatePassword(req, res){
        const { cnpj, password } = req.body;
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);
        await Hemocentro.alterPassword(cnpj, passwordHash);
        res.status(201).json({ message: 'Senha alterada com sucesso!' });
    }

    static async getAll(req, res){
        const [result] = await Hemocentro.getAllHemocentro();
        try{
            res.status(200).json({hemocentro:result});
        }catch(err){
            res.status(500).json({message: "Falha ao buscar os hemocentros"});
        }
    }

    static async getHemoByCnp(req, res){
        const cnpj = req.params.cnpj;
        const [result] = await Hemocentro.findHemoByCnpj(cnpj);
        try{
            res.status(200).json({"hemocentro": result});
        }catch(err){
            console.log(err);
        }
    }
}