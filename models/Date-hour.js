const db = require('../db/conn');

module.exports = class DateHour {
    static insertData(datehour, res) {
        const sql = "INSERT INTO date_hour SET ?";
        return db.promise().query(sql, datehour);
    }

    static deleteDateHour(id, res) {
        const sql = `UPDATE date_hour SET filed = 1 WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static update(id, datehour, res) {
        const sql = `UPDATE date_hour SET ? WHERE id = ${id}`;
        return db.promise().query(sql, datehour);
    }

    static getDateByHemocentro(cnpj, month, day) {
        const sql = `SELECT * FROM date_hour WHERE idHemo = '${cnpj}' AND filed = 0 AND MONTH(date) = '${month}' AND DAY(date) > '${day}' GROUP BY date ORDER BY DAY(date) ASC`;
        return db.promise().query(sql);
    }

    static getDateById(id) {
        const sql = `SELECT * FROM date_hour WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static compareDate(last, now) {
        const sql = `SELECT  *, TIMESTAMPDIFF(MONTH, ${last}, ${now}) FROM date_hour`;
        return db.promise().query(sql);
    }

    static findDateById(id) {
        const sql = `SELECT * FROM date_hour WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static findHourByDate(date) {
        const sql = `SELECT * FROM date_hour WHERE date = '${date}' `;
        return db.promise().query(sql);
    }
}