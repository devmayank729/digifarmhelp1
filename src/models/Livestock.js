const mongoose = require('mongoose');

const livestockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Cow', 'Buffalo', 'Goat', 'Sheep', 'Chicken', 'Pig'],
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: Number, // in months
    required: true,
  },
  weight: {
    type: Number, // in kg
    required: true,
  },
  milkProduction: {
    type: Number, // liters per day
    required: function() {
      return ['Cow', 'Buffalo', 'Goat'].includes(this.type);
    },
  },
  lactationCount: {
    type: Number,
    required: function() {
      return ['Cow', 'Buffalo', 'Goat'].includes(this.type);
    },
  },
  lactationMonth: {
    type: Number,
    required: function() {
      return ['Cow', 'Buffalo', 'Goat'].includes(this.type);
    },
  },
  location: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{
    type: String, // URLs to images
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isSold: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Livestock', livestockSchema);