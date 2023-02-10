const Schedules = require('../models/Schedules');
const Users = require('../models/Users');
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
        try {
            const [result] = await Schedules.getScheduleByCpfDate(user[0].cpf, id_date);
            if (id_date === "") {
                res.status(200).json({ message: "Escolha uma data" });
                return;
            }

            const [resul] = await Schedules.getAllScheduleByCpf(user[0].cpf);
            console.log(resul);
            if (resul.length >= 1) {
                const idDate = resul[0].id_date;
                const [date] = await DateHour.getDateById(idDate);
                var date_last = moment(date[0].date, 'YYYY-MM-DD');
                var now = moment(date_hour, 'YYYY-MM-DD');
                var month = now.diff(date_last, 'month');

                if (user[0].sexo === 1 && month < 0) {
                    res.status(200).json({ message: "Não foi possivel agendar uma doação, pois voce não conluiu o tempo de espera" });

                } else if (user[0].sexo === 0 && month < 0) {
                    res.status(200).json({ message: "Não foi possivel agendar uma doação, pois voce não conluiu o tempo de espera" });

                } else if (resul[0].finished == 0) {
                    res.status(200).json({ message: "Não foi possivel agendar uma doação, pois já existe um agendamento aberto" });
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
        } catch (e) {
            res.status(400).json({ message: "Houve um erro!" + e });
        }


    }


    static async getSchedule(req, res) {
        var schedules = [];
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const [schede] = await Schedules.getScheduleByCpf(user[0].cpf);
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
        const { finished, id_user } = req.body;
        await Schedules.finishedSchedules(id, finished, id_user);
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


    static async getScheduleHemocentro(req, res) {
        let situacao_text = "";
        const list_schedule = [];
        try {
            const [result] = await Schedules.getScheduleHemocentro();
           
            for (var i = 0; i < result.length; i++) {
                const [users] = await Users.findUserByCpf(result[i].id_user)
            const [data] = await DateHour.getDateById(result[i].id_date);
                situacao_text = result[i].situation === 1 ? "aceitar" : result[i].situation === 2 ? "Agendado" : result[i].situation === 3 ? "em andamento" : result[i].situation === "Finalizar";
                list_schedule.push({
                    "name": users[0].name,
                    "situacao_text": situacao_text,
                    "cpf": users[0].cpf,
                    "id_date": result[i].id_date,
                    "id_hemo": result[i].id_hemo,
                    "date_hour": result[i].date_hour,
                    "data_agendamento": data[0].date,
                    "hora_agendamento": data[0].hour,
                    "situation": result[i].situation
                });
            }

            res.status(200).json({ schedules: list_schedule });
        } catch (e) {
            res.status(404).json({ message: "Ops, houve um erro " + e });

        }
    }
} 