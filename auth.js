// Authentication and authorization functions
const users = {
  patient: [
    { email: 'patient@example.com', password: 'patient123', name: 'John Doe' }
  ],
  doctor: [
    { email: 'doctor@example.com', password: 'doctor123', name: 'Dr. Smith' }
  ],
  admin: [
    { email: 'admin@example.com', password: 'admin123', name: 'Admin User' }
  ]
};

function login(email, password, role, redirectPage) {
  // Find user in simulated database
  const user = users[role].find(u => u.email === email && u.password === password);

  if (user) {
    // Store user data in localStorage
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', user.name);

    // Redirect to dashboard
    window.location.href = redirectPage;
  } else {
    alert('Invalid credentials! Please try again.');
  }
}

function logout() {
  // Clear authentication data
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');

  // Redirect to home page
  window.location.href = 'index.html';
}

function checkAuth(requiredRole) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated || userRole !== requiredRole) {
    // Redirect to login page if not authenticated
    window.location.href = `${requiredRole}-login.html`;
    return false;
  }
  return true;
}

// Initialize logout buttons on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add logout functionality
  const logoutButtons = document.querySelectorAll('.logout-btn');
  logoutButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  });

  // Set user name in dashboards
  const userNameElements = document.querySelectorAll('#patientName, #doctorName, #adminName');
  if (userNameElements.length > 0) {
    const name = localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
    userNameElements.forEach(el => {
      el.textContent = name;
    });
  }
});