const  {
  createDoctorsTable,
  createPatientsTable,
  createAppointmentsTable,

  addDoctor,
  addPatient,
  addAppointment,

  getDoctorAndAppointments,
  getAppointmentDatesByPatient,
  getPatientsByDoctorId,
  getAppointmentsAndPatientsByDoctorId,
} = require('./from-scratch');

const main = async () => {
  // Careful not to run the table creators more than once!
  // Also, they'll get wiped with each test run.
};

main();
