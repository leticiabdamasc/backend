const router = require('express').Router();
const employeeController = require('../controllers/EmployeeController');

router.post('/create/solicitation', employeeController.insertEmployee);
router.get('/solicitation', employeeController.verifySolicitation);
router.get('/checkuser', employeeController.checkUser);
router.post('/accept/socilitation', employeeController.acceptSolicitation);
router.get('/login', employeeController.login);
router.patch('/changepass', employeeController.changeDataEmployee);
router.delete('/deleteemployee', employeeController.deleteEmployee);
module.exports = router;