const mongoose = require('./db');

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    description: {
      type: String,
      default: '',
    },
    latitude: Number,
    longitude: Number,
    popularFor: [
      {
        type: String,
        trim: true,
      },
    ],
    muslimPopulationNote: {
      type: String,
      default: '',
    },
    bestTimeToVisit: {
      type: String,
      default: '',
    },
  },
  { timestamps: true}
);

module.exports = mongoose.model('City', citySchema);
