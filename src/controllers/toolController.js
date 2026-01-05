const Tool = require('../models/Tool');

exports.addTool = async (req, res) => {
  try {
    if (req.user.role !== 'Tool/Service Provider') {
      return res.status(403).json({ message: 'Access denied. Only Tool/Service Providers can add tools.' });
    }

    const toolData = { ...req.body, ownerId: req.user.id };
    const tool = new Tool(toolData);
    await tool.save();
    res.status(201).json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMyTools = async (req, res) => {
  try {
    const tools = await Tool.find({ ownerId: req.user.id });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateTool = async (req, res) => {
  try {
    const tool = await Tool.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found or access denied' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found or access denied' });
    }
    res.json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.searchTools = async (req, res) => {
  try {
    const { location, category, availability } = req.query;
    let query = {};

    if (location) query.location = { $regex: location, $options: 'i' };
    if (category) query.category = category;
    if (availability !== undefined) query.availability = availability === 'true';

    const tools = await Tool.find(query).sort({ dailyRate: 1 });
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate('ownerId', 'name phone location');
    if (!tool) {
      return res.status(404).json({ message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};