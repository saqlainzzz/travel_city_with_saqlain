const express = require('express');
const router = express.Router();
const controller = require('../controllers/visaInfo');
const VisaInfo = require('../models/VisaInfo');
const { authenticate } = require('../middlewares/authMiddleware');
const validateObjectId = require('../middlewares/validateObjectId');

router.get('/country/:countryId', authenticate, async (req, res) => {
  try {
    const doc = await VisaInfo.findOne({ country: req.params.countryId }).populate('country');
    return res.status(200).json({
      success: true,
      message: 'Visa info fetched by country successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null
    });
  }
});

router.post('/', authenticate, controller.createVisaInfo);
router.get('/', authenticate, controller.getVisaInfos);
router.get('/:id', authenticate, validateObjectId, controller.getVisaInfo);
router.put('/:id', authenticate, validateObjectId, controller.updateVisaInfo);
router.delete('/:id', authenticate, validateObjectId, controller.deleteVisaInfo);

module.exports = router;
