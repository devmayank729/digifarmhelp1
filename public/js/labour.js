// Labour Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadAgencies();
  checkUserRole();

  // Event listeners
  document.getElementById('searchLabourBtn').addEventListener('click', searchLabour);
  document.getElementById('labourRegistrationForm').addEventListener('submit', registerLabour);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('labourModal').style.display = 'none';
  });
});

async function checkUserRole() {
  try {
    const response = await apiClient.get('/api/auth/profile');
    const user = response.data;

    // Show/hide registration form based on role
    const registrationCard = document.getElementById('labourRegistrationCard');
    if (user.role === 'Farmer' || user.role === 'Admin') {
      registrationCard.style.display = 'block';
    } else {
      registrationCard.style.display = 'none';
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  }
}

async function searchLabour() {
  try {
    const location = document.getElementById('labourLocationFilter').value;
    const skills = document.getElementById('labourSkillFilter').value;

    let url = '/api/labour/search';
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (skills) params.append('skills', skills);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const labour = response.data;

    const container = document.getElementById('labourResults');
    if (labour.length === 0) {
      container.innerHTML = '<div class="no-data">No labour found matching your criteria.</div>';
      return;
    }

    container.innerHTML = labour.map(l => createLabourCard(l)).join('');
  } catch (error) {
    console.error('Error searching labour:', error);
    document.getElementById('labourResults').innerHTML =
      '<div class="error">Failed to search labour. Please try again.</div>';
  }
}

async function loadAgencies() {
  try {
    const response = await apiClient.get('/api/labour/agencies');
    const agencies = response.data;

    const container = document.getElementById('agencyResults');
    if (agencies.length === 0) {
      container.innerHTML = '<div class="no-data">No agencies found.</div>';
      return;
    }

    container.innerHTML = agencies.map(agency => createAgencyCard(agency)).join('');
  } catch (error) {
    console.error('Error loading agencies:', error);
    document.getElementById('agencyResults').innerHTML =
      '<div class="error">Failed to load agencies. Please try again.</div>';
  }
}

function createLabourCard(labour) {
  return `
    <div class="result-card" onclick="showLabourDetails('${labour._id}')">
      <div class="result-header">
        <h4>${labour.name}</h4>
        <span class="rating">★ ${labour.rating}</span>
      </div>
      <div class="result-info">
        <p><strong>Age:</strong> ${labour.age} years</p>
        <p><strong>Skills:</strong> ${labour.skills.join(', ')}</p>
        <p><strong>Experience:</strong> ${labour.experience} years</p>
        <p><strong>Location:</strong> ${labour.location}</p>
        <p><strong>Rate:</strong> ₹${labour.hourlyRate}/hour</p>
        <p><strong>Jobs Completed:</strong> ${labour.totalJobs}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Contact</button>
      </div>
    </div>
  `;
}

function createAgencyCard(agency) {
  return `
    <div class="result-card">
      <div class="result-header">
        <h4>${agency.agencyName}</h4>
        <span class="rating">★ ${agency.rating}</span>
      </div>
      <div class="result-info">
        <p><strong>Location:</strong> ${agency.location}</p>
        <p><strong>Services:</strong> ${agency.services.join(', ')}</p>
        <p><strong>Contact:</strong> ${agency.contactNumber}</p>
        <p><strong>Jobs Completed:</strong> ${agency.totalJobs}</p>
      </div>
      <div class="result-description">
        <p>${agency.description}</p>
      </div>
      <div class="result-actions">
        <button class="btn btn-primary btn-sm">Contact Agency</button>
      </div>
    </div>
  `;
}

async function registerLabour(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('labourName').value,
    age: parseInt(document.getElementById('labourAge').value),
    gender: document.getElementById('labourGender').value,
    skills: Array.from(document.getElementById('labourSkills').selectedOptions).map(option => option.value),
    experience: parseInt(document.getElementById('labourExperience').value),
    location: document.getElementById('labourLocation').value,
    contactNumber: document.getElementById('labourPhone').value,
    hourlyRate: parseInt(document.getElementById('labourRate').value),
    description: document.getElementById('labourDescription').value
  };

  try {
    const response = await apiClient.post('/api/labour/register', formData);
    alert('Labour registration successful!');
    document.getElementById('labourRegistrationForm').reset();
  } catch (error) {
    console.error('Error registering labour:', error);
    alert('Failed to register. Please try again.');
  }
}

async function showLabourDetails(labourId) {
  try {
    // For now, we'll show a simple modal. In a real app, you'd fetch detailed labour info
    const modal = document.getElementById('labourModal');
    const modalBody = document.getElementById('labourModalBody');

    modalBody.innerHTML = `
      <div class="labour-details">
        <p><strong>Labour ID:</strong> ${labourId}</p>
        <p>Contact this labour through the platform for detailed information.</p>
        <div class="modal-actions">
          <button class="btn btn-primary">Send Message</button>
          <button class="btn btn-secondary">Call Now</button>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error showing labour details:', error);
    alert('Failed to load labour details. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}