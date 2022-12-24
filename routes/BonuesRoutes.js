const router = require('express').Router();
const BonusController = require('../controllers/BonusController');

router.post('/add', BonusController.addBonus);
router.get('/active', BonusController.getAllUser);
router.get('/all', BonusController.getAllBonus);
router.patch('/update/:id', BonusController.updateById);
router.delete('/delete/:id', BonusController.deleteById);
module.exports = router;