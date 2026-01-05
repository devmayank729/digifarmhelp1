// Services Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadServices();
  checkUserRole();

  // Event listeners
  document.getElementById('searchServicesBtn').addEventListener('click', searchServices);
  document.getElementById('addServiceForm').addEventListener('submit', addService);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('serviceModal').style.display = 'none';
  });
});

async function checkUserRole() {
  try {
    const response = await apiClient.get('/api/auth/profile');
    const user = response.data;

    // Show/hide service management sections based on role
    const addServiceCard = document.getElementById('addServiceCard');
    const myServicesCard = document.getElementById('myServicesCard');

    if (user.role === 'Tool/Service Provider' || user.role === 'Admin') {
      addServiceCard.style.display = 'block';
      myServicesCard.style.display = 'block';
      loadMyServices();
    } else {
      addServiceCard.style.display = 'none';
      myServicesCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

async function searchServices() {
  try {
    const location = document.getElementById('serviceLocationFilter').value;
    const category = document.getElementById('serviceCategoryFilter').value;

    let url = '/api/services';
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const services = response.data;

    const container = document.getElementById('servicesResults');
    if (services.length === 0) {
      container.innerHTML = '<div class="no-data">No services found matching your criteria.</div>';
      return;
    }

    container.innerHTML = services.map(service => createServiceCard(service)).join('');
  } catch (error) {
    console.error('Error searching services:', error);
    document.getElementById('servicesResults').innerHTML =
      '<div class="error">Failed to search services. Please try again.</div>';
  }
}

async function loadServices() {
  try {
    const response = await apiClient.get('/api/services');
    const services = response.data;

    const container = document.getElementById('servicesResults');
    if (services.length === 0) {
      container.innerHTML = '<div class="no-data">No services available.</div>';
      return;
    }

    container.innerHTML = services.map(service => createServiceCard(service)).join('');
  } catch (error) {
    console.error('Error loading services:', error);
    document.getElementById('servicesResults').innerHTML =
      '<div class="error">Failed to load services. Please try again.</div>';
  }
}

async function loadMyServices() {
  try {
    const response = await apiClient.get('/api/services/my');
    const services = response.data;

    const container = document.getElementById('myServicesResults');
    if (services.length === 0) {
      container.innerHTML = '<div class="no-data">You haven\'t added any services yet.</div>';
      return;
    }

    container.innerHTML = services.map(service => createMyServiceCard(service)).join('');
  } catch (error) {
    console.error('Error loading my services:', error);
    document.getElementById('myServicesResults').innerHTML =
      '<div class="error">Failed to load your services. Please try again.</div>';
  }
}

function createServiceCard(service) {
  return `
    <div class="result-card" onclick="showServiceDetails('${service._id}')">
      <div class="result-header">
        <h4>${service.name}</h4>
        <span class="category-badge">${service.category}</span>
      </div>
      <div class="result-info">
        <p><strong>Pricing:</strong> ${service.pricing}</p>
        <p><strong>Location:</strong> ${service.location}</p>
        <p><strong>Rating:</strong> ★ ${service.rating}</p>
        <p><strong>Services Completed:</strong> ${service.totalServices}</p>
      </div>
      <div class="result-description">
        <p>${service.description}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Contact Provider</button>
      </div>
    </div>
  `;
}

function createMyServiceCard(service) {
  return `
    <div class="result-card">
      <div class="result-header">
        <h4>${service.name}</h4>
        <span class="status-badge ${service.availability ? 'available' : 'unavailable'}">
          ${service.availability ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div class="result-info">
        <p><strong>Pricing:</strong> ${service.pricing}</p>
        <p><strong>Location:</strong> ${service.location}</p>
        <p><strong>Rating:</strong> ★ ${service.rating}</p>
        <p><strong>Services Completed:</strong> ${service.totalServices}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-secondary btn-sm" onclick="editService('${service._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteService('${service._id}')">Delete</button>
      </div>
    </div>
  `;
}

async function addService(event) {
  event.preventDefault();

  const certifications = document.getElementById('serviceCertifications').value
    .split(',')
    .map(cert => cert.trim())
    .filter(cert => cert.length > 0);

  const formData = {
    name: document.getElementById('serviceName').value,
    category: document.getElementById('serviceCategory').value,
    description: document.getElementById('serviceDescription').value,
    pricing: document.getElementById('servicePricing').value,
    location: document.getElementById('serviceLocation').value,
    contactNumber: document.getElementById('servicePhone').value,
    email: document.getElementById('serviceEmail').value,
    certifications: certifications
  };

  try {
    const response = await apiClient.post('/api/services', formData);
    alert('Service added successfully!');
    document.getElementById('addServiceForm').reset();
    loadMyServices();
  } catch (error) {
    console.error('Error adding service:', error);
    alert('Failed to add service. Please try again.');
  }
}

async function showServiceDetails(serviceId) {
  try {
    const response = await apiClient.get(`/api/services/${serviceId}`);
    const service = response.data;

    const modal = document.getElementById('serviceModal');
    const modalBody = document.getElementById('serviceModalBody');

    modalBody.innerHTML = `
      <div class="service-details">
        <div class="detail-section">
          <h4>Description</h4>
          <p>${service.description}</p>
        </div>
        <div class="detail-section">
          <h4>Service Information</h4>
          <ul>
            <li><strong>Pricing:</strong> ${service.pricing}</li>
            <li><strong>Location:</strong> ${service.location}</li>
            <li><strong>Rating:</strong> ★ ${service.rating}</li>
            <li><strong>Services Completed:</strong> ${service.totalServices}</li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>Contact Information</h4>
          <ul>
            <li><strong>Phone:</strong> ${service.providerId.phone}</li>
            ${service.providerId.email ? `<li><strong>Email:</strong> ${service.providerId.email}</li>` : ''}
            <li><strong>Provider:</strong> ${service.providerId.name}</li>
            <li><strong>Location:</strong> ${service.providerId.location}</li>
          </ul>
        </div>
        ${service.certifications && service.certifications.length > 0 ? `
        <div class="detail-section">
          <h4>Certifications</h4>
          <ul>
            ${service.certifications.map(cert => `<li>${cert}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        <div class="modal-actions">
          <button class="btn btn-primary">Contact Provider</button>
          <button class="btn btn-accent">Book Service</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading service details:', error);
    alert('Failed to load service details. Please try again.');
  }
}

async function editService(serviceId) {
  // For now, just show an alert. In a real app, you'd open an edit modal
  alert('Edit functionality would open an edit form for service ID: ' + serviceId);
}

async function deleteService(serviceId) {
  if (confirm('Are you sure you want to delete this service?')) {
    try {
      await apiClient.delete(`/api/services/${serviceId}`);
      alert('Service deleted successfully!');
      loadMyServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}