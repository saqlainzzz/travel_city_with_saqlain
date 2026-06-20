const express = require('express');
const router = express.Router();
const controller = require('../controllers/localGuide');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createLocalGuide);
router.get('/', authenticate, controller.getLocalGuides);
router.get('/:id', authenticate, validateObjectId, controller.getLocalGuide);
router.put('/:id', authenticate, validateObjectId, controller.updateLocalGuide);
router.delete('/:id', authenticate, validateObjectId, controller.deleteLocalGuide);

module.exports = router;
