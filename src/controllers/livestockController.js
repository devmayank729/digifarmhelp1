const Livestock = require('../models/Livestock');

exports.addLivestock = async (req, res) => {
  try {
    const livestockData = { ...req.body, sellerId: req.user.id };
    const livestock = new Livestock(livestockData);
    await livestock.save();
    res.status(201).json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.find({ sellerId: req.user.id });
    res.json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found or access denied' });
    }
    res.json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteLivestock = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id });
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found or access denied' });
    }
    res.json({ message: 'Livestock deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchLivestock = async (req, res) => {
  try {
    const { type, location, breed } = req.query;
    let query = { isSold: false };

    if (type) query.type = type;
    if (location) query.location = { $regex: location, $options: 'i' };
    if (breed) query.breed = { $regex: breed, $options: 'i' };

    const livestock = await Livestock.find(query).sort({ price: 1 });
    res.json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLivestockById = async (req, res) => {
  try {
    const livestock = await Livestock.findById(req.params.id).populate('sellerId', 'name phone location');
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found' });
    }
    res.json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsSold = async (req, res) => {
  try {
    const livestock = await Livestock.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      { isSold: true },
      { new: true }
    );
    if (!livestock) {
      return res.status(404).json({ message: 'Livestock not found or access denied' });
    }
    res.json(livestock);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};