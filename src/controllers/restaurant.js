const Restaurant = require('../models/Restaurant');

// Create new restaurant
const createRestaurant = async (req, res) => {
  try {
    const doc = await Restaurant.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating restaurant',
      data: null
    });
  }
};

// Get all restaurants with optional body/query filter
const getRestaurants = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Restaurant.find(filter)
      .populate('city')
            .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'Restaurants fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching restaurants',
      data: null
    });
  }
};

// Get single restaurant by ID
const getRestaurant = async (req, res) => {
  try {
    const doc = await Restaurant.findById(req.params.id)
      .populate('city')
            .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Restaurant retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving restaurant',
      data: null
    });
  }
};

// Update single restaurant by ID
const updateRestaurant = async (req, res) => {
  try {
    const doc = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating restaurant',
      data: null
    });
  }
};

// Delete single restaurant by ID
const deleteRestaurant = async (req, res) => {
  try {
    const doc = await Restaurant.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting restaurant',
      data: null
    });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
};
