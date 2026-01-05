const Crop = require('../models/Crop');
const FarmerProfile = require('../models/FarmerProfile');

exports.getCrops = async (req, res) => {
  try {
    const { season, region } = req.query;
    let query = {};

    if (season) query.season = season;
    if (region) query.regions = { $in: [region] };

    const crops = await Crop.find(query);
    res.json(crops);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCropRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const farmerProfile = await FarmerProfile.findOne({ userId });

    if (!farmerProfile) {
      return res.status(404).json({ message: 'Farmer profile not found' });
    }

    // Get current season based on month
    const currentMonth = new Date().getMonth() + 1;
    let currentSeason;
    if (currentMonth >= 10 || currentMonth <= 1) currentSeason = 'Rabi';
    else if (currentMonth >= 6 && currentMonth <= 9) currentSeason = 'Kharif';
    else currentSeason = 'Zaid';

    // Recommend crops based on soil type, location, and season
    const recommendations = await Crop.find({
      season: currentSeason,
      regions: { $in: [farmerProfile.location] },
      soilRequirements: { $regex: farmerProfile.soilType, $options: 'i' }
    }).limit(5);

    res.json({
      currentSeason,
      recommendations,
      farmerProfile: {
        location: farmerProfile.location,
        soilType: farmerProfile.soilType,
        farmSize: farmerProfile.farmSize
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCrop = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const crop = new Crop(req.body);
    await crop.save();
    res.status(201).json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json(crop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({ message: 'Crop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};