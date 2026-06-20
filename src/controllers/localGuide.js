const LocalGuide = require('../models/LocalGuide');

// Create new localGuide
const createLocalGuide = async (req, res) => {
  try {
    const doc = await LocalGuide.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'LocalGuide created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating localGuide',
      data: null
    });
  }
};

// Get all localGuides with optional body/query filter
const getLocalGuides = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await LocalGuide.find(filter)
      .populate('user')
            .populate('city');
      
    return res.status(200).json({
      success: true,
      message: 'LocalGuides fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching localGuides',
      data: null
    });
  }
};

// Get single localGuide by ID
const getLocalGuide = async (req, res) => {
  try {
    const doc = await LocalGuide.findById(req.params.id)
      .populate('user')
            .populate('city');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'LocalGuide not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'LocalGuide retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving localGuide',
      data: null
    });
  }
};

// Update single localGuide by ID
const updateLocalGuide = async (req, res) => {
  try {
    const doc = await LocalGuide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'LocalGuide not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'LocalGuide updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating localGuide',
      data: null
    });
  }
};

// Delete single localGuide by ID
const deleteLocalGuide = async (req, res) => {
  try {
    const doc = await LocalGuide.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'LocalGuide not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'LocalGuide deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting localGuide',
      data: null
    });
  }
};

module.exports = {
  createLocalGuide,
  getLocalGuides,
  getLocalGuide,
  updateLocalGuide,
  deleteLocalGuide
};
