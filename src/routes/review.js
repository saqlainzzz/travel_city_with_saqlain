const express = require('express');
const router = express.Router();
const controller = require('../controllers/review');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createReview);
router.get('/', authenticate, controller.getReviews);
router.get('/:id', authenticate, validateObjectId, controller.getReview);
router.put('/:id', authenticate, validateObjectId, controller.updateReview);
router.delete('/:id', authenticate, validateObjectId, controller.deleteReview);

module.exports = router;
