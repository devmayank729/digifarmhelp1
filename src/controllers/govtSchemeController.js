const GovtScheme = require('../models/GovtScheme');

exports.getSchemes = async (req, res) => {
  try {
    const { category, region, isActive } = req.query;
    let query = {};

    if (category) query.category = category;
    if (region) query.regions = { $in: [region] };
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const schemes = await GovtScheme.find(query).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await GovtScheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createScheme = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const scheme = new GovtScheme({ ...req.body, createdBy: req.user.id });
    await scheme.save();
    res.status(201).json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateScheme = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const scheme = await GovtScheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteScheme = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const scheme = await GovtScheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }
    res.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getSchemesByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const schemes = await GovtScheme.find({
      regions: { $in: [region] },
      isActive: true
    }).sort({ createdAt: -1 });
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};