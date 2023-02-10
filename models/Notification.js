const db = require('../db/conn');

module.exports = class Notification {
    static createNotification(notification) {
        const sql = `INSERT INTO notification SET ?`;
        return db.promise().query(sql, notification);
    }

    static getNotificationByUser(cpf, idSchedule) {
        const sql = `SELECT * FROM notification WHERE fk_id_user = '${cpf}'`;
        return db.promise().query(sql);
    }

    static acceptSchedule(cpf, situation, idSchedule) {
        const sql = `UPDATE notification SET accept = ${situation} WHERE fk_id_user = "${cpf}" AND fk_id_schedule = ${idSchedule}`;
        console.log(sql);
        return db.promise().query(sql);
    }

    static fetchNotificationByIdSchedule(idSchedule) {
        const sql = `SELECT n.accept, u.name
        FROM notification as n
        INNER JOIN users as u
        ON n.fk_id_user = u.cpf WHERE n.fk_id_schedule = ${idSchedule} AND n.archived = 0 `;
        return db.promise().query(sql);
    }

    static getNotificationByAccept(id) {
        const sql = `SELECT * FROM notification WHERE fk_id_schedule = ${id} AND accept = 1`;
        return db.promise().query(sql);
    }
}