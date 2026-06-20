const mongoose = require('./db');

const itineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: {
      type: Number,
      required: true,
    },
    date: Date,
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    }
  },
  { _id: false }
);

const travelItinerarySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Itinerary title is required'],
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
      },
    ],
    startDate: Date,
    endDate: Date,
    budget: {
      type: Number,
      default: 0,
    },
    days: [itineraryDaySchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TravelItinerary', travelItinerarySchema);
