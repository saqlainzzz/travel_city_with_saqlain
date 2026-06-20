const express = require('express');
const router = express.Router();
const controller = require('../controllers/user');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.post('/', authenticate, controller.createUser);
router.get('/', authenticate, controller.getUsers);
router.get('/:id', authenticate, validateObjectId, controller.getUser);
router.put('/:id', authenticate, validateObjectId, controller.updateUser);
router.delete('/:id', authenticate, validateObjectId, controller.deleteUser);

module.exports = router;
