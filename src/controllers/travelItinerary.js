const TravelItinerary = require('../models/TravelItinerary');

// Create new travelItinerary
const createTravelItinerary = async (req, res) => {
  try {
    const doc = await TravelItinerary.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'TravelItinerary created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating travelItinerary',
      data: null
    });
  }
};

// Get all travelItineraries with optional body/query filter
const getTravelItineraries = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await TravelItinerary.find(filter)
      .populate('user')
            .populate('country')
            .populate('cities');
      
    return res.status(200).json({
      success: true,
      message: 'TravelItineraries fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching travelItineraries',
      data: null
    });
  }
};

// Get single travelItinerary by ID
const getTravelItinerary = async (req, res) => {
  try {
    const doc = await TravelItinerary.findById(req.params.id)
      .populate('user')
            .populate('country')
            .populate('cities');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelItinerary not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelItinerary retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving travelItinerary',
      data: null
    });
  }
};

// Update single travelItinerary by ID
const updateTravelItinerary = async (req, res) => {
  try {
    const doc = await TravelItinerary.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelItinerary not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelItinerary updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating travelItinerary',
      data: null
    });
  }
};

// Delete single travelItinerary by ID
const deleteTravelItinerary = async (req, res) => {
  try {
    const doc = await TravelItinerary.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelItinerary not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelItinerary deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting travelItinerary',
      data: null
    });
  }
};

module.exports = {
  createTravelItinerary,
  getTravelItineraries,
  getTravelItinerary,
  updateTravelItinerary,
  deleteTravelItinerary
};
