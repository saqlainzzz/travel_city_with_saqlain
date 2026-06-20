const mongoose = require('./db');

const transportOptionSchema = new mongoose.Schema(
  {
    fromCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'From city is required'],
    },
    toCity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'To city is required'],
    },
    type: {
      type: String,
      enum: ['bus', 'train', 'flight', 'taxi', 'ferry', 'walk', 'metro'],
      required: [true, 'Transport type is required'],
    },
    provider: {
      type: String,
      default: '',
    },
    estimatedDuration: {
      type: String,
      default: '',
    },
    estimatedCost: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    bookingUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransportOption', transportOptionSchema);
