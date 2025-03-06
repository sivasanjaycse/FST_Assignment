document.addEventListener('DOMContentLoaded', () => {
    //nav-bar
    const navLinks = document.querySelectorAll('.nav-links a');
    const pages = document.querySelectorAll('.dashboard-page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!link.id || link.id !== 'logout-btn') {
                e.preventDefault();
            }
            navLinks.forEach(l => l.classList.remove('active'));
            pages.forEach(p => p.classList.remove('active'));
            link.classList.add('active');
            const targetId = link.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });

    const eventButtons = document.querySelectorAll('[data-event]');
    eventButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const eventName = button.getAttribute('data-event');
            joinEvent(eventName, button);
        });
    });

    function joinEvent(eventName, button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-check"></i> Joined';
        button.classList.add('joined');
        showNotification('Successfully joined ' + eventName, 'success');
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            ${message}
        `;        
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    populateCourseList();
    populateAttendanceList();
    populateCertificateList();
    function populateCourseList() {
        const courseList = document.getElementById('course-list');
        const courses = [
            {
                title: 'Web Development Fundamentals',
                progress: 75,
                instructor: 'Dr. Smith',
                duration: '8 weeks'
            },
            {
                title: 'JavaScript Advanced Concepts',
                progress: 45,
                instructor: 'Prof. Johnson',
                duration: '10 weeks'
            },
            {
                title: 'Database Management',
                progress: 90,
                instructor: 'Dr. Williams',
                duration: '6 weeks'
            }
        ];

        courseList.innerHTML = courses.map(course => `
            <div class="course-card" onclick="window.location.href='course-content.html?course=${encodeURIComponent(course.title)}'">
                <h4>${course.title}</h4>
                <p><i class="fas fa-user"></i> ${course.instructor}</p>
                <p><i class="fas fa-clock"></i> ${course.duration}</p>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: ${course.progress}%"></div>
                </div>
                <p class="progress-text">${course.progress}% Complete</p>
            </div>
        `).join('');
    }

    function populateAttendanceList() {
        const attendanceList = document.getElementById('attendance-list');
        const attendance = [
            { course: 'Web Development', date: '2024-01-15', status: 'Present' },
            { course: 'JavaScript', date: '2024-01-14', status: 'Present' },
            { course: 'Database', date: '2024-01-13', status: 'Absent' }
        ];

        attendanceList.innerHTML = attendance.map(record => `
            <li class="attendance-item">
                <i class="fas ${record.status === 'Present' ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                <div>
                    <h4>${record.course}</h4>
                    <p>${record.date}</p>
                </div>
                <span class="badge badge-primary">${record.status}</span>
            </li>
        `).join('');
    }

    window.generateCertificatePDF = function(courseName) {
        const userName = document.querySelector('.profile-header h2').textContent;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(40);
        doc.setTextColor(124, 77, 255); 
        doc.text('Certificate of Completion', 150, 50, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.setDrawColor(124, 77, 255);
        doc.line(50, 60, 250, 60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text('This is to certify that', 150, 85, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(32);
        doc.text(userName, 150, 105, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(24);
        doc.text('has successfully completed the course', 150, 125, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text(courseName, 150, 145, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        doc.text(`Issued on ${currentDate}`, 150, 170, { align: 'center' });
        doc.save(`${courseName.replace(/\s+/g, '_')}_Certificate.pdf`);
        showNotification('Certificate generated successfully!', 'success');
    }

    function populateCertificateList() {
        const certificateList = document.getElementById('certificate-list');
        const certificates = [
            { course: 'Web Development Fundamentals', date: '2024-01-10', id: 'CERT001' },
            { course: 'JavaScript Basics', date: '2023-12-15', id: 'CERT002' }
        ];

        certificateList.innerHTML = certificates.map(cert => `
            <li class="certificate-item">
                <i class="fas fa-certificate"></i>
                <div>
                    <h4>${cert.course}</h4>
                    <p>Issued: ${cert.date}</p>
                    <p>Certificate ID: ${cert.id}</p>
                </div>
                <button class="btn-primary" onclick="generateCertificatePDF('${cert.course}')"> Download
                </button>
            </li>
        `).join('');
    }
});