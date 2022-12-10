const db = require('../db/conn');

module.exports = class Hemocentro{
    static createHemocentro(hemocentro, res){
        const sql = "INSERT INTO hemocentro SET ?";
        return db.promise().query(sql, hemocentro);
    }
    static findHemoByCnpj(cnpj){
        const sql = `SELECT * FROM hemocentro WHERE cnpj = ${cnpj}`;
        return db.promise().query(sql);
    }
    static delete(cnpj){
        const sql = `DELETE FROM hemocentro WHERE cnpj = ${cnpj}`;
        return db.promise().query(sql);
    }
    static alterPassword(cnpj, password){
        const sql = `UPDATE hemocentro SET password = '${password}' WHERE cnpj = '${cnpj}' `;
        return db.promise().query(sql, password);
    }

    static getAllHemocentro(){
        const sql = "SELECT * FROM hemocentro";
        return db.promise().query(sql);
    }
}