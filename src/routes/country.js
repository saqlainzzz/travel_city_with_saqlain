const express = require('express');
const router = express.Router();
const controller = require('../controllers/country');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createCountry);
router.get('/', authenticate, controller.getCountries);
router.get('/:id', authenticate, validateObjectId, controller.getCountry);
router.put('/:id', authenticate, validateObjectId, controller.updateCountry);
router.delete('/:id', authenticate, validateObjectId, controller.deleteCountry);

module.exports = router;
