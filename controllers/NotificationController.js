const Notification = require('../models/Notification');
const ScheduleGroup = require('../models/ScheduleGroup');
module.exports = class NotificationController {
    static async getNotifByUser(req, res) {
        const idUser = req.body.idUser;
        console.log(idUser);
        const [result] = await Notification.getNotificationByUser(idUser);
        try {
            res.status(200).json({ "notification": result });
        } catch (err) {
            console.log(err);
        }
    }
    static async setAcceptUser(req, res) {
        const { idUser, accept, idSchedule } = req.body;
        console.log(idUser);
        try {
            if (accept === 1) {
                await Notification.acceptSchedule(idUser, accept, idSchedule);
                res.status(200).json({ "message": "Voce aceitou a doação, acompanhe seu agendamento" });
            } else {
                await Notification.acceptSchedule(idUser, accept, idSchedule);
                res.status(200).json({ "message": "Agendamento recusado!" });
            }
        } catch (err) {
            console.log(err);
        }
    }

}