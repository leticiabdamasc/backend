const db = require('../db/conn');

module.exports = class AssignedBonus {
    static create(id_user, id_hemo, id_bonus) {
        const sql = `INSERT INTO bonusassigned (id_user, id_hemo, id_bonus) VALUES (${id_user}, ${id_hemo}, ${id_bonus})`;
        return db.promise().query(sql);
    }

    static findAll() {
        const sql = 'SELECT * FROM bonusassigned';
        return db.promise().query(sql);
    }

    static findByUser(id_user) {
        const sql = `SELECT * FROM bonusassigned WHERE id_user = ${id_user} AND used = 0 `;
        return db.promise().query(sql);
    }

    static updateStateUsed(id, id_user) {
        const sql = `UPDATE bonusassigned SET used = 1 WHERE id = ${id} AND id_user = ${id_user}`;
        return db.promise().query(sql);
    }
}