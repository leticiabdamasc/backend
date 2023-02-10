const Notification = require('../models/Notification');
const ScheduleGroup = require('../models/ScheduleGroup');
module.exports = class NotificationController {
    static async getNotifByUser(req, res) {
        const idUser = req.body.idUser;
        var acceptAll = 0;
        const [result] = await Notification.getNotificationByUser(idUser);
        try {
            for (var res in result) {
                if (res.accept == 0) {
                    acceptAll = true;
                } else {
                    acceptAll = false;
                }
              
            }
            res.status(200).json({ "notification": result });
        } catch (err) {
            console.log(err);
        }
        console.log(acceptAll);
    }

    
    static async setAcceptUser(req, res) {
        const { idUser, accept, idSchedule } = req.body;
        try {
            if (accept === 1) {
                await Notification.acceptSchedule(idUser, accept, idSchedule);
                res.status(200).json({ "message": "Agendamento recusado!" });
            } else {
                await Notification.acceptSchedule(idUser, accept, idSchedule);
                res.status(200).json({ "message": "Voce aceitou a doação, acompanhe seu agendamento" });
            }
        } catch (err) {
            console.log(err);
        }
    }

}