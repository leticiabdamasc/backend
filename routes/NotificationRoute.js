const router = require('express').Router();
const NotificationController = require('../controllers/NotificationController');

router.get('/get', NotificationController.getNotifByUser);
router.patch('/set_situation', NotificationController.setAcceptUser);
module.exports = router;