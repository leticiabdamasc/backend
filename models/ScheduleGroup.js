const db = require('../db/conn');

module.exports = class ScheduleGroup {
    static createScheduleGroup(schedule, res) {
        const sql = `INSERT INTO schedule_group SET ?`;
        return db.promise().query(sql, schedule, res);
    }
    static getAll() {
        const sql = "SELECT * FROM schedule_group";
        return db.promise().query(sql);
    }

    static getByIdUser(idUser) {
        const sql = `SELECT * FROM schedule_group WHERE idUser1 = ${idUser} AND finished = 1`;
        return db.promise().query(sql);
    }
    static getByIdUserNotFinished(idUser) {
        const sql = `SELECT * FROM schedule_group WHERE idUser1 = ${idUser} AND finished = 1 AND acceptAll = 0`;
        return db.promise().query(sql);
    }

    static finalizeDonationGroup(id) {
        const sql = `UPDATE schedule_group SET finished = 0 WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static confirmScheduleGroup(id) {
        const sql = `UPDATE schedule_group SET acceptAll = 1  WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static continueScheduleGroup(id) {
        const sql = `UPDATE schedule_group SET continuar = 1 WHERE id = ${id}`;
        return db.promise().query(sql);
    }

}