const Schedules = require('../models/Schedules');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Bonus = require('../models/Bonus');
const DateHour = require('../models/Date-hour');
const moment = require('moment');

module.exports = class SchedulesController {

    static async insertSchedule(req, res) {
        const { situation, id_hemo, id_date, finished, date_hour } = req.body;
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const [result] = await Schedules.getScheduleByCpfDate(user[0].cpf, id_date);
        if (id_date === "") {
            res.status(200).json({ message: "Escolha uma data" });
            return;
        }
        const [resul] = await Schedules.getAllScheduleByCpf(user[0].cpf);
        if (resul.length >= 1) {
            const idDate = resul[0].id_date;
            const [date] = await DateHour.getDateById(idDate);
            var date_last = moment(date[0].date, 'YYYY-MM-DD');
            var now = moment(date_hour, 'YYYY-MM-DD');
            var month = now.diff(date_last, 'month');
            console.log(now);
            console.log(date_last);
            console.log(month);
            if (user[0].sexo === 1 && month < 3) {
                res.status(200).json({ message: "Não foi possivel agendar uma doação, pois voce não conluiu o tempo de espera" });
                return;
            } else if (user[0].sexo === 0 && month < 1) {
                res.status(200).json({ message: "Não foi possivel agendar uma doação, pois voce não conluiu o tempo de espera" });
                return;
            } else if (result.length >= 1) {
                res.status(200).json({ message: "Voce já tem um agendamento em andamento, para esse dia" });
                return;
            } else {
                res.status(200).json({ message: "Voce já tem um agendamento em andamento" });
            }
        } else {
            const schecule = ({
                situation,
                id_user: user[0].cpf,
                id_hemo,
                id_date,
                finished,
                date_hour,
            });
            await Schedules.createSchedules(schecule);
            res.status(200).json({ message: "Seu agendamento foi efetuado com sucesso, acomapnhe o andamento" });
        }

    }


    static async getSchedule(req, res) {
        var schedules = [];
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const [schede] = await Schedules.getScheduleByCpf(user[0].cpf);
        console.log(schede[0].id_date);
        if (schede.length == 0) {
            res.status(200).json({ schedule: [] });
        } else {
            const [result] = await Schedules.getScheduleByCpfDate(user[0].cpf, schede[0].id_date);
            if (result.length !== 0) {
                const [datehour] = await DateHour.getDateById(result[0].id_date);
                let dateNow = new Date();
                for (var i in result) {
                    schedules.push({
                        "id": result[i].id,
                        "situation": result[i].situation,
                        "id_user": user[0].cpf,
                        "id_hemo": result[i].id_hemo,
                        "id_date": datehour[0].id,
                        "dateHour": result[i].date_hour,
                        "finished": 0,
                        "id_bonus": 0,
                        "bonus_used": 0
                    })
                }
                res.status(200).json({ schedule: schedules });
            }


        }




    }

    static async deleteScheduleByCpf(req, res) {
        const id = req.params.id;
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        await Schedules.deleteSchedules(user[0].cpf, id);
        res.status(200).json({ message: "Agendamento excluido" });
    }

    // employee role
    static async changeSituationUser(req, res) {
        const { situation, id_user, id_date } = req.body;
        console.log(situation);
        const [result] = await Schedules.getScheduleFinishedDateUser(id_user, id_date);
        console.log(result);
        let dateNow = new Date();
        for (var i in result) {
            if (result[i].situation === situation) {
                res.status(200).json({ message: "esse agendamento já esta com essa situação" });
                return;
            } else {
                const schedule = ({
                    id_user: result[0].id_user,
                    situation: situation,
                    id_hemo: result[0].id_hemo,
                    id_date: result[0].id_date,
                    date_hour: dateNow,
                    finished: 0
                });
                await Schedules.createSchedules(schedule);
                res.status(200).json({ message: "Situação alterada com sucesso!" });
            }
        }



    }

    static async finished(req, res) {
        const id = req.params.id;
        const finished = req.body.finished;
        await Schedules.finishedSchedules(id, finished);
        res.status(200).json({ message: "Esse agendamento foi finalizado!" });
    }

    static async getAllSchedule(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const [result] = await Schedules.getAllScheduleByCpf(user[0].cpf);
        res.status(200).json({ schedules: result });
    }

    //atribui uma bonificação para um usuário 
    static async addBonus(req, res) {
        const id = req.params.id;
        const id_bonus = req.body.id_bonus;

        const [bonus] = await Bonus.getAllBonus(id_bonus);
        if (bonus.length !== 0) {
            const [schedule] = await Schedules.getScheduleFinished(id);
            console.log(schedule);
            await Schedules.addBonusSchedule(bonus[0].id, schedule[0].id);
            res.status(200).json({ message: "Bonus atribuido!" });
        } else {
            res.status(200).json({ message: "Esse bonus já foi expirado, por favor, atribua outro ou altere para uma data futura" });
        }
    }
    static async getUserWithBon(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const [result] = await Schedules.findScheduleWithBonus(user[0].cpf);
        res.status(200).json({ bonus: result });
    }

    //invalidar o bonus assim que o usuário usar 
    static async invBonus(req, res) {
        const id = req.params.id;
        console.log(id);
        try {
            Schedules.invalidBonus(id)
            res.status(200).json({ message: "Bonus utlizado, gratidão!" });
        } catch (err) {
            res.status(400).json({ err: err });
        }
    }

} 