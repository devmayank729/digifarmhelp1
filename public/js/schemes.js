// Schemes Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadSchemes();
  checkUserRole();

  // Event listeners
  document.getElementById('searchSchemesBtn').addEventListener('click', searchSchemes);
  document.getElementById('addSchemeForm').addEventListener('submit', addScheme);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('schemeModal').style.display = 'none';
  });
});

async function checkUserRole() {
  try {
    const response = await apiClient.get('/api/auth/profile');
    const user = response.data;

    // Show/hide admin sections based on role
    const addSchemeCard = document.getElementById('addSchemeCard');

    if (user.role === 'Admin') {
      addSchemeCard.style.display = 'block';
    } else {
      addSchemeCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

async function searchSchemes() {
  try {
    const category = document.getElementById('schemeCategoryFilter').value;
    const region = document.getElementById('schemeRegionFilter').value;

    let url = '/api/schemes';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (region) params.append('region', region);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const schemes = response.data;

    const container = document.getElementById('schemesResults');
    if (schemes.length === 0) {
      container.innerHTML = '<div class="no-data">No schemes found matching your criteria.</div>';
      return;
    }

    container.innerHTML = schemes.map(scheme => createSchemeCard(scheme)).join('');
  } catch (error) {
    console.error('Error searching schemes:', error);
    document.getElementById('schemesResults').innerHTML =
      '<div class="error">Failed to search schemes. Please try again.</div>';
  }
}

async function loadSchemes() {
  try {
    const response = await apiClient.get('/api/schemes');
    const schemes = response.data;

    const container = document.getElementById('schemesResults');
    if (schemes.length === 0) {
      container.innerHTML = '<div class="no-data">No government schemes available.</div>';
      return;
    }

    container.innerHTML = schemes.map(scheme => createSchemeCard(scheme)).join('');
  } catch (error) {
    console.error('Error loading schemes:', error);
    document.getElementById('schemesResults').innerHTML =
      '<div class="error">Failed to load schemes. Please try again.</div>';
  }
}

function createSchemeCard(scheme) {
  const deadlineText = scheme.deadline ?
    `Deadline: ${new Date(scheme.deadline).toLocaleDateString()}` :
    'No deadline specified';

  return `
    <div class="result-card" onclick="showSchemeDetails('${scheme._id}')">
      <div class="result-header">
        <h4>${scheme.name}</h4>
        <span class="category-badge">${scheme.category}</span>
      </div>
      <div class="result-info">
        <p><strong>Category:</strong> ${scheme.category}</p>
        <p><strong>Status:</strong> ${scheme.isActive ? 'Active' : 'Inactive'}</p>
        <p><strong>Deadline:</strong> ${deadlineText}</p>
      </div>
      <div class="result-description">
        <p>${scheme.description}</p>
      </div>
      <div class="result-regions">
        <small>Regions: ${scheme.regions.join(', ')}</small>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Apply Now</button>
        <button class="btn btn-secondary btn-sm">Learn More</button>
      </div>
    </div>
  `;
}

function filterByCategory(category) {
  document.getElementById('schemeCategoryFilter').value = category;
  searchSchemes();
}

async function addScheme(event) {
  event.preventDefault();

  const regions = document.getElementById('schemeRegions').value
    .split(',')
    .map(region => region.trim())
    .filter(region => region.length > 0);

  const deadline = document.getElementById('schemeDeadline').value;
  const formData = {
    name: document.getElementById('schemeName').value,
    category: document.getElementById('schemeCategory').value,
    description: document.getElementById('schemeDescription').value,
    eligibility: document.getElementById('schemeEligibility').value,
    benefits: document.getElementById('schemeBenefits').value,
    applicationProcess: document.getElementById('schemeProcess').value,
    contactInfo: document.getElementById('schemeContact').value,
    regions: regions,
    deadline: deadline ? new Date(deadline) : null
  };

  try {
    const response = await apiClient.post('/api/schemes', formData);
    alert('Scheme added successfully!');
    document.getElementById('addSchemeForm').reset();
    loadSchemes();
  } catch (error) {
    console.error('Error adding scheme:', error);
    alert('Failed to add scheme. Please try again.');
  }
}

async function showSchemeDetails(schemeId) {
  try {
    const response = await apiClient.get(`/api/schemes/${schemeId}`);
    const scheme = response.data;

    const modal = document.getElementById('schemeModal');
    const modalBody = document.getElementById('schemeModalBody');

    const deadlineText = scheme.deadline ?
      new Date(scheme.deadline).toLocaleDateString() :
      'No deadline specified';

    modalBody.innerHTML = `
      <div class="scheme-details">
        <div class="detail-section">
          <h4>Description</h4>
          <p>${scheme.description}</p>
        </div>
        <div class="detail-section">
          <h4>Eligibility Criteria</h4>
          <p>${scheme.eligibility}</p>
        </div>
        <div class="detail-section">
          <h4>Benefits</h4>
          <p>${scheme.benefits}</p>
        </div>
        <div class="detail-section">
          <h4>Application Process</h4>
          <p>${scheme.applicationProcess}</p>
        </div>
        <div class="detail-section">
          <h4>Important Information</h4>
          <ul>
            <li><strong>Category:</strong> ${scheme.category}</li>
            <li><strong>Status:</strong> ${scheme.isActive ? 'Active' : 'Inactive'}</li>
            <li><strong>Deadline:</strong> ${deadlineText}</li>
            <li><strong>Contact:</strong> ${scheme.contactInfo || 'Not specified'}</li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>Applicable Regions</h4>
          <p>${scheme.regions.join(', ')}</p>
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary">Apply Online</button>
          <button class="btn btn-accent">Download Application Form</button>
          <button class="btn btn-secondary">Contact Helpline</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading scheme details:', error);
    alert('Failed to load scheme details. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}