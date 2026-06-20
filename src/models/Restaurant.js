const mongoose = require('./db');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City is required'],
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    cuisine: [String],
    halalStatus: {
      type: String,
      enum: ['certified', 'self_declared', 'unknown', 'veg_friendly'],
      default: 'unknown',
    },
    priceRange: {
      type: String,
      enum: ['budget', 'mid', 'luxury'],
      default: 'budget',
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      lat: Number,
      lng: Number,
    },
    phone: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    popularDishes: [String],
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
