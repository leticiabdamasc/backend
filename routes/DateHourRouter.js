const router = require('express').Router();
const DateHourController = require('../controllers/DateHourController');
const verifyToken = require('../helpers/verify-token');

router.post('/create', DateHourController.create);
router.patch('/deletedate/:id', DateHourController.deleteDate);
router.patch('/update', DateHourController.updateHour);
router.post('/get_hour/:cnpj', DateHourController.getHourCnpj);
router.get('/getbyid/:id', DateHourController.getHour);
router.get('/gethourbydate/:date', DateHourController.getHourByD);
module.exports = router;