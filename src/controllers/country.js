const Country = require('../models/Country');

// Create new country
const createCountry = async (req, res) => {
  try {
    const doc = await Country.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Country created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating country',
      data: null
    });
  }
};

// Get all countries with optional body/query filter
const getCountries = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await Country.find(filter)
      ;
      
    return res.status(200).json({
      success: true,
      message: 'Countries fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching countries',
      data: null
    });
  }
};

// Get single country by ID
const getCountry = async (req, res) => {
  try {
    const doc = await Country.findById(req.params.id)
      ;
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Country not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Country retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving country',
      data: null
    });
  }
};

// Update single country by ID
const updateCountry = async (req, res) => {
  try {
    const doc = await Country.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Country not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Country updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating country',
      data: null
    });
  }
};

// Delete single country by ID
const deleteCountry = async (req, res) => {
  try {
    const doc = await Country.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Country not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Country deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting country',
      data: null
    });
  }
};

module.exports = {
  createCountry,
  getCountries,
  getCountry,
  updateCountry,
  deleteCountry
};
