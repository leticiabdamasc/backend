const ScheduleGroup = require('../models/ScheduleGroup');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Notification = require('../models/Notification');
const { json } = require('express');

module.exports = class ScheduleGroupController {
    static async createScheduleG(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const { idUser2, idUser3, idUser4, idDate, idHemocentro, finished } = req.body;

        try {
            const scheduleGroup = ({
                idUser1: user[0].cpf,
                idUser2: idUser2 == "" ? null : idUser2,
                idUser3: idUser3 == "" ? null : idUser3,
                idUser4: idUser4 == "" ? null : idUser4,
                fk_id_date: idDate,
                fk_id_hemocentro: idHemocentro,
                confirm2: 0,
                confirm3: 0,
                confirm4: 0,
                finished: finished
            });

            const [resp] = await ScheduleGroup.getByIdUser(user[0].cpf);
            if (resp.length >= 1) {
                res.status(200).json({ "message": "Ops! voce já agendou uma doação em grupo, aguarde seus amigos aceitar!" });
                return;
            }
            const [insert] = await ScheduleGroup.createScheduleGroup(scheduleGroup);
            console.log(insert.insertId);
            const notification2 = ({
                title: "Voce foi convidado para uma doação em grupo",
                fk_id_user: idUser2,
                accept: 2,
                fk_id_schedule: insert.insertId,
            });
            const notification3 = ({
                title: "Voce foi convidado para uma doação em grupo",
                fk_id_user: idUser3,
                accept: 2,
                fk_id_schedule: insert.insertId,
            });
            const notification4 = ({
                title: "Voce foi convidado para uma doação em grupo",
                fk_id_user: idUser4,
                accept: 2,
                fk_id_schedule: insert.insertId,
            });
            await Notification.createNotification(notification2);
            await Notification.createNotification(notification3);
            await Notification.createNotification(notification4);
            res.status(200).json({ "message": "Uma notificação foi enviada aos seus amigos, aguarde!" });
        } catch (err) {
            console.log(err);
        }
    }

    ///busca o agendamento em grupo do usuário
    static async getScheduleGroup(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        var users = [];
        var aceito = false;
        var msg = "";
        try {
            const [schedule] = await ScheduleGroup.getByIdUser(user[0].cpf);
            if (schedule.length > 0) {
                const [notifications] = await Notification.fetchNotificationByIdSchedule(schedule[0].id);
                const [scheduleByUser] = await ScheduleGroup.getByIdUserNotFinished(user[0].cpf);
                for (var i = 0; i < notifications.length; i++) {
                    console.log(notifications);
                    if (notifications[i].accept === 2) {
                        msg = "Alguns amigos ainda não aceitaram seu convite! Aguarde eles decidirem para continuar sua doação! ";
                        users.push({ situation: notifications[i].accept, user: notifications[i].name });
                    } else if (notifications[i].accept === 1) {
                        //se tiver recusado continua mesmo assim
                        msg = "O usuário " + notifications[i].name + " não aceitou sua doação, deseja continuar?";
                    } else {
                        // todos aceitaram
                        msg = "Todos os seus amigos aceitaram doar com você, deseja continuar?";
                    }
                }
                if (msg.length === 0 && users.length === 0) {
                    users = [];
                } else {
                    res.status(200).json({ "message": msg, "usuarios": users, "id": schedule[0].id });
                }



            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ "message": "Houve um erro inesperado " });
        }
    }


    static async finalizeDonation(req, res) {
        const id = (req.body.id);
        try {
            await ScheduleGroup.finalizeDonationGroup(id);
            res.status(400).json({ "message": "Doação finalizada " });
        } catch (e) {
            res.status(400).json({ "message": "Houve um erro inesperado" + e });
        }
    }

    static async getNotification(req, res) {
        const id = (req.body.id);
        try {
            const [resp] = await Notification.getNotificationByAccept(id);
            await ScheduleGroup.confirmScheduleGroup(id);
            res.status(200).json({ "msg": "Agendamento concluído, aguardamos vocês em nosso hemocentro, obrigado" });
        } catch (e) {
            console.log(e);
            res.status(200).json({ "msg": "Ocorreu um erro" });
        }
    }

    static async continueScheduleGroup(req, res) {
        const id = (req.body.id);
        try {
            await ScheduleGroup.continueScheduleGroup(id);
            res.status(200).json({ "msg": "Sua doação em grupo foi agendada, compareça ao hemocentro com seus amigos no dia marcado para doação!" })
        } catch (e) {
            console.log(e);
            res.status(200).json({ "msg": "Ocorreu um erro " + e });
        }
    }
}