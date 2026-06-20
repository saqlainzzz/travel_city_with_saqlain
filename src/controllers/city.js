const City = require('../models/City');

// Create new city
const createCity = async (req, res) => {
  try {
    const doc = await City.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating city',
      data: null
    });
  }
};

// Get all cities with optional body/query filter
const getCities = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await City.find(filter)
      .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'Cities fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cities',
      data: null
    });
  }
};

// Get single city by ID
const getCity = async (req, res) => {
  try {
    const doc = await City.findById(req.params.id)
      .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'City retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving city',
      data: null
    });
  }
};

// Update single city by ID
const updateCity = async (req, res) => {
  try {
    const doc = await City.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'City updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating city',
      data: null
    });
  }
};

// Delete single city by ID
const deleteCity = async (req, res) => {
  try {
    const doc = await City.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'City deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting city',
      data: null
    });
  }
};

module.exports = {
  createCity,
  getCities,
  getCity,
  updateCity,
  deleteCity
};
