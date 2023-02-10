const router = require('express').Router();
const DoubtsController = require('../controllers/DoubtController');

router.post('/add', DoubtsController.createDoubt);
router.get('/find', DoubtsController.getAll);
module.exports = router;