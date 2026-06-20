const mongoose = require('./db');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    targetType: {
      type: String,
      enum: ['Place', 'Mosque', 'Restaurant', 'Hotel', 'LocalGuide'],
      required: [true, 'Target type is required'],
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
      refPath: 'targetType',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
    },
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
