const mongoose = require('./db');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
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
    address: {
      type: String,
      default: '',
    },
    location: {
      lat: Number,
      lng: Number,
    },
    starRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    pricePerNight: {
      type: Number,
      default: 0,
    },
    amenities: [String],
    muslimFriendlyScore: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    nearbyMosques: [
      {
        mosque: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Mosque',
        },
        distanceKm: Number,
      },
    ],
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
