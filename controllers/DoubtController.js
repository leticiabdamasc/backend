const Doubt = require('../models/Doubt');

module.exports = class BonusController {
    static async createDoubt(req, res){
        const {titulo, descricao, fonte} = req.body;
        
        const doubt = ({
            titulo,
            descricao, 
            fonte
        });
        try{
            await Doubt.createDoubt(doubt);
            res.status(200).send({message: "Dúvida cadastrada com sucesso"});
        }catch(err){
            console.log(err);
            res.status(400).send({message: "Falha ao cadastrar dúvida "} + err);
        }
    }

    static async getAll(req, res){
        const [result] = await Doubt.findDoubt();
        try{
            res.status(200).json({doubts:result});
        }catch(err){
            res.status(500).json({message: "Falha ao buscar duvidas"});
        }
    }
}