const express = require('express');
const router = express.Router();
const controller = require('../controllers/favorite');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createFavorite);
router.get('/', authenticate, controller.getFavorites);
router.get('/:id', authenticate, validateObjectId, controller.getFavorite);
router.put('/:id', authenticate, validateObjectId, controller.updateFavorite);
router.delete('/:id', authenticate, validateObjectId, controller.deleteFavorite);

module.exports = router;
