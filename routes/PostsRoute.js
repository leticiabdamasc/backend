const router = require('express').Router();
const verifyToken = require('../helpers/verify-token');
const postController = require('../controllers/PostController');
const { imageUpload } = require('../helpers/image-uploads');

router.post('/create', postController.createPost);
router.get('/posts', postController.getAllPost);
router.get('/images/:id',postController.getAllImageByPost);
router.post('/updatesupport', postController.setSupport);
router.get('/getbyid/:id', postController.getAllSupport);
router.post('/getbyuser', postController.getSupportByUser);
router.get('/getpostapp', postController.getAllPostApp);
module.exports = router;