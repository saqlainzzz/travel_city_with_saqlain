const Mosque = require('../models/Mosque');

// Create new mosque
const createMosque = async (req, res) => {
  try {
    const doc = await Mosque.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Mosque created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating mosque',
      data: null
    });
  }
};

// Get all mosques with optional body/query filter
const getMosques = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Mosque.find(filter)
      .populate('city')
            .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'Mosques fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching mosques',
      data: null
    });
  }
};

// Get single mosque by ID
const getMosque = async (req, res) => {
  try {
    const doc = await Mosque.findById(req.params.id)
      .populate('city')
            .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Mosque not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Mosque retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving mosque',
      data: null
    });
  }
};

// Update single mosque by ID
const updateMosque = async (req, res) => {
  try {
    const doc = await Mosque.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Mosque not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Mosque updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating mosque',
      data: null
    });
  }
};

// Delete single mosque by ID
const deleteMosque = async (req, res) => {
  try {
    const doc = await Mosque.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Mosque not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Mosque deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting mosque',
      data: null
    });
  }
};

module.exports = {
  createMosque,
  getMosques,
  getMosque,
  updateMosque,
  deleteMosque
};
