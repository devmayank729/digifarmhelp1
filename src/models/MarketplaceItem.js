const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Seeds', 'Tools', 'Livestock'],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Conditional fields for Livestock
  milkCapacity: {
    type: Number,
    required: function () {
      return this.category === 'Livestock';
    },
    min: [0, 'Milk capacity cannot be negative'],
  },
  lactationStage: {
    type: Number,
    required: function () {
      return this.category === 'Livestock';
    },
    min: [1, 'Lactation stage must be at least 1'],
    max: [10, 'Lactation stage cannot exceed 10'],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);