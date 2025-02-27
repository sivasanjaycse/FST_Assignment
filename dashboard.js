// course data
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

const userNameDisplay = document.getElementById('user-name');
const courseList = document.getElementById('course-list');
const attendanceList = document.getElementById('attendance-list');
const certificateList = document.getElementById('certificate-list');
const logoutButton = document.getElementById('logout-btn');

// get current use detais
let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

if (!currentUser) {
  window.location.href = 'index.html';
} else {
  initializeDashboard();
}

function initializeDashboard() {
  userNameDisplay.textContent = currentUser.name;
  updateDashboard();
  initializeJoinedEvents();
}

function updateDashboard() {
  populateCourses();
  populateAttendance();
  populateCertificates();
  updateStats();
}

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
function updateStats() {
  const statsNumbers = document.querySelectorAll('.stat-number');
  statsNumbers[0].textContent = currentUser.enrolledCourses.length;
  statsNumbers[1].textContent = currentUser.totalHours;
  statsNumbers[2].textContent = currentUser.completedCourses.length;
}


function enrollCourse(courseName) {
  if (!currentUser.enrolledCourses.includes(courseName)) {
    currentUser.enrolledCourses.push(courseName);
    // Update session storage
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    showNotification(`Successfully enrolled in: ${courseName}`, 'success');
    updateDashboard();
  }
}


function startCourse(courseName) {
  showNotification(`Loading course: ${courseName}`, 'info');
  setTimeout(() => {
    window.location.href = 'course-content.html';
  }, 1500);
}


function joinEvent(eventName) {
  const eventButton = document.querySelector(`button[data-event="${eventName}"]`);
  if (eventButton && !eventButton.disabled) {
    let joinedEvents = JSON.parse(sessionStorage.getItem('joinedEvents') || '[]');
    if (!joinedEvents.includes(eventName)) {
      joinedEvents.push(eventName);
      sessionStorage.setItem('joinedEvents', JSON.stringify(joinedEvents));
      eventButton.innerHTML = '<i class="fas fa-check"></i> Joined';
      eventButton.className = 'btn-primary joined';
      eventButton.disabled = true;
      showNotification(`Successfully joined: ${eventName}`, 'success');
    }
  }
}
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
function downloadCertificate(courseName) {
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
  const blob = new Blob([certificateContent], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseName.replace(/\s+/g, '_')}_Certificate.html`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  
  showNotification(`Downloading certificate for: ${courseName}`, 'success');
}
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type} fade-in`;
  notification.innerHTML = `<p>${message}</p>`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
logoutButton.addEventListener('click', function() {
  sessionStorage.removeItem('currentUser');
  showNotification('Successfully logged out', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}); 