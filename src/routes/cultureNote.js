const express = require('express');
const router = express.Router();
const controller = require('../controllers/cultureNote');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createCultureNote);
router.get('/', authenticate, controller.getCultureNotes);
router.get('/:id', authenticate, validateObjectId, controller.getCultureNote);
router.put('/:id', authenticate, validateObjectId, controller.updateCultureNote);
router.delete('/:id', authenticate, validateObjectId, controller.deleteCultureNote);

module.exports = router;
