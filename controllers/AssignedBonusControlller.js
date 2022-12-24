const AssignedBonus = require('../models/AssignedBonus');
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
        try {
            const [result] = await AssignedBonus.findByUser(user[0].cpf);
            res.status(200).json({ "assingedBonus": result });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Não foi possível encontrar seus bonus" });

        }
    }
}