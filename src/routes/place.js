const express = require('express');
const router = express.Router();
const controller = require('../controllers/place');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createPlace);
router.get('/', authenticate, controller.getPlaces);
router.get('/:id', authenticate, validateObjectId, controller.getPlace);
router.put('/:id', authenticate, validateObjectId, controller.updatePlace);
router.delete('/:id', authenticate, validateObjectId, controller.deletePlace);

module.exports = router;
