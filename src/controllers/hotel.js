const Hotel = require('../models/Hotel');

// Create new hotel
const createHotel = async (req, res) => {
  try {
    const doc = await Hotel.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating hotel',
      data: null
    });
  }
};

// Get all hotels with optional body/query filter
const getHotels = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Hotel.find(filter)
      .populate('city')
            .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'Hotels fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching hotels',
      data: null
    });
  }
};

// Get single hotel by ID
const getHotel = async (req, res) => {
  try {
    const doc = await Hotel.findById(req.params.id)
      .populate('city')
            .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Hotel retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving hotel',
      data: null
    });
  }
};

// Update single hotel by ID
const updateHotel = async (req, res) => {
  try {
    const doc = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating hotel',
      data: null
    });
  }
};

// Delete single hotel by ID
const deleteHotel = async (req, res) => {
  try {
    const doc = await Hotel.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Hotel deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting hotel',
      data: null
    });
  }
};

module.exports = {
  createHotel,
  getHotels,
  getHotel,
  updateHotel,
  deleteHotel
};
