const VisaInfo = require('../models/VisaInfo');

// Create new visaInfo
const createVisaInfo = async (req, res) => {
  try {
    const doc = await VisaInfo.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'VisaInfo created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating visaInfo',
      data: null
    });
  }
};

// Get all visaInfos with optional body/query filter
const getVisaInfos = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await VisaInfo.find(filter)
      .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'VisaInfos fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching visaInfos',
      data: null
    });
  }
};

// Get single visaInfo by ID
const getVisaInfo = async (req, res) => {
  try {
    const doc = await VisaInfo.findById(req.params.id)
      .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'VisaInfo not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'VisaInfo retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving visaInfo',
      data: null
    });
  }
};

// Update single visaInfo by ID
const updateVisaInfo = async (req, res) => {
  try {
    const doc = await VisaInfo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'VisaInfo not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'VisaInfo updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating visaInfo',
      data: null
    });
  }
};

// Delete single visaInfo by ID
const deleteVisaInfo = async (req, res) => {
  try {
    const doc = await VisaInfo.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'VisaInfo not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'VisaInfo deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting visaInfo',
      data: null
    });
  }
};

module.exports = {
  createVisaInfo,
  getVisaInfos,
  getVisaInfo,
  updateVisaInfo,
  deleteVisaInfo
};
