const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.post('/change-password', authenticate, controller.changePassword);

module.exports = router;
