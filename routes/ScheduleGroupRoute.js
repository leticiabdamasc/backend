const router = require('express').Router();
const ScheduleGroupController = require('../controllers/ScheduleGroupController');
const verifyToken = require('../helpers/verify-token');

router.post('/create', verifyToken, ScheduleGroupController.createScheduleG);
router.get('/get',  verifyToken, ScheduleGroupController.getScheduleGroup);
module.exports = router;