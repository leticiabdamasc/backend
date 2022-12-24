const Bonus = require('../models/Bonus');
const Schedules = require('../models/Schedules');

module.exports = class BonusController {

    static async addBonus(req, res) {
        const { name_establishment, value, word_key, fk_id_address, cnpj, expiration_date } = req.body;
        var mydate = new Date(expiration_date + "T00:00:00");
        let dateNow = new Date();
        console.log(mydate);
        console.log(dateNow);
        if (mydate < dateNow) {
            res.status(200).json({ message: "Essa data já passou, favor por uma valida" });
            return;
        }
        const bonus = {
            name_establishment,
            value,
            word_key,
            fk_id_address,
            cnpj,
            expiration_date: mydate,
            expired: 0
        }
        try {
            console.log(bonus);
            await Bonus.add(bonus);
            res.status(200).json({ message: "Bonificação cadastrada com sucesso" });
        } catch (err) {
            console.log(err);
        }
    }

    static async getAllUser(req, res) {
        const [result] = await Bonus.getAllBonus();
        let dateNow = new Date();
        result.forEach((e) => {
            if (dateNow > e.expiration_date) {
                Bonus.expire(e.id);
            }

        });
        res.status(200).json({ bonus: result });
    }

    static async getAllBonus(req, res) {
        const [result] = await Bonus.getBonus();
        res.status(200).json({ bonus: result });
    }

    static async updateById(req, res) {
        const id = req.params.id;
        const { name_establishment, value, expiration_date, fk_id_address } = req.body;
        var mydate = new Date(expiration_date + "T00:00:00");
        let dateNow = new Date();
        console.log(mydate);
        console.log(dateNow);
        if (mydate < dateNow) {
            res.status(200).json({ message: "Essa data já passou, favor por uma valida" });
            return;
        }
        const [result] = await Bonus.findById(id);
        const newBonus = {
            name_establishment,
            value,
            word_key: result[0].word_key,
            fk_id_address,
            cnpj: result[0].cnpj,
            expiration_date: mydate,
            expired: 0
        }
        console.log(newBonus);
        await Bonus.updateBonus(id, newBonus);
        res.status(200).json({ message: "Bonus alterado com sucesso!" });

    }

    static async deleteById(req, res) {
        const id = req.params.id;
        const [result] = await Schedules.findScheduleByIdBonus(id);
        if (result.length !== 0) {
            res.status(200).json({ message: "Voce não pode remover esse bonus pois existe doadores usando esse bonus" });
            return;
        }
        await Bonus.delete(id);
        res.status(200).json({ message: "Bonus excluido com sucesso!" });
    }

    //verifica se o usuário que esta usando escaneando o QR possui bonus
    static async verifyBonusByUser(req, res) {
        const { idUser, idBonus, idHemo } = req.body;
        const [result] = await Bonus.findHemoByBonus(idHemo, idBonus);
        if (result.length >= 1) {
            res.status(200).json({ message: "Bonus concedido" });
        } else {
            res.status(200).json({ message: "Voce nao possui esse bonus disponivel" });
        }
    }

    //expirar o bonus após o uso
    //mobile
    static async expire(req, res) {
        const id_bonus = req.params.id;
        try {
            Bonus.expire(id_bonus);
            res.status(200).json({ message: "Bonus utlizado, gratidão!" });
        } catch (err) {
            res.status(400).json({ err: err });
        }
    }

    
}