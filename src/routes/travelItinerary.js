const express = require('express');
const router = express.Router();
const controller = require('../controllers/travelItinerary');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createTravelItinerary);
router.get('/', authenticate, controller.getTravelItineraries);
router.get('/:id', authenticate, validateObjectId, controller.getTravelItinerary);
router.put('/:id', authenticate, validateObjectId, controller.updateTravelItinerary);
router.delete('/:id', authenticate, validateObjectId, controller.deleteTravelItinerary);

module.exports = router;
