const mongoose = require('./db');

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
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
    category: {
      type: String,
      enum: ['museum', 'historic', 'nature', 'shopping', 'culture', 'landmark', 'other'],
      default: 'other',
    },
    description: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    location: {
      lat: Number,
      lng: Number,
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    openingHours: {
      type: String,
      default: '',
    },
    images: [String],
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Place', placeSchema);
