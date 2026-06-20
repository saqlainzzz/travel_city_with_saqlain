const mongoose = require('./db'); 
const mosqueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mosque name is required'],
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
    capacity: {
      type: Number,
      default: 0,
    },
    sect: {
      type: String,
      enum: ['sunni', 'shia', 'bektashi', 'sufi', 'mixed', 'unknown'],
      default: 'unknown',
    },
    facilities: [
      {
        type: String,
        enum: ['wudu', 'women_area', 'parking', 'library', 'classes', 'wheelchair_access'],
      },
    ],
    jummahTime: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mosque', mosqueSchema);
