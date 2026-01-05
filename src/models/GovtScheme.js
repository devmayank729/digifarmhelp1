const mongoose = require('mongoose');

const govtSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Subsidy', 'Insurance', 'Loan', 'Training', 'Equipment', 'Other'],
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  benefits: {
    type: String,
    required: true,
  },
  applicationProcess: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
  },
  contactInfo: {
    type: String,
  },
  documents: [{
    type: String, // URLs to document templates
  }],
  regions: [{
    type: String, // States/districts where applicable
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Admin who created it
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('GovtScheme', govtSchemeSchema);