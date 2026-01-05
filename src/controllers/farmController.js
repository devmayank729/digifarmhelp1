const MarketplaceItem = require('../models/MarketplaceItem');

// @desc    Get all marketplace items
// @route   GET /api/marketplace
// @access  Public
const getItems = async (req, res) => {
  try {
    const items = await MarketplaceItem.find({}).populate('sellerId', 'name email');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single marketplace item
// @route   GET /api/marketplace/:id
// @access  Public
const getItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id).populate('sellerId', 'name email');
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a marketplace item
// @route   POST /api/marketplace
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, description, price, category, milkCapacity, lactationStage } = req.body;

    const item = await MarketplaceItem.create({
      title,
      description,
      price,
      category,
      sellerId: req.user.id,
      ...(category === 'Livestock' && { milkCapacity, lactationStage }),
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update marketplace item
// @route   PUT /api/marketplace/:id
// @access  Private (Seller only)
const updateItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the seller
    if (item.sellerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedItem = await MarketplaceItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete marketplace item
// @route   DELETE /api/marketplace/:id
// @access  Private (Seller only)
const deleteItem = async (req, res) => {
  try {
    const item = await MarketplaceItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Check if user is the seller
    if (item.sellerId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};