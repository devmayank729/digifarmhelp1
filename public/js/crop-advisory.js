// Crop Advisory Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
  loadRecommendations();
  loadCrops();

  // Event listeners
  document.getElementById('seasonFilter').addEventListener('change', loadCrops);
  document.getElementById('regionFilter').addEventListener('input', loadCrops);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('cropModal').style.display = 'none';
  });
});

async function loadRecommendations() {
  try {
    const response = await apiClient.get('/api/crops/recommendations');
    const data = response.data;

    const container = document.getElementById('recommendationsContainer');

    if (data.recommendations.length === 0) {
      container.innerHTML = '<div class="no-data">No recommendations available. Please update your farmer profile.</div>';
      return;
    }

    container.innerHTML = `
      <div class="season-info">
        <h4>Current Season: ${data.currentSeason}</h4>
        <p>Farm Location: ${data.farmerProfile.location} | Soil Type: ${data.farmerProfile.soilType} | Farm Size: ${data.farmerProfile.farmSize} acres</p>
      </div>
      <div class="recommendations-grid">
        ${data.recommendations.map(crop => createCropCard(crop)).join('')}
      </div>
    `;
  } catch (error) {
    console.error('Error loading recommendations:', error);
    document.getElementById('recommendationsContainer').innerHTML =
      '<div class="error">Failed to load recommendations. Please try again.</div>';
  }
}

async function loadCrops() {
  try {
    const season = document.getElementById('seasonFilter').value;
    const region = document.getElementById('regionFilter').value;

    let url = '/api/crops';
    const params = new URLSearchParams();
    if (season) params.append('season', season);
    if (region) params.append('region', region);
    if (params.toString()) url += '?' + params.toString();

    const response = await apiClient.get(url);
    const crops = response.data;

    const container = document.getElementById('cropsContainer');
    container.innerHTML = crops.map(crop => createCropCard(crop)).join('');
  } catch (error) {
    console.error('Error loading crops:', error);
    document.getElementById('cropsContainer').innerHTML =
      '<div class="error">Failed to load crops. Please try again.</div>';
  }
}

function createCropCard(crop) {
  return `
    <div class="crop-card" onclick="showCropDetails('${crop._id}')">
      <div class="crop-header">
        <h4>${crop.name}</h4>
        <span class="season-badge season-${crop.season.toLowerCase()}">${crop.season}</span>
      </div>
      <div class="crop-info">
        <p><strong>Yield:</strong> ${crop.yield}</p>
        <p><strong>Market Price:</strong> ₹${crop.marketPrice}/acre</p>
        <p><strong>Soil:</strong> ${crop.soilRequirements}</p>
        <p><strong>Water:</strong> ${crop.waterRequirements}</p>
      </div>
      <div class="crop-regions">
        <small>Regions: ${crop.regions.join(', ')}</small>
      </div>
    </div>
  `;
}

async function showCropDetails(cropId) {
  try {
    const response = await apiClient.get(`/api/crops/${cropId}`);
    const crop = response.data;

    const modal = document.getElementById('cropModal');
    const modalBody = document.getElementById('cropModalBody');

    modalBody.innerHTML = `
      <div class="crop-details">
        <div class="detail-section">
          <h4>Description</h4>
          <p>${crop.description}</p>
        </div>
        <div class="detail-section">
          <h4>Requirements</h4>
          <ul>
            <li><strong>Soil:</strong> ${crop.soilRequirements}</li>
            <li><strong>Water:</strong> ${crop.waterRequirements}</li>
            <li><strong>Season:</strong> ${crop.season}</li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>Expected Output</h4>
          <ul>
            <li><strong>Yield:</strong> ${crop.yield}</li>
            <li><strong>Market Price:</strong> ₹${crop.marketPrice} per acre</li>
          </ul>
        </div>
        <div class="detail-section">
          <h4>Suitable Regions</h4>
          <p>${crop.regions.join(', ')}</p>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading crop details:', error);
    alert('Failed to load crop details. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}