const Post = require('../models/Posts');
const Users = require('../models/Users');
const getToken = require('../helpers/get-token');
const getUserByTokenUser = require('../helpers/get-user-by-token');
const Posts = require('../models/Posts');


module.exports = class PostController {
    static async createPost(req, res) {
        const token = getToken(req);
        const [user] = await getUserByTokenUser(token);
        const { description, date_hour, images } = req.body;
        console.log(req.body);
        try {
            const post = ({
                description,
                date_hour,
                cpf_user: user[0].cpf,
            });
            const [result] = await Post.insetPost(post);
            console.log(result.insertId);
            if (images !== "") {
                const img = ({
                    "name": images,
                    "id_posts": result.insertId
                });
                Post.insertImage(img);
            }
            res.status(201).json({ message: "Postagem efetuada com sucesso!" });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Erro ao postar, tente novamente mis tarde" });
        }
    }

    static async getAllPost(req, res) {
        const [result] = await Post.getPosts();
        res.status(201).json({ posts: result });
    }

    static async getAllImageByPost(req, res) {
        const idPost = req.params.id;
        const [result] = await Post.getImageByPost(idPost);
        res.status(201).json({ images: result[0] });
    }

    static async setSupport(req, res) {
        const { id_user, id_posts, quantity } = req.body;
        const [result] = await Post.getSupportByid(id_user, id_posts);
        const sup = {
            "fk_id_user": id_user,
            "fk_id_post": id_posts,
            "quantity": quantity
        }
        console.log(result);
        if (result.length === 0) {
            await Post.setSupport(sup);
            res.status(201).json({ message: "Você apoiou essa publicação, gratidão" })
        } else {
            await Post.deleteSupport(id_user, id_posts);
            res.status(201).json({ message: "Apoio retirado com sucesso!" })
        }
    }
    //busca todas curtidas da publicação
    static async getAllSupport(req, res) {
        var sum = 0;
        const id_support = req.params.id;
        const [result] = await Post.getAllSu(id_support);
        if (result.length !== 0) {
            result.forEach((e) => {
                sum = sum + e.quantity;
            })
            res.status(200).json({ message: sum });
        } else {
            res.status(200).json({ message: sum });
        }
    }

    static async getSupportByUser(req, res) {

        const { id_user, id_posts } = req.body;
        const [result] = await Post.getSupportByid(id_user, id_posts);
        res.status(200).json({ post: result[0] });
    }

    static async getAllPostApp(req, res) {
        var posts = [];
        try {
            const [allPost] = await Post.getPosts();

            for (var i in allPost) {
                const [user] = await Users.findUserByCpf(allPost[i].cpf_user);
                const [images] = await Posts.getImageByPost(allPost[i].id);
                if (images.length == 0) {
                    posts.push({
                        user: user[i],
                        date: allPost[i].date_hour,
                        description: allPost[i].description,
                        image: ""
                    });
                } else {
                    posts.push({
                        user: user[i],
                        post: allPost[i],
                        image: images
                    });
                }

            }
            const length = posts.length;
            res.status(200).json({ "postapp": posts[0], "length": length });
        } catch (err) {
            res.status(400).json({ "err": err });
        }
    }
}