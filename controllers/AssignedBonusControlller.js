const AssignedBonus = require('../models/AssignedBonus');
const Bonus = require('../models/Bonus');
const Hemocentro = require('../models/Hemocentro');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');


module.exports = class AssignedBonusController {
    static async createAssignedBonus(req, res) {
        const { id_user, id_hemo, id_bonus } = req.body;
        try {
            await AssignedBonus.create(id_user, id_hemo, id_bonus);
            res.status(200).json({ message: "Bonus atribuido" });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Falha ao atribuir bonus" });
        }
    }

    static async findAllRegister(req, res) {
        try {
            const [result] = await AssignedBonus.findAll();
            res.status(200).json({ "assingedBonus": result });
        } catch (e) {
            res.status(500).json({ message: "Falha ao buscar bonus atribuidos" });

        }
    }

    static async findByUserAssigned(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const bonusAssigned = [];
        try {
            const [result] = await AssignedBonus.findByUser(user[0].cpf);

            for (var i = 0; i < result.length; i++) {
                const [resultBonus] = await Bonus.findById(result[i].id_bonus);
                const [resultHemocentro] = await Hemocentro.findHemoByCnpj(result[i].id_hemo);
                bonusAssigned.push({
                    "id" : result[0].id,
                    "id_bonus": resultBonus[0].id,
                    "name_establishment": resultBonus[0].name_establishment,
                    "name_hemo": resultHemocentro[0].name,
                    "cnpj": resultHemocentro[0].cnpj,
                    "cpf": user[0].cpf,
                    "expiration_date": resultBonus[0].expiration_date,
                    "expired": resultBonus[0].expired,
                    "word_key": resultBonus[0].word_key,
                    "value": resultBonus[0].value
                });
            }

            res.status(200).json({ "assingedBonus": bonusAssigned });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Não foi possível encontrar seus bonus" });

        }
    }

    static async updateUsed(req, res) {
        const id = req.params.id;
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        try {
            await AssignedBonus.updateStateUsed(id, user[0].cpf)
            res.status(200).json({ message: "Obrigado por usar.", situation: true});
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Falha ao validar este cupom", situation: false});
        }

    }
}
