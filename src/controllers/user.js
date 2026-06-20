const User = require('../models/User');

// Create new user
const createUser = async (req, res) => {
  try {
    const doc = await User.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error creating user',
      data: null
    });
  }
};

// Get all users with optional body/query filter
const getUsers = async (req, res) => {
  try {
    const filter = { ...req.query, ...req.body };
    const docs = await User.find(filter)
      ;
      
    return res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: docs
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error fetching users',
      data: null
    });
  }
};

// Get single user by ID
const getUser = async (req, res) => {
  try {
    const doc = await User.findById(req.params.id)
      ;
      
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: doc
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error retrieving user',
      data: null
    });
  }
};

// Update single user by ID
const updateUser = async (req, res) => {
  try {
    const doc = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: doc
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error updating user',
      data: null
    });
  }
};

// Delete single user by ID
const deleteUser = async (req, res) => {
  try {
    const doc = await User.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        data: null
      });
    }
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error deleting user',
      data: null
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser
};
