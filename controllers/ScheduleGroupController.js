const ScheduleGroup = require('../models/ScheduleGroup');
const getToken = require('../helpers/get-token');
const getUserByToken = require('../helpers/get-user-by-token');
const Notification = require('../models/Notification');

module.exports = class ScheduleGroupController {
    static async createScheduleG(req, res) {
        const token = getToken(req);
        const [user] = await getUserByToken(token);
        const { idUser2, idUser3, idUser4, idDate, idHemocentro } = req.body;

        try {
            const scheduleGroup = ({
                idUser1: user[0].cpf,
                idUser2: idUser2,
                idUser3: idUser3,
                idUser4: idUser4,
                fk_id_date: idDate,
                fk_id_hemocentro: idHemocentro,
                confirm2: 0,
                confirm3: 0,
                confirm4: 0
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
        try {
            const [schedule] = await ScheduleGroup.getByIdUser(user[0].cpf);
            const [notifications] = await Notification.fetchNotificationByIdSchedule(schedule[0].id);
            console.log(notifications);
            for (var i in notifications) {
                users.push({ situation: notifications[i].accept, user: notifications[i].name });
            }
            if (users.length != 0) {
                res.status(200).json({ "message": "Alguns amigos ainda não aceitaram seu convite! Enviaremos a você uma notificação caso isso mude! ", "usuarios": users });
            } else {
                res.status(200).json({ "message": "Sua doação já foi cadastrada, acompanhe" });
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ "message": "Houve um erro inesperado " });
        }
    }
}