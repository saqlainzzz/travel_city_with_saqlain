const mongoose = require('./db');

const cultureNoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
      required: [true, 'Country is required'],
    },
    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
    },
    category: {
      type: String,
      enum: ['food', 'religion', 'history', 'local_customs', 'safety', 'language', 'other'],
      default: 'other',
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    tags: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CultureNote', cultureNoteSchema);
