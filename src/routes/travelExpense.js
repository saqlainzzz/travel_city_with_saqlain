const express = require('express');
const router = express.Router();
const controller = require('../controllers/travelExpense');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createTravelExpense);
router.get('/', authenticate, controller.getTravelExpenses);
router.get('/:id', authenticate, validateObjectId, controller.getTravelExpense);
router.put('/:id', authenticate, validateObjectId, controller.updateTravelExpense);
router.delete('/:id', authenticate, validateObjectId, controller.deleteTravelExpense);

module.exports = router;
