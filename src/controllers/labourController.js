const Labour = require('../models/Labour');
const LabourAgency = require('../models/LabourAgency');

exports.registerLabour = async (req, res) => {
  try {
    const labourData = { ...req.body, userId: req.user.id };
    const labour = new Labour(labourData);
    await labour.save();
    res.status(201).json(labour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getLabourProfile = async (req, res) => {
  try {
    const labour = await Labour.findOne({ userId: req.user.id });
    if (!labour) {
      return res.status(404).json({ message: 'Labour profile not found' });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateLabourProfile = async (req, res) => {
  try {
    const labour = await Labour.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!labour) {
      return res.status(404).json({ message: 'Labour profile not found' });
    }
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchLabour = async (req, res) => {
  try {
    const { location, skills, availability } = req.query;
    let query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (skills) query.skills = { $in: skills.split(',') };
    if (availability !== undefined) query.availability = availability === 'true';

    const labour = await Labour.find(query).sort({ rating: -1 });
    res.json(labour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.registerAgency = async (req, res) => {
  try {
    if (req.user.role !== 'Labour Agency') {
      return res.status(403).json({ message: 'Access denied. Only Labour Agencies can register.' });
    }

    const agencyData = { ...req.body, userId: req.user.id };
    const agency = new LabourAgency(agencyData);
    await agency.save();
    res.status(201).json(agency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAgencyProfile = async (req, res) => {
  try {
    const agency = await LabourAgency.findOne({ userId: req.user.id });
    if (!agency) {
      return res.status(404).json({ message: 'Agency profile not found' });
    }
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateAgencyProfile = async (req, res) => {
  try {
    const agency = await LabourAgency.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!agency) {
      return res.status(404).json({ message: 'Agency profile not found' });
    }
    res.json(agency);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAgencies = async (req, res) => {
  try {
    const { location, services } = req.query;
    let query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (services) query.services = { $in: services.split(',') };

    const agencies = await LabourAgency.find(query).sort({ rating: -1 });
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};