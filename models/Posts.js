const db = require('../db/conn');

module.exports = class Posts {

    static insetPost(posts, res) {
        const sql = `INSERT INTO posts SET ?`;
        return db.promise().query(sql, posts, res);
    }

    static insertImage(images) {
        const sql = `INSERT INTO images SET ?`;
        return db.promise().query(sql, images);
    }

    static getPosts() {
        const sql = "SELECT * FROM posts ORDER BY id DESC";
        return db.promise().query(sql);
    }

    static getImageByPost(idPost) {
        const sql = `SELECT * FROM images WHERE id_posts = ${idPost}`;
        return db.promise().query(sql);
    }

    static getPostById(id) {
        const sql = `SELECT * FROM posts WHERE id = ${id}`;
        return db.promise().query(sql);
    }
    //bsucar apoio de algum usuário
    static getSupportByid(idUsers, idPost) {
        const sql = `SELECT * FROM support WHERE fk_id_user = '${idUsers}' AND fk_id_post = ${idPost}`;
        return db.promise().query(sql);
    }
    //setar curtida de um usuario novo
    static setSupport(support) {
        const sql = `INSERT INTO support SET ?`;
        return db.promise().query(sql, support);
    }
    //retira a curtida de um usuário que já fez
    static deleteSupport(idUser, idPost){
        const sql = `DELETE FROM support WHERE fk_id_user = ${idUser} AND fk_id_post = ${idPost}`;
        return db.promise().query(sql);
    }
    //buscar todos os apoios de uma publicação
    static getAllSu(idPost){
        const sql = `SELECT * FROM support WHERE fk_id_post = ${idPost}`;
        return db.promise().query(sql);
    }
   
}