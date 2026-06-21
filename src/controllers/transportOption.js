const TransportOption = require('../models/TransportOption');

// Create new transportOption
const createTransportOption = async (req, res) => {
  try {
    const doc = await TransportOption.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'TransportOption created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating transportOption',
      data: null
    });
  }
};

// Get all transportOptions with optional body/query filter
const getTransportOptions = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await TransportOption.find(filter)
      .populate('fromCity')
      .populate('toCity');
      
    return res.status(200).json({
      success: true,
      message: 'TransportOptions fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching transportOptions',
      data: null
    });
  }
};

// Get single transportOption by ID
const getTransportOption = async (req, res) => {
  try {
    const doc = await TransportOption.findById(req.params.id)
      .populate('fromCity')
      .populate('toCity');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TransportOption not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TransportOption retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving transportOption',
      data: null
    });
  }
};

// Update single transportOption by ID
const updateTransportOption = async (req, res) => {
  try {
    const doc = await TransportOption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TransportOption not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TransportOption updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating transportOption',
      data: null
    });
  }
};

// Delete single transportOption by ID
const deleteTransportOption = async (req, res) => {
  try {
    const doc = await TransportOption.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TransportOption not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TransportOption deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting transportOption',
      data: null
    });
  }
};

module.exports = {
  createTransportOption,
  getTransportOptions,
  getTransportOption,
  updateTransportOption,
  deleteTransportOption
};
