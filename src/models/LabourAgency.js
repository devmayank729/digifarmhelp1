const mongoose = require('mongoose');

const labourAgencySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  agencyName: {
    type: String,
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
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  services: [{
    type: String,
    enum: ['Labour Supply', 'Equipment Rental', 'Farm Management', 'Consultation'],
  }],
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
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('LabourAgency', labourAgencySchema);