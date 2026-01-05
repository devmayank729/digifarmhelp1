const Service = require('../models/Service');

exports.addService = async (req, res) => {
  try {
    if (req.user.role !== 'Tool/Service Provider') {
      return res.status(403).json({ message: 'Access denied. Only Tool/Service Providers can add services.' });
    }

    const serviceData = { ...req.body, providerId: req.user.id };
    const service = new Service(serviceData);
    await service.save();
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyServices = async (req, res) => {
  try {
    const services = await Service.find({ providerId: req.user.id });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, providerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: 'Service not found or access denied' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ _id: req.params.id, providerId: req.user.id });
    if (!service) {
      return res.status(404).json({ message: 'Service not found or access denied' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchServices = async (req, res) => {
  try {
    const { location, category, availability } = req.query;
    let query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (availability !== undefined) query.availability = availability === 'true';

    const services = await Service.find(query).sort({ rating: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId', 'name phone location email');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};