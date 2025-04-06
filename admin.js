// Admin Dashboard Data
const users = {
  patients: [
    { id: 1, firstName: "John", lastName: "Doe", email: "patient@example.com", lastActive: "2025-04-01", role: "patient" },
    { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", lastActive: "2025-04-02", role: "patient" },
    { id: 3, firstName: "Robert", lastName: "Johnson", email: "robert@example.com", lastActive: "2025-03-30", role: "patient" }
  ],
  doctors: [
    { id: 1, firstName: "Sarah", lastName: "Williams", email: "dr.williams@example.com", specialty: "Cardiology", status: "Active", role: "doctor" },
    { id: 2, firstName: "Michael", lastName: "Brown", email: "dr.brown@example.com", specialty: "Neurology", status: "Active", role: "doctor" },
    { id: 3, firstName: "Emily", lastName: "Davis", email: "dr.davis@example.com", specialty: "Pediatrics", status: "On Leave", role: "doctor" }
  ],
  admins: [
    { id: 1, firstName: "Admin", lastName: "User", email: "admin@example.com", role: "admin", permissions: "Full" }
  ]
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!checkAuth('admin')) return;

  // Set admin name
  document.getElementById('adminName').textContent = localStorage.getItem('userName') || 'Admin';

  // Load dashboard data
  loadDashboardStats();
  loadUserManagement();

  // Initialize modal
  initUserModal();

  // Set up event listeners
  setupEventListeners();
});

function loadDashboardStats() {
  // Update stats cards
  document.getElementById('totalUsers').textContent =
    users.patients.length + users.doctors.length + users.admins.length;
  document.getElementById('activeDoctors').textContent =
    users.doctors.filter(d => d.status === 'Active').length;
  document.getElementById('newPatients').textContent =
    users.patients.filter(p => new Date(p.lastActive) > new Date(Date.now() - 30 * 86400000)).length;
  document.getElementById('totalAppointments').textContent = "142"; // This would come from API
}

function loadUserManagement() {
  // Load patients
  loadUsersTable('patients', users.patients);

  // Load doctors
  loadUsersTable('doctors', users.doctors);

  // Load admins
  loadUsersTable('admins', users.admins);
}

function loadUsersTable(type, userList) {
  const container = document.getElementById(`${type}List`);
  if (!container) return;

  container.innerHTML = userList.map(user => {
    let row = `
      <tr>
        <td>${user.id}</td>
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
    `;

    if (type === 'doctors') {
      row += `
        <td>${user.specialty}</td>
        <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
      `;
    } else if (type === 'admins') {
      row += `<td>${user.role}</td>`;
    } else {
      row += `<td>${user.lastActive}</td>`;
    }

    row += `
        <td class="actions">
          <button class="action-btn btn-edit" data-user-type="${type}" data-user-id="${user.id}">
            <i class="fas fa-edit"></i> Edit
          </button>
          <button class="action-btn btn-view" data-user-type="${type}" data-user-id="${user.id}">
            <i class="fas fa-eye"></i> View
          </button>
          ${type !== 'admins' || user.id !== 1 ? `
            <button class="action-btn btn-delete" data-user-type="${type}" data-user-id="${user.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          ` : ''}
        </td>
      </tr>
    `;

    return row;
  }).join('');
}

function initUserModal() {
  const modal = document.getElementById('userModal');
  const closeBtn = modal.querySelector('.close-btn');

  // Close modal
  closeBtn.addEventListener('click', () => modal.style.display = 'none');

  // Close when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Show specialty field for doctors
  document.getElementById('userRole').addEventListener('change', (e) => {
    document.getElementById('specialtyField').style.display =
      e.target.value === 'doctor' ? 'block' : 'none';
  });

  // Form submission
  document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    saveUser();
  });
}

function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
    });
  });

  // Add user button
  document.getElementById('addUserBtn').addEventListener('click', () => {
    openUserModal();
  });

  // Search functionality
  document.getElementById('userSearch').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;

    document.querySelectorAll(`#${activeTab}List tr`).forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
  });

  // Edit/View/Delete buttons (delegated)
  document.querySelectorAll('#patientsList, #doctorsList, #adminsList').forEach(table => {
    table.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const userId = btn.dataset.userId;
      const userType = btn.dataset.userType;
      const user = users[userType].find(u => u.id == userId);

      if (btn.classList.contains('btn-edit')) {
        openUserModal(user, userType);
      } else if (btn.classList.contains('btn-view')) {
        viewUserDetails(user, userType);
      } else if (btn.classList.contains('btn-delete')) {
        deleteUser(userId, userType);
      }
    });
  });
}

function openUserModal(user = null, userType = null) {
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');

  if (user) {
    // Edit mode
    document.getElementById('modalTitle').textContent = `Edit ${userType}`;
    document.getElementById('userId').value = user.id;
    document.getElementById('userFirstName').value = user.firstName;
    document.getElementById('userLastName').value = user.lastName;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;

    if (userType === 'doctors') {
      document.getElementById('doctorSpecialty').value = user.specialty;
    }

    // Disable role change for admins
    document.getElementById('userRole').disabled = userType === 'admins';
  } else {
    // Add mode
    document.getElementById('modalTitle').textContent = 'Add New User';
    form.reset();
    document.getElementById('userRole').disabled = false;
  }

  modal.style.display = 'block';
}

function saveUser() {
  const form = document.getElementById('userForm');
  const userId = form.userId.value;
  const isEdit = !!userId;

  const userData = {
    firstName: form.userFirstName.value,
    lastName: form.userLastName.value,
    email: form.userEmail.value,
    role: form.userRole.value
  };

  if (userData.role === 'doctor') {
    userData.specialty = form.doctorSpecialty.value;
    userData.status = 'Active';
  }

  if (form.userPassword.value) {
    userData.password = form.userPassword.value;
  }

  // In a real app, this would call your API
  if (isEdit) {
    // Update existing user
    const userType = document.querySelector('.tab-btn.active').dataset.tab;
    const index = users[userType].findIndex(u => u.id == userId);
    if (index !== -1) {
      users[userType][index] = { ...users[userType][index], ...userData };
    }
  } else {
    // Add new user
    const newId = Math.max(...users[userData.role + 's'].map(u => u.id)) + 1;
    userData.id = newId;
    users[userData.role + 's'].push(userData);
  }

  // Reload data
  loadUserManagement();
  document.getElementById('userModal').style.display = 'none';
  alert(`User ${isEdit ? 'updated' : 'added'} successfully!`);
}

function viewUserDetails(user, userType) {
  alert(`Viewing ${userType} details:\n\nName: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nRole: ${user.role}\n${userType === 'doctors' ? `Specialty: ${user.specialty}\nStatus: ${user.status}` : ''}`);
}

function deleteUser(userId, userType) {
  if (confirm(`Are you sure you want to delete this ${userType}?`)) {
    users[userType] = users[userType].filter(u => u.id != userId);
    loadUserManagement();
    alert(`${userType.charAt(0).toUpperCase() + userType.slice(1)} deleted successfully`);
  }
}