// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'Admin') {
    window.location.href = '/dashboard';
  }

  loadAdminStats();

  // Event listeners
  document.getElementById('viewAllUsersBtn').addEventListener('click', () => showAdminModal('Users', loadUsersContent));
  document.getElementById('manageRolesBtn').addEventListener('click', () => showAdminModal('Role Management', loadRolesContent));
  document.getElementById('userReportsBtn').addEventListener('click', () => showAdminModal('User Reports', loadUserReportsContent));
  document.getElementById('manageCropsBtn').addEventListener('click', () => showAdminModal('Crop Management', loadCropsContent));
  document.getElementById('manageSchemesBtn').addEventListener('click', () => showAdminModal('Scheme Management', loadSchemesContent));
  document.getElementById('systemSettingsBtn').addEventListener('click', () => showAdminModal('System Settings', loadSettingsContent));
  document.getElementById('usageReportsBtn').addEventListener('click', () => showAdminModal('Usage Reports', loadUsageReportsContent));
  document.getElementById('financialReportsBtn').addEventListener('click', () => showAdminModal('Financial Reports', loadFinancialReportsContent));
  document.getElementById('exportDataBtn').addEventListener('click', exportData);
  document.getElementById('backupBtn').addEventListener('click', createBackup);
  document.getElementById('maintenanceBtn').addEventListener('click', toggleMaintenance);
  document.getElementById('logoutBtn').addEventListener('click', logout);

  // Modal close
  document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('adminModal').style.display = 'none';
  });
});

async function loadAdminStats() {
  try {
    // Load user statistics
    const userStatsResponse = await apiClient.get('/api/auth/profile'); // This would need an admin endpoint
    const userStats = document.getElementById('userStats');
    userStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Total Users:</span>
        <span class="stat-value">150</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Active Farmers:</span>
        <span class="stat-value">120</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Service Providers:</span>
        <span class="stat-value">25</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Labour Agencies:</span>
        <span class="stat-value">5</span>
      </div>
    `;

    // Load activity statistics
    const activityStats = document.getElementById('activityStats');
    activityStats.innerHTML = `
      <div class="stat-item">
        <span class="stat-label">Marketplace Items:</span>
        <span class="stat-value">450</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Active Tools:</span>
        <span class="stat-value">85</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Livestock Listings:</span>
        <span class="stat-value">32</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Government Schemes:</span>
        <span class="stat-value">15</span>
      </div>
    `;

    // Update active users count
    document.getElementById('activeUsersCount').textContent = '23';

  } catch (error) {
    console.error('Error loading admin stats:', error);
  }
}

function showAdminModal(title, contentLoader) {
  const modal = document.getElementById('adminModal');
  const modalTitle = document.getElementById('adminModalTitle');
  const modalBody = document.getElementById('adminModalBody');

  modalTitle.textContent = title;
  modalBody.innerHTML = '<div class="loading">Loading...</div>';
  modal.style.display = 'block';

  // Load content
  setTimeout(() => {
    contentLoader(modalBody);
  }, 500);
}

function loadUsersContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>All Users</h4>
      <div class="user-list">
        <div class="user-item">
          <div class="user-info">
            <strong>Ramesh Kumar</strong> (Farmer) - Punjab
          </div>
          <div class="user-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-danger">Suspend</button>
          </div>
        </div>
        <div class="user-item">
          <div class="user-info">
            <strong>Sharma Labour Agency</strong> (Labour Agency) - Haryana
          </div>
          <div class="user-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-danger">Suspend</button>
          </div>
        </div>
        <div class="user-item">
          <div class="user-info">
            <strong>AgriTech Services</strong> (Tool/Service Provider) - Maharashtra
          </div>
          <div class="user-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-danger">Suspend</button>
          </div>
        </div>
      </div>
      <div class="pagination">
        <button class="btn btn-sm">Previous</button>
        <span>Page 1 of 8</span>
        <button class="btn btn-sm">Next</button>
      </div>
    </div>
  `;
}

function loadRolesContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>Role Management</h4>
      <form class="role-form">
        <div class="form-group">
          <label>Select User:</label>
          <select class="form-control">
            <option>Ramesh Kumar (Current: Farmer)</option>
            <option>Sharma Labour Agency (Current: Labour Agency)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Change Role To:</label>
          <select class="form-control">
            <option>Farmer</option>
            <option>Labour Agency</option>
            <option>Tool/Service Provider</option>
            <option>Admin</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Update Role</button>
      </form>
    </div>
  `;
}

function loadUserReportsContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>User Activity Reports</h4>
      <div class="report-filters">
        <select class="form-control">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 3 months</option>
        </select>
        <button class="btn btn-primary">Generate Report</button>
      </div>
      <div class="report-results">
        <div class="report-item">
          <h5>New User Registrations</h5>
          <p>Last 7 days: 12 new users</p>
        </div>
        <div class="report-item">
          <h5>Most Active Users</h5>
          <p>1. Ramesh Kumar - 45 activities</p>
          <p>2. Suresh Patel - 32 activities</p>
        </div>
      </div>
    </div>
  `;
}

function loadCropsContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>Crop Database Management</h4>
      <div class="admin-actions">
        <button class="btn btn-primary" onclick="showCropForm()">Add New Crop</button>
        <button class="btn btn-secondary">Import Crops</button>
      </div>
      <div class="crop-list">
        <div class="crop-item">
          <div class="crop-info">
            <strong>Wheat</strong> - Rabi Season
            <br><small>Regions: Punjab, Haryana, UP</small>
          </div>
          <div class="crop-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
        <div class="crop-item">
          <div class="crop-info">
            <strong>Rice</strong> - Kharif Season
            <br><small>Regions: Punjab, Haryana, Uttarakhand</small>
          </div>
          <div class="crop-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function loadSchemesContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>Government Schemes Management</h4>
      <div class="admin-actions">
        <button class="btn btn-primary" onclick="window.location.href='/schemes'">Add New Scheme</button>
        <button class="btn btn-secondary">Bulk Import</button>
      </div>
      <div class="scheme-list">
        <div class="scheme-item">
          <div class="scheme-info">
            <strong>PM Kisan Samman Nidhi</strong>
            <br><small>Category: Subsidy | Status: Active</small>
          </div>
          <div class="scheme-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-warning">Deactivate</button>
          </div>
        </div>
        <div class="scheme-item">
          <div class="scheme-info">
            <strong>Pradhan Mantri Fasal Bima Yojana</strong>
            <br><small>Category: Insurance | Status: Active</small>
          </div>
          <div class="scheme-actions">
            <button class="btn btn-sm btn-secondary">Edit</button>
            <button class="btn btn-sm btn-warning">Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function loadSettingsContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>System Settings</h4>
      <form class="settings-form">
        <div class="form-group">
          <label>Platform Name:</label>
          <input type="text" class="form-control" value="DigiFarmHelp">
        </div>
        <div class="form-group">
          <label>Support Email:</label>
          <input type="email" class="form-control" value="support@digifarmhelp.com">
        </div>
        <div class="form-group">
          <label>Maintenance Mode:</label>
          <select class="form-control">
            <option>Disabled</option>
            <option>Enabled</option>
          </select>
        </div>
        <div class="form-group">
          <label>Default Language:</label>
          <select class="form-control">
            <option>English</option>
            <option>Hindi</option>
            <option>Marathi</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary">Save Settings</button>
      </form>
    </div>
  `;
}

function loadUsageReportsContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>Usage Analytics</h4>
      <div class="analytics-grid">
        <div class="analytics-item">
          <h5>Page Views</h5>
          <div class="metric">12,450</div>
          <small>+15% from last month</small>
        </div>
        <div class="analytics-item">
          <h5>Active Sessions</h5>
          <div class="metric">89</div>
          <small>Current active users</small>
        </div>
        <div class="analytics-item">
          <h5>API Calls</h5>
          <div class="metric">45,230</div>
          <small>Last 24 hours</small>
        </div>
        <div class="analytics-item">
          <h5>Avg. Session Duration</h5>
          <div class="metric">8m 32s</div>
          <small>User engagement</small>
        </div>
      </div>
    </div>
  `;
}

function loadFinancialReportsContent(container) {
  container.innerHTML = `
    <div class="admin-section">
      <h4>Financial Overview</h4>
      <div class="financial-grid">
        <div class="financial-item">
          <h5>Monthly Revenue</h5>
          <div class="metric">₹12,450</div>
          <small>From premium features</small>
        </div>
        <div class="financial-item">
          <h5>Transaction Volume</h5>
          <div class="metric">₹2,34,000</div>
          <small>Marketplace transactions</small>
        </div>
        <div class="financial-item">
          <h5>Commission Earned</h5>
          <div class="metric">₹15,230</div>
          <small>Platform fees</small>
        </div>
        <div class="financial-item">
          <h5>Pending Payouts</h5>
          <div class="metric">₹8,900</div>
          <small>To service providers</small>
        </div>
      </div>
    </div>
  `;
}

async function exportData() {
  alert('Data export functionality would generate CSV/Excel files of all platform data.');
}

async function createBackup() {
  alert('Backup creation initiated. This would create a full database and file backup.');
}

async function toggleMaintenance() {
  const isMaintenance = confirm('Enable maintenance mode? This will temporarily disable the platform for users.');
  if (isMaintenance) {
    alert('Maintenance mode enabled. Users will see a maintenance page.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}