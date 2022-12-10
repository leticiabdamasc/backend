const router = require('express').Router();
const SchedulesController = require('../controllers/SchedulesController');
const verifyToken = require('../helpers/verify-token');

router.post('/create', verifyToken, SchedulesController.insertSchedule);
router.get('/get', verifyToken, SchedulesController.getSchedule);
router.delete('/delete/:id', verifyToken, SchedulesController.deleteScheduleByCpf);
//adicionar validação do token do funcinario mais pra frente
router.patch('/updatesituation', SchedulesController.changeSituationUser);
router.post('/insertsituation', SchedulesController.changeSituationUser)
router.patch('/finished/:id', SchedulesController.finished);
router.get('/getall', SchedulesController.getAllSchedule);
router.patch('/updatebonus/:id', SchedulesController.addBonus);
router.get('/getbonus', SchedulesController.getUserWithBon);
router.patch('/invalidbonus/:id', SchedulesController.invBonus);
module.exports = router;