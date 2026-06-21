const express = require('express');
const router = express.Router();
const controller = require('../controllers/cultureNote');
const CultureNote = require('../models/CultureNote');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.get('/country/:countryId', authenticate, async (req, res) => {
  try {
    const docs = await CultureNote.find({ country: req.params.countryId }).populate('country');
    return res.status(200).json({
      success: true,
      message: 'Culture notes fetched by country successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
});

router.post('/', authenticate, controller.createCultureNote);
router.get('/', authenticate, controller.getCultureNotes);
router.get('/:id', authenticate, validateObjectId, controller.getCultureNote);
router.put('/:id', authenticate, validateObjectId, controller.updateCultureNote);
router.delete('/:id', authenticate, validateObjectId, controller.deleteCultureNote);

module.exports = router;
