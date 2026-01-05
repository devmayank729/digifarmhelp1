const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Veterinary', 'Equipment Repair', 'Pest Control', 'Soil Testing', 'Irrigation', 'Consultation', 'Other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  },
  pricing: {
    type: String, // e.g., "₹500 per visit", "₹1000 per acre"
    required: true,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  totalServices: {
    type: Number,
    default: 0,
  },
  certifications: [{
    type: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Service', serviceSchema);