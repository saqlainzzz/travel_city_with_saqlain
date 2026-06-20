const mongoose = require('./db');

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Country name is required'],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Country code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 3,
    },
    continent: {
      type: String,
      required: [true, 'Continent is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      trim: true,
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    bestTimeToVisit: {
      type: String,
      default: '',
    },
    safetyLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { timestamps: true}
);

module.exports = mongoose.model('Country', countrySchema);
