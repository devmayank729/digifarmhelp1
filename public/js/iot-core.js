// IoT Core Simulation for DigiFarmHelp

class IoTSimulator {
  constructor() {
    this.devices = [];
    this.isRunning = false;
    this.intervalId = null;
  }

  // Add a device to simulate
  addDevice(deviceId, type, element) {
    this.devices.push({
      id: deviceId,
      type: type,
      element: element,
      data: this.getInitialData(type)
    });
  }

  // Get initial data based on device type
  getInitialData(type) {
    switch (type) {
      case 'pump':
        return {
          voltage: 220,
          current: 5.2,
          flowRate: 1200,
          status: 'inactive'
        };
      case 'sensor':
        return {
          temperature: 28,
          humidity: 65,
          soilMoisture: 45,
          status: 'active'
        };
      case 'monitor':
        return {
          uptime: 0,
          alerts: 0,
          status: 'active'
        };
      default:
        return {};
    }
  }

  // Start simulation
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.updateDevices();
    }, 2000); // Update every 2 seconds
  }

  // Stop simulation
  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.resetDevices();
  }

  // Update all devices
  updateDevices() {
    this.devices.forEach(device => {
      this.updateDeviceData(device);
      this.updateUI(device);
    });
  }

  // Update device data with realistic fluctuations
  updateDeviceData(device) {
    const data = device.data;

    switch (device.type) {
      case 'pump':
        data.voltage = this.fluctuate(data.voltage, 215, 225);
        data.current = this.fluctuate(data.current, 4.8, 5.6);
        data.flowRate = this.fluctuate(data.flowRate, 1100, 1300);
        break;
      case 'sensor':
        data.temperature = this.fluctuate(data.temperature, 25, 35);
        data.humidity = this.fluctuate(data.humidity, 50, 80);
        data.soilMoisture = this.fluctuate(data.soilMoisture, 30, 60);
        break;
      case 'monitor':
        data.uptime += 2;
        if (Math.random() < 0.1) data.alerts++; // 10% chance of alert
        break;
    }
  }

  // Fluctuate a value within a range
  fluctuate(current, min, max) {
    const change = (Math.random() - 0.5) * 4; // Random change between -2 and +2
    const newValue = current + change;
    return Math.max(min, Math.min(max, newValue));
  }

  // Update UI elements
  updateUI(device) {
    const element = device.element;
    if (!element) return;

    const data = device.data;

    // Update status classes
    element.classList.remove('pump-active', 'sensor-active', 'monitor-active');
    if (data.status === 'active') {
      element.classList.add(`${device.type}-active`);
    }

    // Update display values
    const voltageEl = element.querySelector('.voltage');
    const currentEl = element.querySelector('.current');
    const flowRateEl = element.querySelector('.flow-rate');
    const tempEl = element.querySelector('.temperature');
    const humidityEl = element.querySelector('.humidity');
    const moistureEl = element.querySelector('.soil-moisture');
    const uptimeEl = element.querySelector('.uptime');
    const alertsEl = element.querySelector('.alerts');

    if (voltageEl) voltageEl.textContent = `${data.voltage.toFixed(1)}V`;
    if (currentEl) currentEl.textContent = `${data.current.toFixed(1)}A`;
    if (flowRateEl) flowRateEl.textContent = `${data.flowRate.toFixed(0)} L/hr`;
    if (tempEl) tempEl.textContent = `${data.temperature.toFixed(1)}°C`;
    if (humidityEl) humidityEl.textContent = `${data.humidity.toFixed(0)}%`;
    if (moistureEl) moistureEl.textContent = `${data.soilMoisture.toFixed(0)}%`;
    if (uptimeEl) uptimeEl.textContent = `${data.uptime}s`;
    if (alertsEl) alertsEl.textContent = data.alerts;
  }

  // Reset devices to initial state
  resetDevices() {
    this.devices.forEach(device => {
      device.data = this.getInitialData(device.type);
      this.updateUI(device);
    });
  }

  // Toggle device status
  toggleDevice(deviceId) {
    const device = this.devices.find(d => d.id === deviceId);
    if (device) {
      device.data.status = device.data.status === 'active' ? 'inactive' : 'active';
      this.updateUI(device);
    }
  }
}

// Global IoT Simulator instance
const iotSimulator = new IoTSimulator();

// Export for use in other scripts
window.IoTSimulator = IoTSimulator;
window.iotSimulator = iotSimulator;