const express = require('express');
const router = express.Router();
const controller = require('../controllers/visaInfo');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createVisaInfo);
router.get('/', authenticate, controller.getVisaInfos);
router.get('/:id', authenticate, validateObjectId, controller.getVisaInfo);
router.put('/:id', authenticate, validateObjectId, controller.updateVisaInfo);
router.delete('/:id', authenticate, validateObjectId, controller.deleteVisaInfo);

module.exports = router;
