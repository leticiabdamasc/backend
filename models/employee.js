const db = require('../db/conn');

module.exports = class Employee{

    static insertEmployee(employee, res) {
        const sql = "INSERT INTO employee SET ?";
        return db.promise().query(sql, employee);
    }

    static findAllByApproved(res){
        const sql = "SELECT * FROM employee WHERE approved = 0";
        return db.promise().query(sql);
    }

    static async findByCpf(cpf){
        const sql = `SELECT * FROM employee WHERE cpf = ${cpf}`;
        return db.promise().query(sql);
    }

    static async acceptEmployee(status, cpf){
        const sql = `UPDATE employee SET approved = ? WHERE cpf = ${cpf}`;
        return db.promise().query(sql, status);
    }

    static async loginEmployee(cpf, pass){
        const sql = `SELECT * FROM employee WHERE cpf = ${cpf}`;
        return db.promise().query(sql);
    }
   
    static async changePass(cpf, password){
        const sql = `UPDATE employee SET password = '${password}' WHERE cpf = '${cpf}'`;
        return db.promise().query(sql);
    }

    static deleteUserByCPF(cpf, res){
        const sql = `DELETE FROM employee WHERE cpf = '${cpf}'`;
        return db.promise().query(sql, cpf);
    }
}