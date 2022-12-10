const multer = require("multer");
const path = require("path");

//destino das imagens
const imageStorage = multer.diskStorage({
    destination:function(req, file, cb){
        let folder;
        if(req.baseUrl.includes("users")){
            folder = "users";

        }else if(req.baseUrl.includes("posts")){
            folder = 'posts'
        }else if(req.baseUrl.includes("hemocentro")){
            folder = 'hemocentro'
        }
        cb(null, `public/images/${folder}`);
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + String(Math.random() * 10000)+ path.extname(file.originalname))
    },

})

const imageUpload = multer({
    storage: imageStorage,
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(png|jpg)$/)){
            return cb(new Error("Por favor envie somente jpg ou png"))
        }
        cb(undefined, true)
    },
})

module.exports = {imageUpload}