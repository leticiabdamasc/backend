const db = require('../db/conn');

module.exports = class Bonus {
    static add(bonus){
        const sql = "INSERT INTO bonus SET ?";
        return db.promise().query(sql, bonus);
    }

    static expire(id){
        const sql = `UPDATE bonus SET expired = 1 WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static getAllBonus(id){
        const sql = `SELECT * FROM bonus WHERE expired = 0 AND id = ${id}`;
        return db.promise().query(sql);
    }

    static getBonus(){
        const sql = "SELECT * FROM bonus";
        return db.promise().query(sql);
    }

    static updateBonus(id, bonus){
        const sql = `UPDATE bonus  SET ? WHERE id = ${id}`;
        return db.promise().query(sql, bonus);
    }

    static findById(id){
        const sql = `SELECT * FROM bonus WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static delete(id){
        const sql = `DELETE FROM bonus WHERE id = ${id}`;
        return db.promise().query(sql);
    }

    static findHemoByBonus(idHemo, idBonus){
        const sql = `SELECT * FROM bonus WHERE fk_hemocentro = ${idHemo} AND id = ${idBonus}`;
        return db.promise().query(sql);
    }


}