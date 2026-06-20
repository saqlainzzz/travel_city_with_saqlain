const mongoose = require('./db');

const localGuideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: [true, 'City is required'],
    },
    languages: [String],
    bio: {
      type: String,
      default: '',
    },
    expertise: [
      {
        type: String,
        enum: ['history', 'food', 'mosques', 'culture', 'shopping', 'transport', 'family_travel'],
      },
    ],
    hourlyRate: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'EUR',
    },
    availableDays: [
      {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
    ],
    contactWhatsapp: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LocalGuide', localGuideSchema);
