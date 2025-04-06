// Doctor Dashboard Data
let appointments = [
  {
    id: 1,
    patientId: 101,
    patientName: "John Doe",
    date: new Date().toISOString().split('T')[0],
    time: "10:00 AM",
    reason: "Annual Checkup",
    status: "Pending",
    notes: ""
  },
  {
    id: 2,
    patientId: 102,
    patientName: "Jane Smith",
    date: new Date().toISOString().split('T')[0],
    time: "11:30 AM",
    reason: "Follow-up Visit",
    status: "Confirmed",
    notes: "Patient needs blood test results"
  },
  {
    id: 3,
    patientId: 103,
    patientName: "Robert Johnson",
    date: new Date().toISOString().split('T')[0],
    time: "2:15 PM",
    reason: "New Patient Consultation",
    status: "Pending",
    notes: ""
  }
];

let patients = [
  {
    id: 101,
    name: "John Doe",
    lastVisit: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
    nextAppointment: "Today at 10:00 AM",
    medicalHistory: "Hypertension, Allergic rhinitis"
  },
  {
    id: 102,
    name: "Jane Smith",
    lastVisit: new Date(Date.now() - 86400000 * 14).toLocaleDateString(),
    nextAppointment: "Today at 11:30 AM",
    medicalHistory: "Type 2 Diabetes"
  },
  {
    id: 103,
    name: "Robert Johnson",
    lastVisit: "First Visit",
    nextAppointment: "Today at 2:15 PM",
    medicalHistory: "None"
  }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check authentication
  if (!checkAuth('doctor')) return;

  // Set doctor name
  document.getElementById('doctorName').textContent = localStorage.getItem('userName') || 'Doctor';

  // Load dashboard data
  loadDoctorData();

  // Initialize modal
  initModal();
});

function loadDoctorData() {
  // Load appointments
  loadAppointments();

  // Load patients
  loadPatients();
}

function loadAppointments() {
  const container = document.getElementById('doctorAppointments');
  if (!container) return;

  // Filter today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(appt => appt.date === today);

  if (todayAppointments.length > 0) {
    container.innerHTML = todayAppointments.map(appt => `
      <div class="appointment-item ${appt.status.toLowerCase()}">
        <div class="appt-header">
          <span class="appt-time">${appt.time}</span>
          <span class="appt-status ${appt.status.toLowerCase()}">${appt.status}</span>
        </div>
        <div class="appt-patient">${appt.patientName}</div>
        <div class="appt-reason">${appt.reason}</div>
        <div class="appt-actions">
          ${appt.status === 'Pending' ? `
            <button class="btn-sm btn-confirm" data-appointment-id="${appt.id}">
              <i class="fas fa-check"></i> Confirm
            </button>
            <button class="btn-sm btn-reject" data-appointment-id="${appt.id}">
              <i class="fas fa-times"></i> Reject
            </button>
          ` : ''}
          <button class="btn-sm btn-view" data-appointment-id="${appt.id}">
            <i class="fas fa-eye"></i> Details
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    addAppointmentEventListeners();
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-calendar-day"></i>
        <p>No appointments scheduled for today</p>
      </div>
    `;
  }
}

function loadPatients() {
  const container = document.getElementById('patientList');
  if (!container) return;

  if (patients.length > 0) {
    container.innerHTML = patients.map(patient => `
      <div class="patient-item">
        <div class="patient-name">${patient.name}</div>
        <div class="patient-meta">
          <span>Last Visit: ${patient.lastVisit}</span>
          <span>Next: ${patient.nextAppointment}</span>
        </div>
        <div class="patient-actions">
          <button class="btn-sm btn-view" data-patient-id="${patient.id}">
            <i class="fas fa-eye"></i> View
          </button>
          <button class="btn-sm btn-message" data-patient-id="${patient.id}">
            <i class="fas fa-envelope"></i> Message
          </button>
        </div>
      </div>
    `).join('');

    // Add event listeners
    addPatientEventListeners();
  } else {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-user"></i>
        <p>No patients found</p>
      </div>
    `;
  }
}

function addAppointmentEventListeners() {
  const confirmButtons = document.querySelectorAll('.btn-confirm');
  confirmButtons.forEach(button => {
    button.addEventListener('click', () => {
      const appointmentId = button.dataset.appointmentId;
      updateAppointmentStatus(appointmentId, 'Confirmed');
    });
  });

  const rejectButtons = document.querySelectorAll('.btn-reject');
  rejectButtons.forEach(button => {
    button.addEventListener('click', () => {
      const appointmentId = button.dataset.appointmentId;
      updateAppointmentStatus(appointmentId, 'Rejected');
    });
  });

  const viewButtons = document.querySelectorAll('.btn-view');
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const appointmentId = button.dataset.appointmentId;
      openAppointmentModal(appointmentId);
    });
  });
}

function addPatientEventListeners() {
  const viewButtons = document.querySelectorAll('.btn-view');
  viewButtons.forEach(button => {
    button.addEventListener('click', () => {
      const patientId = button.dataset.patientId;
      openPatientModal(patientId);
    });
  });

  const messageButtons = document.querySelectorAll('.btn-message');
  messageButtons.forEach(button => {
    button.addEventListener('click', () => {
      const patientId = button.dataset.patientId;
      sendMessageToPatient(patientId);
    });
  });
}

function updateAppointmentStatus(appointmentId, status) {
  const appointment = appointments.find(appt => appt.id == appointmentId);
  if (appointment) {
    appointment.status = status;
    loadAppointments();
    alert(`Appointment ${status.toLowerCase()} successfully!`);
  } else {
    alert('Appointment not found');
  }
}

function openAppointmentModal(appointmentId) {
  const appointment = appointments.find(appt => appt.id == appointmentId);
  if (!appointment) {
    alert('Appointment not found');
    return;
  }

  const modal = document.getElementById('appointmentModal');
  document.getElementById('modalPatientName').textContent = appointment.patientName;
  document.getElementById('modalAppointmentDate').textContent = appointment.date;
  document.getElementById('modalAppointmentTime').textContent = appointment.time;
  document.getElementById('modalAppointmentReason').textContent = appointment.reason;
  document.getElementById('modalAppointmentStatus').textContent = appointment.status;
  document.getElementById('modalAppointmentNotes').value = appointment.notes;

  modal.style.display = 'block';

  document.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.getElementById('saveNotesBtn').addEventListener('click', () => {
    appointment.notes = document.getElementById('modalAppointmentNotes').value;
    modal.style.display = 'none';
    alert('Notes saved successfully!');
  });
}

function openPatientModal(patientId) {
  const patient = patients.find(p => p.id == patientId);
  if (!patient) {
    alert('Patient not found');
    return;
  }

  const modal = document.getElementById('patientModal');
  document.getElementById('modalPatientName').textContent = patient.name;
  document.getElementById('modalPatientLastVisit').textContent = patient.lastVisit;
  document.getElementById('modalPatientNextAppointment').textContent = patient.nextAppointment;
  document.getElementById('modalPatientMedicalHistory').textContent = patient.medicalHistory;

  modal.style.display = 'block';

  document.querySelector('.close-btn').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

function sendMessageToPatient(patientId) {
  const patient = patients.find(p => p.id == patientId);
  if (!patient) {
    alert('Patient not found');
    return;
  }

  const message = prompt(`Send a message to ${patient.name}:`);
  if (message) {
    alert(`Message sent to ${patient.name}: ${message}`);
  }
}

function initModal() {
  const modal = document.querySelectorAll('.modal');
  modal.forEach(m => {
    m.querySelector('.close-btn').addEventListener('click', () => {
      m.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === m) {
        m.style.display = 'none';
      }
    });
  });
}