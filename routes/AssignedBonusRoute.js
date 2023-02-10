const router = require('express').Router();
const AssignedBonusController = require('../controllers/AssignedBonusControlller');
const verifyToken = require('../helpers/verify-token');


router.post('/add', AssignedBonusController.createAssignedBonus);
router.get('/find', AssignedBonusController.findAllRegister);
router.get('/findbyuser', verifyToken, AssignedBonusController.findByUserAssigned);
router.patch('/usedbyuser/:id', AssignedBonusController.updateUsed);
module.exports = router;