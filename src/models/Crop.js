const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  season: {
    type: String,
    enum: ['Rabi', 'Kharif', 'Zaid'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  soilRequirements: {
    type: String,
    required: true,
  },
  waterRequirements: {
    type: String,
    required: true,
  },
  expectedYield: {
    type: String,
    required: true,
  },
  marketPrice: {
    type: Number, // per kg/quintal
    required: true,
  },
  regions: [{
    type: String, // States where it's commonly grown
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Crop', cropSchema);