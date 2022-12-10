const DateHour = require('../models/Date-hour');
const Schedules = require('../models/Schedules');

module.exports = class DateHourController {
    static async create(req, res) {
        const { date, hour, idHemo, filed } = req.body;
        if (date === "") {
            res.status(422).json({ message: "Adicione o dia" });
            return;
        } else if (hour === "") {
            res.status(422).json({ message: "Adicione a hora" });
            return;
        }
        try {
            const dateHour = ({
                date: date,
                hour: hour,
                idHemo: idHemo,
                filed: filed
            });
            await DateHour.insertData(dateHour);
            res.status(200).json({ message: "Data e hora cadastradas com sucesso" });
        } catch (err) {
            console.log(err);
        }
    }

    static async deleteDate(req, res) {
        const id = req.params.id;
        try {
            const [result] = await Schedules.getScheduleBuIdDate(id);
            if (result.length === 0) {
                await DateHour.deleteDateHour(id);
                res.status(200).json({ message: "Essa data foi excluída" });
                return;
            }
            res.status(200).json({ message: "ops, voce não pode xcluir esse horario, existem pessoas agendadas para esse horario" });
            return;

        } catch (err) { }
    }


    static async updateHour(req, res) {
        const { id, date, hour } = req.body;
        try {
            const dateHour = ({
                date,
                hour
            });
            await DateHour.update(id, dateHour);
            res.status(200).json({ message: "Alteração registrada" });
        } catch (err) { }
    }
    static async getHourCnpj(req, res) {
        const cnpj = req.params.cnpj;
        const {month, day} = req.body;
        console.log(day);
        
        try {
            const [result] = await DateHour.getDateByHemocentro(cnpj, month, day);
            console.log(result);
            res.status(200).json({
                "datehour": result
            });
        } catch (err) {
            console.log(err);
        }
    }
    static async getHour(req, res) {
        const id = req.params.id;
        try {
            const [result] = await DateHour.getDateById(id);
            res.status(200).json({ "date": result[0] });
        } catch (err) {
            console.log(err);
        }
    }

    //buscar hora por data
    static async getHourByD(req,res){
        const date = req.params.date;
        console.log(date);
        try{
            const [result] = await DateHour.findHourByDate(date);
            res.status(200).json({ "hours": result });
        }catch(err){}
    }
}