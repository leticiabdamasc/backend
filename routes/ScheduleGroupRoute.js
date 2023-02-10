const router = require('express').Router();
const ScheduleGroupController = require('../controllers/ScheduleGroupController');
const verifyToken = require('../helpers/verify-token');

router.post('/create', verifyToken, ScheduleGroupController.createScheduleG);
router.get('/get', verifyToken, ScheduleGroupController.getScheduleGroup);
router.post('/finalize', ScheduleGroupController.finalizeDonation);
router.post('/getusers', ScheduleGroupController.getNotification);
router.post('/continue', ScheduleGroupController.continueScheduleGroup);
module.exports = router;