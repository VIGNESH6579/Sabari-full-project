// Patient Dashboard Functions
const doctors = [
  { id: 1, name: "Dr. Smith", specialty: "General Physician", available: ["fever", "headache", "cold"], image: "assets/doctor1.jpg" },
  { id: 2, name: "Dr. Johnson", specialty: "ENT Specialist", available: ["ent", "cold"], image: "assets/doctor2.jpg" },
  { id: 3, name: "Dr. Williams", specialty: "Orthopedic", available: ["injury"], image: "assets/doctor3.jpg" },
  { id: 4, name: "Dr. Brown", specialty: "Gynecologist", available: ["womens-health"], image: "assets/doctor4.jpg" },
  { id: 5, name: "Dr. Davis", specialty: "Neurologist", available: ["headache"], image: "assets/doctor5.jpg" }
];

let appointments = [
  { id: 1, doctorId: 1, doctorName: "Dr. Smith", date: "2025-04-05", time: "10:00 AM", reason: "Fever consultation", status: "Confirmed" },
  { id: 2, doctorId: 3, doctorName: "Dr. Williams", date: "2025-04-10", time: "2:30 PM", reason: "Knee injury follow-up", status: "Pending" }
];

document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!checkAuth('patient')) return;

  // Set patient name
  document.getElementById('patientName').textContent = localStorage.getItem('userName') || 'Patient';

  // Load doctors by specialty
  loadDoctorsBySpecialty('all');

  // Load appointments
  loadAppointments();

  // Set up specialty buttons
  setupSpecialtyButtons();

  // Set up modal
  setupAppointmentModal();
});

function setupSpecialtyButtons() {
  const buttons = document.querySelectorAll('.specialty-btn');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadDoctorsBySpecialty(button.dataset.specialty);
    });
  });
}

function loadDoctorsBySpecialty(specialty) {
  const container = document.getElementById('availableDoctors');
  let filteredDoctors = doctors;

  if (specialty !== 'all') {
    filteredDoctors = doctors.filter(doctor =>
      doctor.available.includes(specialty)
    );
  }

  container.innerHTML = filteredDoctors.map(doctor => `
    <div class="doctor-card">
      <div class="doctor-header">
        <img src="${doctor.image}" alt="${doctor.name}">
        <div>
          <h4>${doctor.name}</h4>
          <p>${doctor.specialty}</p>
        </div>
      </div>
      <button class="btn-sm btn-appointment" data-doctor-id="${doctor.id}">Book Appointment</button>
    </div>
  `).join('');

  // Add event listeners for booking appointments
  addAppointmentEventListeners();
}

function addAppointmentEventListeners() {
  const buttons = document.querySelectorAll('.btn-appointment');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const doctorId = button.dataset.doctorId;
      const doctor = doctors.find(doc => doc.id == doctorId);
      openAppointmentModal(doctor);
    });
  });
}

function loadAppointments() {
  const container = document.getElementById('appointmentList');

  if (appointments.length > 0) {
    container.innerHTML = appointments.map(appt => `
      <div class="appointment-item ${appt.status.toLowerCase()}">
        <div class="appt-header">
          <span class="appt-time">${appt.time}</span>
          <span class="appt-status ${appt.status.toLowerCase()}">${appt.status}</span>
        </div>
        <div class="appt-doctor">${appt.doctorName}</div>
        <div class="appt-reason">${appt.reason}</div>
      </div>
    `).join('');
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-day"></i>
        <p>No upcoming appointments</p>
      </div>
    `;
  }
}

function openAppointmentModal(doctor) {
  const modal = document.getElementById('appointmentModal');
  document.getElementById('modalDoctorName').textContent = doctor.name;
  document.getElementById('modalDoctorSpecialty').textContent = doctor.specialty;

  // Show modal
  modal.style.display = 'block';

  // Close modal event
  document.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Book appointment event
  document.getElementById('bookAppointmentBtn').addEventListener('click', () => {
    const date = document.getElementById('appointmentDate').value;
    const time = document.getElementById('appointmentTime').value;
    const reason = document.getElementById('appointmentReason').value;

    if (date && time && reason) {
      const newAppointment = {
        id: appointments.length + 1,
        doctorId: doctor.id,
        doctorName: doctor.name,
        date: date,
        time: time,
        reason: reason,
        status: 'Pending'
      };

      appointments.push(newAppointment);
      loadAppointments();
      modal.style.display = 'none';
      alert('Appointment booked successfully!');
    } else {
      alert('Please fill in all fields');
    }
  });
}