const CultureNote = require('../models/CultureNote');

// Create new cultureNote
const createCultureNote = async (req, res) => {
  try {
    const doc = await CultureNote.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'CultureNote created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating cultureNote',
      data: null
    });
  }
};

// Get all cultureNotes with optional body/query filter
const getCultureNotes = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await CultureNote.find(filter)
      .populate('country');
      
    return res.status(200).json({
      success: true,
      message: 'CultureNotes fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching cultureNotes',
      data: null
    });
  }
};

// Get single cultureNote by ID
const getCultureNote = async (req, res) => {
  try {
    const doc = await CultureNote.findById(req.params.id)
      .populate('country');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'CultureNote not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'CultureNote retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving cultureNote',
      data: null
    });
  }
};

// Update single cultureNote by ID
const updateCultureNote = async (req, res) => {
  try {
    const doc = await CultureNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'CultureNote not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'CultureNote updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating cultureNote',
      data: null
    });
  }
};

// Delete single cultureNote by ID
const deleteCultureNote = async (req, res) => {
  try {
    const doc = await CultureNote.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'CultureNote not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'CultureNote deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting cultureNote',
      data: null
    });
  }
};

module.exports = {
  createCultureNote,
  getCultureNotes,
  getCultureNote,
  updateCultureNote,
  deleteCultureNote
};
