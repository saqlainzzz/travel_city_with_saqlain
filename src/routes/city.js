const express = require('express');
const router = express.Router();
const controller = require('../controllers/city');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createCity);
router.get('/', authenticate, controller.getCities);
router.get('/:id', authenticate, validateObjectId, controller.getCity);
router.put('/:id', authenticate, validateObjectId, controller.updateCity);
router.delete('/:id', authenticate, validateObjectId, controller.deleteCity);

module.exports = router;
