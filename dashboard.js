// Course data
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
const userNameDisplay = document.getElementById('user-name');
const courseList = document.getElementById('course-list');
const attendanceList = document.getElementById('attendance-list');
const certificateList = document.getElementById('certificate-list');
const logoutButton = document.getElementById('logout-btn');

// Get current user from sessionStorage
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

// Check if user is logged in
if (!currentUser) {
  window.location.href = 'index.html';
} else {
  // Initialize dashboard
  initializeDashboard();
}

// Initialize dashboard
function initializeDashboard() {
  userNameDisplay.textContent = currentUser.name;
  updateDashboard();
  initializeJoinedEvents();
}

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
    // Update session storage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification(`Successfully enrolled in: ${courseName}`, 'success');
    updateDashboard();
  }
}

// Start or continue a course
function startCourse(courseName) {
  showNotification(`Loading course: ${courseName}`, 'info');
  // Redirect to course content page
  setTimeout(() => {
    window.location.href = 'course-content.html';
  }, 1500);
}

// Join event
function joinEvent(eventName) {
  const eventButton = document.querySelector(`button[data-event="${eventName}"]`);
  if (eventButton && !eventButton.disabled) {
    // Store joined events in session storage
    let joinedEvents = JSON.parse(sessionStorage.getItem('joinedEvents') || '[]');
    if (!joinedEvents.includes(eventName)) {
      joinedEvents.push(eventName);
      sessionStorage.setItem('joinedEvents', JSON.stringify(joinedEvents));
      
      // Update button appearance
      eventButton.innerHTML = '<i class="fas fa-check"></i> Joined';
      eventButton.className = 'btn-primary joined';
      eventButton.disabled = true;
      
      // Show success notification
      showNotification(`Successfully joined: ${eventName}`, 'success');
    }
  }
}

// Initialize joined events on page load
function initializeJoinedEvents() {
  const joinedEvents = JSON.parse(sessionStorage.getItem('joinedEvents') || '[]');
  joinedEvents.forEach(eventName => {
    const eventButton = document.querySelector(`button[data-event="${eventName}"]`);
    if (eventButton) {
      eventButton.innerHTML = '<i class="fas fa-check"></i> Joined';
      eventButton.className = 'btn-primary joined';
      eventButton.disabled = true;
    }
  });
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

// Download certificate
function downloadCertificate(courseName) {
  // Create a sample certificate content
  const certificateContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${courseName} Certificate</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px; }
        .certificate { 
          text-align: center; 
          padding: 40px; 
          border: 2px solid #1a73e8; 
          margin: 20px;
          background: linear-gradient(rgba(26, 115, 232, 0.1), rgba(66, 133, 244, 0.1));
        }
        h1 { color: #1a73e8; }
        h2 { color: #0d47a1; }
        h3 { color: #1a73e8; }
        .date { margin-top: 40px; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <h1>Certificate of Completion</h1>
        <p style="font-size: 18px;">This is to certify that</p>
        <h2>${currentUser.name}</h2>
        <p style="font-size: 18px;">has successfully completed the course</p>
        <h3>${courseName}</h3>
        <p class="date">Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `;

  // Create a Blob containing the certificate HTML
  const blob = new Blob([certificateContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseName.replace(/\s+/g, '_')}_Certificate.html`;
  document.body.appendChild(a);
  a.click();
  
  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  showNotification(`Downloading certificate for: ${courseName}`, 'success');
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
  // Clear session storage
  sessionStorage.removeItem('currentUser');
  
  // Show notification
  showNotification('Successfully logged out', 'info');
  
  // Redirect to login page
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}); 