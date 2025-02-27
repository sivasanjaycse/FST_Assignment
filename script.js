// Sample user data and courses
const users = [
  { 
    username: 'student1', 
    password: 'pass123', 
    name: 'John Doe',
    enrolledCourses: ['HTML and CSS Basics', 'JavaScript for Beginners'],
    totalHours: 24,
    completedCourses: ['HTML and CSS Basics']
  },
  { 
    username: 'student2', 
    password: 'pass456', 
    name: 'Jane Smith',
    enrolledCourses: ['Advanced Web Development'],
    totalHours: 12,
    completedCourses: []
  }
];

const courses = [
  { 
    id: 1, 
    name: 'HTML and CSS Basics',
    description: 'Learn the fundamentals of web development',
    duration: '8 hours',
    progress: 100
  },
  { 
    id: 2, 
    name: 'JavaScript for Beginners',
    description: 'Master the basics of JavaScript programming',
    duration: '12 hours',
    progress: 60
  },
  { 
    id: 3, 
    name: 'Advanced Web Development',
    description: 'Advanced concepts in modern web development',
    duration: '16 hours',
    progress: 0
  }
];

// DOM Elements
const loginPage = document.getElementById('login-page');
const dashboardPage = document.getElementById('dashboard-page');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const userNameDisplay = document.getElementById('user-name');
const courseList = document.getElementById('course-list');
const attendanceList = document.getElementById('attendance-list');
const certificateList = document.getElementById('certificate-list');
const logoutButton = document.getElementById('logout-btn');

let currentUser = null;

// Handle login form submission
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();
  
  const username = usernameInput.value;
  const password = passwordInput.value;

  // Check if the user exists
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    currentUser = user;
    // Hide login page, show dashboard
    loginPage.style.display = 'none';
    dashboardPage.style.display = 'block';
    userNameDisplay.textContent = user.name;

    // Update dashboard
    updateDashboard();
  } else {
    showNotification('Invalid username or password', 'error');
  }
});

// Update dashboard with user data
function updateDashboard() {
  // Populate course list
  populateCourses();

  // Set initial attendance
  populateAttendance();

  // Set up certificate tracking
  populateCertificates();

  // Update stats
  updateStats();
}

// Populate courses with new card design
function populateCourses() {
  courseList.innerHTML = '';
  courses.forEach(course => {
    const isEnrolled = currentUser.enrolledCourses.includes(course.name);
    const isCompleted = currentUser.completedCourses.includes(course.name);
    
    const courseCard = document.createElement('div');
    courseCard.className = 'course-card fade-in';
    courseCard.innerHTML = `
      <h4>${course.name}</h4>
      <p>${course.description}</p>
      <p><i class="fas fa-clock"></i> ${course.duration}</p>
      ${isEnrolled ? `
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
        </div>
        <p>${course.progress}% Complete</p>
        ${isCompleted ? 
          '<span class="badge badge-primary"><i class="fas fa-check"></i> Completed</span>' :
          `<button class="btn-primary" onclick="startCourse('${course.name}')">Continue</button>`
        }` :
        `<button onclick="enrollCourse('${course.name}')" class="btn-primary">
          <i class="fas fa-plus"></i> Enroll
        </button>`
      }
    `;
    courseList.appendChild(courseCard);
  });
}

// Update dashboard stats
function updateStats() {
  const statsNumbers = document.querySelectorAll('.stat-number');
  statsNumbers[0].textContent = currentUser.enrolledCourses.length;
  statsNumbers[1].textContent = currentUser.totalHours;
  statsNumbers[2].textContent = currentUser.completedCourses.length;
}

// Enroll in a course
function enrollCourse(courseName) {
  if (!currentUser.enrolledCourses.includes(courseName)) {
    currentUser.enrolledCourses.push(courseName);
    showNotification(`Successfully enrolled in: ${courseName}`, 'success');
    updateDashboard();
  }
}

// Start or continue a course
function startCourse(courseName) {
  showNotification(`Loading course: ${courseName}`, 'info');
}

// Populate attendance with improved design
function populateAttendance() {
  attendanceList.innerHTML = '';
  currentUser.enrolledCourses.forEach(course => {
    const listItem = document.createElement('li');
    listItem.className = 'fade-in';
    listItem.innerHTML = `
      <div class="attendance-item">
        <i class="fas fa-check-circle"></i>
        <span>${course}</span>
        <span class="badge badge-primary">Present</span>
      </div>
    `;
    attendanceList.appendChild(listItem);
  });
}

// Populate certificates with improved design
function populateCertificates() {
  certificateList.innerHTML = '';
  currentUser.completedCourses.forEach(course => {
    
    const listItem = document.createElement('li');
    listItem.className = 'fade-in';
    listItem.innerHTML = `
      <div class="certificate-item">
        <i class="fas fa-certificate"></i>
        <span>${course} Certificate</span>
        <button class="btn-primary" onclick="downloadCertificate('${course}')">
          <i class="fas fa-download"></i> Download
        </button>
      </div>
    `;
    certificateList.appendChild(listItem);
  });
}

// Download certificate (simulated)
function downloadCertificate(courseName) {
  showNotification(`Downloading certificate for: ${courseName}`, 'info');
}

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

// Handle logout
logoutButton.addEventListener('click', function() {
  // Clear form inputs
  loginForm.reset();
  
  // Reset current user
  currentUser = null;
  
  // Hide dashboard, show login page
  dashboardPage.style.display = 'none';
  loginPage.style.display = 'block';
  
  // Clear all lists
  courseList.innerHTML = '';
  attendanceList.innerHTML = '';
  certificateList.innerHTML = '';
  
  showNotification('Successfully logged out', 'info');
});
  