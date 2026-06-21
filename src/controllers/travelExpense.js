const TravelExpense = require('../models/TravelExpense');

// Create new travelExpense
const createTravelExpense = async (req, res) => {
  try {
    if (req.user && !req.body.user) {
      req.body.user = req.user._id;
    }
    const doc = await TravelExpense.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'TravelExpense created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating travelExpense',
      data: null
    });
  }
};

// Get all travelExpenses with optional body/query filter
const getTravelExpenses = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await TravelExpense.find(filter)
      .populate('user')
            .populate('itinerary');
      
    return res.status(200).json({
      success: true,
      message: 'TravelExpenses fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching travelExpenses',
      data: null
    });
  }
};

// Get single travelExpense by ID
const getTravelExpense = async (req, res) => {
  try {
    const doc = await TravelExpense.findById(req.params.id)
      .populate('user')
            .populate('itinerary');
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelExpense not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelExpense retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving travelExpense',
      data: null
    });
  }
};

// Update single travelExpense by ID
const updateTravelExpense = async (req, res) => {
  try {
    const doc = await TravelExpense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelExpense not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelExpense updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating travelExpense',
      data: null
    });
  }
};

// Delete single travelExpense by ID
const deleteTravelExpense = async (req, res) => {
  try {
    const doc = await TravelExpense.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'TravelExpense not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'TravelExpense deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting travelExpense',
      data: null
    });
  }
};

module.exports = {
  createTravelExpense,
  getTravelExpenses,
  getTravelExpense,
  updateTravelExpense,
  deleteTravelExpense
};
