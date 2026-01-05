const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Tractor', 'Harvester', 'Seeder', 'Sprayer', 'Plough', 'Cultivator', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  specifications: {
    type: String,
  },
  dailyRate: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  images: [{
    type: String, // URLs to images
  }],
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  totalRentals: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tool', toolSchema);