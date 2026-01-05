const mongoose = require('mongoose');

const labourSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  skills: [{
    type: String,
    enum: ['Ploughing', 'Sowing', 'Harvesting', 'Weeding', 'Irrigation', 'Pesticide Application', 'Fertilizer Application', 'General Farm Work'],
    required: true,
  }],
  experience: {
    type: Number, // in years
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  totalJobs: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Labour', labourSchema);