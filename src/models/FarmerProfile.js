const mongoose = require('mongoose');

const farmerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  location: {
    type: String,
    required: true,
  },
  farmSize: {
    type: Number, // in acres
    required: true,
  },
  soilType: {
    type: String,
    enum: ['Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Alluvial', 'Black Cotton', 'Red', 'Laterite', 'Arid'],
    required: true,
  },
  crops: [{
    type: String,
  }],
  livestock: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('FarmerProfile', farmerProfileSchema);