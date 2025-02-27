// Sample user data
const users = [
  { 
    username: 'admin', 
    password: 'admin', 
    name: 'ADMIN',
    enrolledCourses: ['HTML and CSS Basics', 'JavaScript for Beginners'],
    totalHours: 24,
    completedCourses: ['HTML and CSS Basics']
  },
  { 
    username: 'siva', 
    password: 'siva', 
    name: 'SIVA SANJAY',
    enrolledCourses: ['Advanced Web Development'],
    totalHours: 12,
    completedCourses: []
  }
];

// DOM Elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

// Handle login form submission
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Check if the user exists
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Store user data in sessionStorage
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    
    // Show success notification
    showNotification('Login successful! Redirecting...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);
  } else {
    showNotification('Invalid username or password', 'error');
  }
});

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type} fade-in`;
  notification.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
} 