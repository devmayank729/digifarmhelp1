// Livestock Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadLivestock();
  checkUserRole();
  setupLivestockForm();

  // Event listeners
  document.getElementById('searchLivestockBtn').addEventListener('click', searchLivestock);
  document.getElementById('addLivestockForm').addEventListener('submit', addLivestock);
  document.getElementById('livestockType').addEventListener('change', toggleMilkFields);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('livestockModal').style.display = 'none';
  });
});

function setupLivestockForm() {
  // Initially hide milk-related fields
  toggleMilkFields();
}

function toggleMilkFields() {
  const type = document.getElementById('livestockType').value;
  const milkFields = ['milkProductionGroup', 'lactationGroup', 'lactationMonthGroup'];

  if (['Cow', 'Buffalo', 'Goat'].includes(type)) {
    milkFields.forEach(fieldId => {
      document.getElementById(fieldId).style.display = 'block';
      document.getElementById(fieldId).querySelector('input').required = true;
    });
  } else {
    milkFields.forEach(fieldId => {
      document.getElementById(fieldId).style.display = 'none';
      document.getElementById(fieldId).querySelector('input').required = false;
    });
  }
}

async function checkUserRole() {
  try {
    const response = await apiClient.get('/api/auth/profile');
    const user = response.data;

    // Show/hide livestock management sections based on role
    const addLivestockCard = document.getElementById('addLivestockCard');
    const myLivestockCard = document.getElementById('myLivestockCard');

    if (user.role === 'Farmer' || user.role === 'Admin') {
      addLivestockCard.style.display = 'block';
      myLivestockCard.style.display = 'block';
      loadMyLivestock();
    } else {
      addLivestockCard.style.display = 'none';
      myLivestockCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

async function searchLivestock() {
  try {
    const type = document.getElementById('livestockTypeFilter').value;
    const location = document.getElementById('livestockLocationFilter').value;
    const breed = document.getElementById('livestockBreedFilter').value;

    let url = '/api/livestock';
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (location) params.append('location', location);
    if (breed) params.append('breed', breed);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const livestock = response.data;

    const container = document.getElementById('livestockResults');
    if (livestock.length === 0) {
      container.innerHTML = '<div class="no-data">No livestock found matching your criteria.</div>';
      return;
    }

    container.innerHTML = livestock.map(item => createLivestockCard(item)).join('');
  } catch (error) {
    console.error('Error searching livestock:', error);
    document.getElementById('livestockResults').innerHTML =
      '<div class="error">Failed to search livestock. Please try again.</div>';
  }
}

async function loadLivestock() {
  try {
    const response = await apiClient.get('/api/livestock');
    const livestock = response.data;

    const container = document.getElementById('livestockResults');
    if (livestock.length === 0) {
      container.innerHTML = '<div class="no-data">No livestock available for sale.</div>';
      return;
    }

    container.innerHTML = livestock.map(item => createLivestockCard(item)).join('');
  } catch (error) {
    console.error('Error loading livestock:', error);
    document.getElementById('livestockResults').innerHTML =
      '<div class="error">Failed to load livestock. Please try again.</div>';
  }
}

async function loadMyLivestock() {
  try {
    const response = await apiClient.get('/api/livestock/my');
    const livestock = response.data;

    const container = document.getElementById('myLivestockResults');
    if (livestock.length === 0) {
      container.innerHTML = '<div class="no-data">You haven\'t listed any livestock for sale yet.</div>';
      return;
    }

    container.innerHTML = livestock.map(item => createMyLivestockCard(item)).join('');
  } catch (error) {
    console.error('Error loading my livestock:', error);
    document.getElementById('myLivestockResults').innerHTML =
      '<div class="error">Failed to load your listings. Please try again.</div>';
  }
}

function createLivestockCard(livestock) {
  const isMilkingAnimal = ['Cow', 'Buffalo', 'Goat'].includes(livestock.type);

  return `
    <div class="result-card" onclick="showLivestockDetails('${livestock._id}')">
      <div class="result-header">
        <h4>${livestock.breed} ${livestock.type}</h4>
        <span class="price-tag">₹${livestock.price.toLocaleString()}</span>
      </div>
      <div class="result-info">
        <p><strong>Age:</strong> ${livestock.age} months</p>
        <p><strong>Weight:</strong> ${livestock.weight} kg</p>
        ${isMilkingAnimal ? `<p><strong>Milk Production:</strong> ${livestock.milkProduction} L/day</p>` : ''}
        <p><strong>Location:</strong> ${livestock.location}</p>
      </div>
      <div class="result-description">
        <p>${livestock.description}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Contact Seller</button>
        <button class="btn btn-accent btn-sm">View Details</button>
      </div>
    </div>
  `;
}

function createMyLivestockCard(livestock) {
  return `
    <div class="result-card">
      <div class="result-header">
        <h4>${livestock.breed} ${livestock.type}</h4>
        <span class="status-badge ${livestock.isSold ? 'sold' : 'available'}">
          ${livestock.isSold ? 'Sold' : 'Available'}
        </span>
      </div>
      <div class="result-info">
        <p><strong>Price:</strong> ₹${livestock.price.toLocaleString()}</p>
        <p><strong>Age:</strong> ${livestock.age} months</p>
        <p><strong>Location:</strong> ${livestock.location}</p>
      </div>
      <div class="result-actions">
        ${!livestock.isSold ? `
          <button class="btn btn-secondary btn-sm" onclick="editLivestock('${livestock._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteLivestock('${livestock._id}')">Delete</button>
          <button class="btn btn-success btn-sm" onclick="markAsSold('${livestock._id}')">Mark as Sold</button>
        ` : `
          <button class="btn btn-secondary btn-sm" disabled>Sold</button>
        `}
      </div>
    </div>
  `;
}

async function addLivestock(event) {
  event.preventDefault();

  const type = document.getElementById('livestockType').value;
  const isMilkingAnimal = ['Cow', 'Buffalo', 'Goat'].includes(type);

  const formData = {
    type: type,
    breed: document.getElementById('livestockBreed').value,
    age: parseInt(document.getElementById('livestockAge').value),
    weight: parseInt(document.getElementById('livestockWeight').value),
    location: document.getElementById('livestockLocation').value,
    price: parseInt(document.getElementById('livestockPrice').value),
    description: document.getElementById('livestockDescription').value
  };

  if (isMilkingAnimal) {
    formData.milkProduction = parseFloat(document.getElementById('livestockMilkProduction').value);
    formData.lactationCount = parseInt(document.getElementById('livestockLactationCount').value);
    formData.lactationMonth = parseInt(document.getElementById('livestockLactationMonth').value);
  }

  try {
    const response = await apiClient.post('/api/livestock', formData);
    alert('Livestock listed for sale successfully!');
    document.getElementById('addLivestockForm').reset();
    loadMyLivestock();
  } catch (error) {
    console.error('Error adding livestock:', error);
    alert('Failed to list livestock. Please try again.');
  }
}

async function showLivestockDetails(livestockId) {
  try {
    const response = await apiClient.get(`/api/livestock/${livestockId}`);
    const livestock = response.data;

    const modal = document.getElementById('livestockModal');
    const modalBody = document.getElementById('livestockModalBody');

    const isMilkingAnimal = ['Cow', 'Buffalo', 'Goat'].includes(livestock.type);

    modalBody.innerHTML = `
      <div class="livestock-details">
        <div class="detail-section">
          <h4>Animal Information</h4>
          <ul>
            <li><strong>Type:</strong> ${livestock.type}</li>
            <li><strong>Breed:</strong> ${livestock.breed}</li>
            <li><strong>Age:</strong> ${livestock.age} months</li>
            <li><strong>Weight:</strong> ${livestock.weight} kg</li>
            <li><strong>Location:</strong> ${livestock.location}</li>
            <li><strong>Price:</strong> ₹${livestock.price.toLocaleString()}</li>
          </ul>
        </div>
        ${isMilkingAnimal ? `
        <div class="detail-section">
          <h4>Milk Production Details</h4>
          <ul>
            <li><strong>Daily Milk Production:</strong> ${livestock.milkProduction} liters</li>
            <li><strong>Lactation Count:</strong> ${livestock.lactationCount}</li>
            <li><strong>Current Lactation Month:</strong> ${livestock.lactationMonth}</li>
          </ul>
        </div>
        ` : ''}
        <div class="detail-section">
          <h4>Description</h4>
          <p>${livestock.description}</p>
        </div>
        <div class="detail-section">
          <h4>Seller Information</h4>
          <ul>
            <li><strong>Name:</strong> ${livestock.sellerId.name}</li>
            <li><strong>Phone:</strong> ${livestock.sellerId.phone}</li>
            <li><strong>Location:</strong> ${livestock.sellerId.location}</li>
          </ul>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary">Contact Seller</button>
          <button class="btn btn-accent">Negotiate Price</button>
          <button class="btn btn-secondary">View Location</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading livestock details:', error);
    alert('Failed to load livestock details. Please try again.');
  }
}

async function editLivestock(livestockId) {
  // For now, just show an alert. In a real app, you'd open an edit modal
  alert('Edit functionality would open an edit form for livestock ID: ' + livestockId);
}

async function deleteLivestock(livestockId) {
  if (confirm('Are you sure you want to delete this listing?')) {
    try {
      await apiClient.delete(`/api/livestock/${livestockId}`);
      alert('Livestock listing deleted successfully!');
      loadMyLivestock();
    } catch (error) {
      console.error('Error deleting livestock:', error);
      alert('Failed to delete listing. Please try again.');
    }
  }
}

async function markAsSold(livestockId) {
  if (confirm('Mark this livestock as sold?')) {
    try {
      await apiClient.put(`/api/livestock/${livestockId}/sold`);
      alert('Livestock marked as sold!');
      loadMyLivestock();
    } catch (error) {
      console.error('Error marking as sold:', error);
      alert('Failed to update status. Please try again.');
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}