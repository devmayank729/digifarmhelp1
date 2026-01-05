const mongoose = require('mongoose');

const iotDeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Device type is required'],
    enum: ['Pump', 'Sensor', 'Monitor'],
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Inactive',
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('IoTDevice', iotDeviceSchema);