const router = require('express').Router();
const UsersController = require('../controllers/UsersController');

router.get('/buscar', UsersController.Allusers);
router.post('/create', UsersController.insert);
router.patch('/update', UsersController.updateAddressUser);
router.delete('/delete', UsersController.deleteByCPF);
router.post('/login', UsersController.login);
router.get('/getuser/:cpf', UsersController.getUserByCpf);
router.get('/get_user/:cpf', UsersController.getInfoUser);
module.exports = router;