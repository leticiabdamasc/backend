const db = require('../db/conn');

module.exports = class Schedules {
    static createSchedules(schedules, res) {
        const sql = 'INSERT INTO schedules SET ?';
        return db.promise().query(sql, schedules);
    }

    static getScheduleByCpf(cpf, id_date) {
        const sql = `SELECT * FROM schedules WHERE id_user = ${cpf} AND finished = 0 ORDER BY id DESC LIMIT 1`;
        return db.promise().query(sql);
    }

    static getScheduleByCpfDate(cpf, id_date) {
        const sql = `SELECT * FROM schedules WHERE id_user = ${cpf} AND id_date = ${id_date} ORDER BY id ASC `;
        return db.promise().query(sql);
    }

    static getAllScheduleByCpf(cpf) {
        const sql = `SELECT * FROM schedules WHERE id_user = ${cpf} GROUP BY id_date`;
        return db.promise().query(sql);
    }

    static changeSituation(situation, cpf) {
        const sql = `UPDATE schedules SET situation = ${situation} WHERE id_user = ${cpf}`;
        return db.promise().query(sql);
    }

    static deleteSchedules(cpf, id) {
        const sql = `DELETE FROM schedules WHERE id_user = ${cpf} AND id = ${id}`;
        return db.promise().query(sql);
    }

    static finishedSchedules(id, finished) {
        const sql = `UPDATE schedules SET finished = ${finished} WHERE id_date = ${id}`;
        return db.promise().query(sql);
    }

    static getScheduleBuIdDate(id) {
        const sql = `SELECT * FROM schedules WHERE id_date = ${id} AND finished = 0`;
        return db.promise().query(sql);
    }

    static getScheduleFinished(id) {
        const sql = `SELECT * FROM schedules WHERE finished = 1 AND id = ${id}`;
        return db.promise().query(sql);
    }

    static addBonusSchedule(id_bonus, id) {
        const sql = `UPDATE schedules SET id_bonus = ${id_bonus} WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static findScheduleByIdBonus(id_bonus) {
        const sql = `SELECT * FROM schedules WHERE id_bonus = ${id_bonus}`;
        return db.promise().query(sql);
    }
    static findSchedulesUser(cpf) {
        const sql = `SELECT * FROM schedules WHERE id_user = ${cpf}`;
        return db.promise().query(sql);
    }
    //buscar registro de doações bonificadas
    static findScheduleWithBonus(cpf){
        const sql = `SELECT S.id,  S.id_bonus, S.bonus_used, B.name_establishment, H.cnpj, B.word_key, B.value, B.expired, H.name FROM schedules 
        AS S INNER JOIN date_hour AS D ON S.id_date = D.id 
        INNER JOIN bonus B ON B.id = S.id_bonus 
        INNER JOIN hemocentro AS H ON S.id_hemo = H.cnpj
        WHERE id_user = ${cpf} AND id_bonus IS NOT NULL AND S.bonus_used = 0`;
        return db.promise().query(sql);
    }

    static invalidBonus(id){
        const sql = `UPDATE schedules SET bonus_used = 1 WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    //finalizar todos os agendamentos de uma data 
    static finishedAllScheduleDate(id_date) {
        const sql = `UPDATE schedules SET finished = 1 WHERE id_date = ${id_date}`;
        return db.promise().query(sql);
    }

    //busca
    static getScheduleFinishedDateUser(id_user, id_date){
        const sql = `SELECT * FROM schedules WHERE id_user = ${id_user} AND id_date = ${id_date} ORDER BY id DESC LIMIT 1`;
        return db.promise().query(sql);
    }

  
}