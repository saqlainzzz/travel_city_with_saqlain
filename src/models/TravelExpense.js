const mongoose = require('./db');

const travelExpenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    itinerary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TravelItinerary',
    },
    category: {
      type: String,
      enum: ['food', 'hotel', 'transport', 'tickets', 'shopping', 'visa', 'other'],
      default: 'other',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    spentAt: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TravelExpense', travelExpenseSchema);
