const express = require('express');
const router = express.Router();
const controller = require('../controllers/transportOption');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createTransportOption);
router.get('/', authenticate, controller.getTransportOptions);
router.get('/:id', authenticate, validateObjectId, controller.getTransportOption);
router.put('/:id', authenticate, validateObjectId, controller.updateTransportOption);
router.delete('/:id', authenticate, validateObjectId, controller.deleteTransportOption);

module.exports = router;
