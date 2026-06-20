const express = require('express');
const router = express.Router();
const controller = require('../controllers/restaurant');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createRestaurant);
router.get('/', authenticate, controller.getRestaurants);
router.get('/:id', authenticate, validateObjectId, controller.getRestaurant);
router.put('/:id', authenticate, validateObjectId, controller.updateRestaurant);
router.delete('/:id', authenticate, validateObjectId, controller.deleteRestaurant);

module.exports = router;
