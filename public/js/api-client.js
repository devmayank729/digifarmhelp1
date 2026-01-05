// API Client for DigiFarmHelp

class APIClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers: { ...defaultOptions.headers, ...options.headers }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Marketplace methods
  async getMarketplaceItems() {
    return this.request('/marketplace');
  }

  async getMarketplaceItem(id) {
    return this.request(`/marketplace/${id}`);
  }

  async createMarketplaceItem(itemData) {
    return this.request('/marketplace', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateMarketplaceItem(id, itemData) {
    return this.request(`/marketplace/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  }

  async deleteMarketplaceItem(id) {
    return this.request(`/marketplace/${id}`, {
      method: 'DELETE'
    });
  }

  // IoT methods
  async getIoTDevices() {
    return this.request('/iot/devices');
  }

  async getIoTDevice(id) {
    return this.request(`/iot/devices/${id}`);
  }

  async createIoTDevice(deviceData) {
    return this.request('/iot/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData)
    });
  }

  async updateIoTDevice(id, deviceData) {
    return this.request(`/iot/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData)
    });
  }

  async deleteIoTDevice(id) {
    return this.request(`/iot/devices/${id}`, {
      method: 'DELETE'
    });
  }

  async toggleIoTDevice(id) {
    return this.request(`/iot/devices/${id}/toggle`, {
      method: 'PUT'
    });
  }
}

// Global API client instance
const apiClient = new APIClient();

// Export for use in other scripts
window.APIClient = APIClient;
window.apiClient = apiClient;