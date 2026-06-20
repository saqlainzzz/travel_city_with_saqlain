const mongoose = require('./db');

const visaInfoSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    passportCountry: {
      type: String,
      default: 'India',
      trim: true,
    },
    visaType: {
      type: String,
      required: [true, 'Visa type is required'],
      trim: true,
    },
    applicationMode: {
      type: String,
      enum: ['evisa', 'embassy', 'visa_on_arrival', 'visa_free', 'other'],
      default: 'embassy',
    },
    documentsRequired: [String],
    processingTime: {
      type: String,
      default: '',
    },
    fee: {
      amount: {
        type: Number,
        default: 0,
      },
      currency: {
        type: String,
        default: 'EUR',
      },
    },
    officialWebsite: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VisaInfo', visaInfoSchema);
