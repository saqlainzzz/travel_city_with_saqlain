const express = require('express');
const router = express.Router();
const controller = require('../controllers/hotel');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createHotel);
router.get('/', authenticate, controller.getHotels);
router.get('/:id', authenticate, validateObjectId, controller.getHotel);
router.put('/:id', authenticate, validateObjectId, controller.updateHotel);
router.delete('/:id', authenticate, validateObjectId, controller.deleteHotel);

module.exports = router;
