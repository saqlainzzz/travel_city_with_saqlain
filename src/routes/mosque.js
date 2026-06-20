const express = require('express');
const router = express.Router();
const controller = require('../controllers/mosque');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createMosque);
router.get('/', authenticate, controller.getMosques);
router.get('/:id', authenticate, validateObjectId, controller.getMosque);
router.put('/:id', authenticate, validateObjectId, controller.updateMosque);
router.delete('/:id', authenticate, validateObjectId, controller.deleteMosque);

module.exports = router;
