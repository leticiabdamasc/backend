const db = require('../db/conn');

module.exports = class Doubts {
    static findDoubt(id) {
        const sql = `SELECT * FROM Doubt`;
        return db.promise().query(sql);
    }

    static createDoubt(Doubt) {
        const sql = `INSERT INTO Doubt SET ?`;
        return db.promise().query(sql, Doubt);
    }
}