const db = require('../db/conn');

module.exports = class Address {
    static findById(id) {
        const sql = `SELECT * FROM address WHERE id = ${id}`;
        return db.promise().query(sql);
    }
}