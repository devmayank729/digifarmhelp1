// Tools Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadTools();
  checkUserRole();

  // Event listeners
  document.getElementById('searchToolsBtn').addEventListener('click', searchTools);
  document.getElementById('addToolForm').addEventListener('submit', addTool);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('toolModal').style.display = 'none';
  });
});

async function checkUserRole() {
  try {
    const response = await apiClient.get('/api/auth/profile');
    const user = response.data;

    // Show/hide tool management sections based on role
    const addToolCard = document.getElementById('addToolCard');
    const myToolsCard = document.getElementById('myToolsCard');

    if (user.role === 'Tool/Service Provider' || user.role === 'Admin') {
      addToolCard.style.display = 'block';
      myToolsCard.style.display = 'block';
      loadMyTools();
    } else {
      addToolCard.style.display = 'none';
      myToolsCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

async function searchTools() {
  try {
    const location = document.getElementById('toolLocationFilter').value;
    const category = document.getElementById('toolCategoryFilter').value;

    let url = '/api/tools';
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (category) params.append('category', category);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const tools = response.data;

    const container = document.getElementById('toolsResults');
    if (tools.length === 0) {
      container.innerHTML = '<div class="no-data">No tools found matching your criteria.</div>';
      return;
    }

    container.innerHTML = tools.map(tool => createToolCard(tool)).join('');
  } catch (error) {
    console.error('Error searching tools:', error);
    document.getElementById('toolsResults').innerHTML =
      '<div class="error">Failed to search tools. Please try again.</div>';
  }
}

async function loadTools() {
  try {
    const response = await apiClient.get('/api/tools');
    const tools = response.data;

    const container = document.getElementById('toolsResults');
    if (tools.length === 0) {
      container.innerHTML = '<div class="no-data">No tools available.</div>';
      return;
    }

    container.innerHTML = tools.map(tool => createToolCard(tool)).join('');
  } catch (error) {
    console.error('Error loading tools:', error);
    document.getElementById('toolsResults').innerHTML =
      '<div class="error">Failed to load tools. Please try again.</div>';
  }
}

async function loadMyTools() {
  try {
    const response = await apiClient.get('/api/tools/my');
    const tools = response.data;

    const container = document.getElementById('myToolsResults');
    if (tools.length === 0) {
      container.innerHTML = '<div class="no-data">You haven\'t added any tools yet.</div>';
      return;
    }

    container.innerHTML = tools.map(tool => createMyToolCard(tool)).join('');
  } catch (error) {
    console.error('Error loading my tools:', error);
    document.getElementById('myToolsResults').innerHTML =
      '<div class="error">Failed to load your tools. Please try again.</div>';
  }
}

function createToolCard(tool) {
  return `
    <div class="result-card" onclick="showToolDetails('${tool._id}')">
      <div class="result-header">
        <h4>${tool.name}</h4>
        <span class="category-badge">${tool.category}</span>
      </div>
      <div class="result-info">
        <p><strong>Daily Rate:</strong> ₹${tool.dailyRate}</p>
        <p><strong>Location:</strong> ${tool.location}</p>
        <p><strong>Rating:</strong> ★ ${tool.rating}</p>
        <p><strong>Rentals:</strong> ${tool.totalRentals}</p>
      </div>
      <div class="result-description">
        <p>${tool.description}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Rent Now</button>
      </div>
    </div>
  `;
}

function createMyToolCard(tool) {
  return `
    <div class="result-card">
      <div class="result-header">
        <h4>${tool.name}</h4>
        <span class="status-badge ${tool.availability ? 'available' : 'unavailable'}">
          ${tool.availability ? 'Available' : 'Rented'}
        </span>
      </div>
      <div class="result-info">
        <p><strong>Daily Rate:</strong> ₹${tool.dailyRate}</p>
        <p><strong>Location:</strong> ${tool.location}</p>
        <p><strong>Rating:</strong> ★ ${tool.rating}</p>
        <p><strong>Rentals:</strong> ${tool.totalRentals}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-secondary btn-sm" onclick="editTool('${tool._id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteTool('${tool._id}')">Delete</button>
      </div>
    </div>
  `;
}

async function addTool(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('toolName').value,
    category: document.getElementById('toolCategory').value,
    description: document.getElementById('toolDescription').value,
    specifications: document.getElementById('toolSpecifications').value,
    dailyRate: parseInt(document.getElementById('toolDailyRate').value),
    location: document.getElementById('toolLocation').value
  };

  try {
    const response = await apiClient.post('/api/tools', formData);
    alert('Tool added successfully!');
    document.getElementById('addToolForm').reset();
    loadMyTools();
  } catch (error) {
    console.error('Error adding tool:', error);
    alert('Failed to add tool. Please try again.');
  }
}

async function showToolDetails(toolId) {
  try {
    const response = await apiClient.get(`/api/tools/${toolId}`);
    const tool = response.data;

    const modal = document.getElementById('toolModal');
    const modalBody = document.getElementById('toolModalBody');

    modalBody.innerHTML = `
      <div class="tool-details">
        <div class="detail-section">
          <h4>Description</h4>
          <p>${tool.description}</p>
        </div>
        ${tool.specifications ? `
        <div class="detail-section">
          <h4>Specifications</h4>
          <p>${tool.specifications}</p>
        </div>
        ` : ''}
        <div class="detail-section">
          <h4>Rental Information</h4>
          <ul>
            <li><strong>Daily Rate:</strong> ₹${tool.dailyRate}</li>
            <li><strong>Location:</strong> ${tool.location}</li>
            <li><strong>Rating:</strong> ★ ${tool.rating}</li>
            <li><strong>Total Rentals:</strong> ${tool.totalRentals}</li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>Owner Information</h4>
          <p><strong>Name:</strong> ${tool.ownerId.name}</p>
          <p><strong>Phone:</strong> ${tool.ownerId.phone}</p>
          <p><strong>Location:</strong> ${tool.ownerId.location}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary">Contact Owner</button>
          <button class="btn btn-accent">Rent Now</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading tool details:', error);
    alert('Failed to load tool details. Please try again.');
  }
}

async function editTool(toolId) {
  // For now, just show an alert. In a real app, you'd open an edit modal
  alert('Edit functionality would open an edit form for tool ID: ' + toolId);
}

async function deleteTool(toolId) {
  if (confirm('Are you sure you want to delete this tool?')) {
    try {
      await apiClient.delete(`/api/tools/${toolId}`);
      alert('Tool deleted successfully!');
      loadMyTools();
    } catch (error) {
      console.error('Error deleting tool:', error);
      alert('Failed to delete tool. Please try again.');
    }
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}