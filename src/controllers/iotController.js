const IoTDevice = require('../models/IoTDevice');

// @desc    Get user's IoT devices
// @route   GET /api/iot/devices
// @access  Private
const getDevices = async (req, res) => {
  try {
    const devices = await IoTDevice.find({ userId: req.user.id });
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single IoT device
// @route   GET /api/iot/devices/:id
// @access  Private
const getDevice = async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if user owns the device
    if (device.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create IoT device
// @route   POST /api/iot/devices
// @access  Private
const createDevice = async (req, res) => {
  try {
    const { name, type, location } = req.body;

    const device = await IoTDevice.create({
      name,
      type,
      location,
      userId: req.user.id,
    });

    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update IoT device
// @route   PUT /api/iot/devices/:id
// @access  Private
const updateDevice = async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if user owns the device
    if (device.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedDevice = await IoTDevice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete IoT device
// @route   DELETE /api/iot/devices/:id
// @access  Private
const deleteDevice = async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if user owns the device
    if (device.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await device.remove();
    res.json({ message: 'Device removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle device status
// @route   PUT /api/iot/devices/:id/toggle
// @access  Private
const toggleDevice = async (req, res) => {
  try {
    const device = await IoTDevice.findById(req.params.id);

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Check if user owns the device
    if (device.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    device.status = device.status === 'Active' ? 'Inactive' : 'Active';
    await device.save();

    res.json(device);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDevices,
  getDevice,
  createDevice,
  updateDevice,
  deleteDevice,
  toggleDevice,
};