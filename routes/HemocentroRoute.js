const router = require('express').Router();
const { imageUpload } = require('../helpers/image-uploads');
const verifyToken = require('../helpers/verify-token');

const HemocentroController = require('../controllers/HemocentroController');
const verifyTokenHemo = require('../helpers/verify-token-hemo')

router.post('/create', verifyToken, imageUpload.single('image'), HemocentroController.create);
router.post('/login', HemocentroController.loginHemocentro);
router.delete('/deletehemo', verifyTokenHemo, HemocentroController.deleteHemocentro);
router.patch('/updatepass', HemocentroController.updatePassword);
router.get('/get_all', HemocentroController.getAll);
router.get('/get_by_cnpj/:cnpj', HemocentroController.getHemoByCnp);
module.exports = router;