const Place = require('../models/Place');

// Create new place
const createPlace = async (req, res) => {
  try {
    const doc = await Place.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Place created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating place',
      data: null
    });
  }
};

// Get all places with optional body/query filter
const getPlaces = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Place.find(filter)
      .populate('city')
            .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'Places fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching places',
      data: null
    });
  }
};

// Get single place by ID
const getPlace = async (req, res) => {
  try {
    const doc = await Place.findById(req.params.id)
      .populate('city')
            .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Place retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving place',
      data: null
    });
  }
};

// Update single place by ID
const updatePlace = async (req, res) => {
  try {
    const doc = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Place updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating place',
      data: null
    });
  }
};

// Delete single place by ID
const deletePlace = async (req, res) => {
  try {
    const doc = await Place.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Place not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Place deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting place',
      data: null
    });
  }
};

module.exports = {
  createPlace,
  getPlaces,
  getPlace,
  updatePlace,
  deletePlace
};
