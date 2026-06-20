const Favorite = require('../models/Favorite');

// Create new favorite
const createFavorite = async (req, res) => {
  try {
    const doc = await Favorite.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Favorite created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating favorite',
      data: null
    });
  }
};

// Get all favorites with optional body/query filter
const getFavorites = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Favorite.find(filter)
      .populate('user')
            .populate('city');
      
    return res.status(200).json({
      success: true,
      message: 'Favorites fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching favorites',
      data: null
    });
  }
};

// Get single favorite by ID
const getFavorite = async (req, res) => {
  try {
    const doc = await Favorite.findById(req.params.id)
      .populate('user')
            .populate('city');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Favorite retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving favorite',
      data: null
    });
  }
};

// Update single favorite by ID
const updateFavorite = async (req, res) => {
  try {
    const doc = await Favorite.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Favorite updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating favorite',
      data: null
    });
  }
};

// Delete single favorite by ID
const deleteFavorite = async (req, res) => {
  try {
    const doc = await Favorite.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Favorite deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting favorite',
      data: null
    });
  }
};

module.exports = {
  createFavorite,
  getFavorites,
  getFavorite,
  updateFavorite,
  deleteFavorite
};
