const Review = require('../models/Review');

// Create new review
const createReview = async (req, res) => {
  try {
    const doc = await Review.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating review',
      data: null
    });
  }
};

// Get all reviews with optional body/query filter
const getReviews = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Review.find(filter)
      .populate('user')
            .populate('city');
      
    return res.status(200).json({
      success: true,
      message: 'Reviews fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching reviews',
      data: null
    });
  }
};

// Get single review by ID
const getReview = async (req, res) => {
  try {
    const doc = await Review.findById(req.params.id)
      .populate('user')
            .populate('city');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Review retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving review',
      data: null
    });
  }
};

// Update single review by ID
const updateReview = async (req, res) => {
  try {
    const doc = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating review',
      data: null
    });
  }
};

// Delete single review by ID
const deleteReview = async (req, res) => {
  try {
    const doc = await Review.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting review',
      data: null
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview
};
