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
        const sql = `SELECT * FROM schedule_group WHERE idUser1 = ${idUser}`;
        return db.promise().query(sql);
    }



}