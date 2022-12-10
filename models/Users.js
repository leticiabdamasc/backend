const db = require('../db/conn');

module.exports = class Users {
    static getAllUsers(users, res) {
        const sql = "SELECT * FROM users";
        return db.promise().query(sql);
    }

    static insertUser(users, res) {
        const sql = "INSERT INTO users SET ?";
        return db.promise().query(sql, users);
    }

    static updateUserAddress(cpf, id_address, res) {
        const sql = `UPDATE users SET id_address = '${id_address}' WHERE cpf = ${cpf}`;
        return db.promise().query(sql, id_address);
    }
    
    static deleteUserByCPF(cpf, res){
        const sql = `DELETE FROM users WHERE cpf = '${cpf}'`;
        return db.promise().query(sql, cpf);
    }

    static loginUser(cpf, pass){
        const sql = `SELECT * FROM users WHERE cpf = ${cpf}`;
        return db.promise().query(sql);
    }

    static findUserByCpf(cpf){
        const sql = `SELECT * FROM users WHERE cpf = ${cpf}`;
        return db.promise().query(sql);
    }
}
