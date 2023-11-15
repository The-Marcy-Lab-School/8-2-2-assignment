const path = require('path');
const ScoreCounter = require('score-tests');
const knex = require('./knex');
const {
  createDoctorsTable,
  createPatientsTable,
  createAppointmentsTable,
  addDoctor,
  addPatient,
  addAppointment,
  getDoctorAndAppointments,
  getAppointmentDatesByPatient,
  getAppointmentsAndPatientsByDoctorId,
  getPatientsByDoctorId,
} = require('./from-scratch');

const testSuiteName = 'From Scratch Tests';
const scoresDir = path.join(__dirname, '..', 'scores');
const scoreCounter = new ScoreCounter(testSuiteName, scoresDir);

describe(testSuiteName, () => {
  beforeAll(async () => { });
  beforeEach(async () => {
    scoreCounter.add(expect);
    await knex.schema.dropTableIfExists('appointments');
    await knex.schema.dropTableIfExists('doctors');
    await knex.schema.dropTableIfExists('patients');
  });

  it('createDoctorsTable - creates a doctors table', async () => {
    await createDoctorsTable();

    const emptyButExistingTable = await knex.schema.hasTable('doctors');
    expect(emptyButExistingTable).toBe(true);

    const [doctor] = await knex('doctors').insert({ title: 'Dr. Bob', specialty: 'Pediatrics' }).returning('*');
    expect(doctor.title).toBe('Dr. Bob');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('createPatientsTable - creates a doctors table', async () => {
    await createPatientsTable();

    const emptyButExistingTable = await knex.schema.hasTable('patients');
    expect(emptyButExistingTable).toBe(true);

    const [patient] = await knex('patients').insert({ name: 'Sara', age: 12 }).returning('*');
    expect(patient.name).toBe('Sara');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it("createAppointmentsTable - creates an appointments table that's linked properly to the doctors and appointments table", async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const emptyButExistingTable = await knex.schema.hasTable('appointments');
    expect(emptyButExistingTable).toBe(true);

    const [doctor] = await knex('doctors').insert({ title: 'Dr. Bob', specialty: 'Pediatrics' }).returning('*');
    const [patient] = await knex('patients').insert({ name: 'Sara', age: 12 }).returning('*');
    const [appointment] = await knex('appointments')
      .insert({ date: '2023-01-01', doctor_id: doctor.id, patient_id: patient.id })
      .returning('*');

    expect(appointment.date).toBe('2023-01-01');
    expect(appointment.doctor_id).toBe(doctor.id);
    expect(appointment.patient_id).toBe(patient.id);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  // STOP! If the above tests aren't passing NOTHING ELSE WILL!
  // Get the three table functions completed!

  it('addDoctor - adds a doctor to the doctors table', async () => {
    await createDoctorsTable();

    const [doctor] = await addDoctor('Dr. Bob', 'Pediatrics');
    expect(doctor.title).toBe('Dr. Bob');
    expect(doctor.specialty).toBe('Pediatrics');

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('addPatient - adds a patient to the patients table', async () => {
    await createPatientsTable();

    const [patient] = await addPatient('Sara', 12);
    expect(patient.name).toBe('Sara');
    expect(patient.age).toBe(12);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('addAppointment - adds an appointment to the appointments table', async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const [doctor] = await addDoctor('Dr. Bob', 'Pediatrics');
    const [patient] = await addPatient('Sara', 12);
    const [appointment] = await addAppointment('2023-01-01', doctor.id, patient.id);

    expect(appointment.date).toBe('2023-01-01');
    expect(appointment.doctor_id).toBe(doctor.id);
    expect(appointment.patient_id).toBe(patient.id);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('getDoctorAndAppointments - returns a doctor and their appointments', async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const [doctor] = await addDoctor('Dr. Bob', 'Orthopedics');
    const [patient1] = await addPatient('Sara', 42);
    const [patient2] = await addPatient('Daniel', 81);
    const [appointment1] = await addAppointment('2023-01-01', doctor.id, patient1.id);
    const [appointment2] = await addAppointment('2023-01-03', doctor.id, patient2.id);

    const doctorAndAppointments = await getDoctorAndAppointments(doctor.id);
    expect(doctorAndAppointments[0].id).toBe(doctor.id);
    expect(doctorAndAppointments[0].title).toBe(doctor.title);
    expect(doctorAndAppointments[0].specialty).toBe(doctor.specialty);
    expect(doctorAndAppointments[0].date).toBe(appointment1.date);
    expect(doctorAndAppointments[0].patient_id).toBe(patient1.id);

    expect(doctorAndAppointments[1].id).toBe(doctor.id);
    expect(doctorAndAppointments[1].title).toBe(doctor.title);
    expect(doctorAndAppointments[1].specialty).toBe(doctor.specialty);
    expect(doctorAndAppointments[1].date).toBe(appointment2.date);
    expect(doctorAndAppointments[1].patient_id).toBe(patient2.id);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('getAppointmentDatesByPatient - returns an array of appointment dates for a given patient', async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const [doctor] = await addDoctor('Dr. Bob', 'Orthopedics');
    const [patient] = await addPatient('Sara', 42);
    const [appointment1] = await addAppointment('2023-03-01', doctor.id, patient.id);
    const [appointment2] = await addAppointment('2023-09-23', doctor.id, patient.id);

    const appointmentDates = await getAppointmentDatesByPatient(patient.id);
    expect(appointmentDates[0].date).toBe(appointment1.date);
    expect(appointmentDates[1].date).toBe(appointment2.date);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('getAppointmentsAndPatientsByDoctorId - returns an array of doctors with their appointments and patients', async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const [doctor1] = await addDoctor('Dr. Bob', 'Orthopedics');
    const [doctor2] = await addDoctor('Dr. Jane', 'Optometry');
    const [patient1] = await addPatient('Itzel', 42);
    const [patient2] = await addPatient('Zo', 21);
    const [patient3] = await addPatient('Craig', 31);

    const [appointment1] = await addAppointment('2023-04-13', doctor1.id, patient1.id);
    const [appointment2] = await addAppointment('2023-5-30', doctor1.id, patient2.id);
    const [appointment3] = await addAppointment('2023-03-10', doctor2.id, patient1.id);
    const [appointment4] = await addAppointment('2023-04-17', doctor2.id, patient2.id);
    const [appointment5] = await addAppointment('2023-08-25', doctor2.id, patient3.id);

    const fullJoin1 = await getAppointmentsAndPatientsByDoctorId(doctor1.id);
    expect(fullJoin1.length).toBe(2);

    expect(fullJoin1[0].id).toBe(doctor1.id);
    expect(fullJoin1[0].title).toBe(doctor1.title);
    expect(fullJoin1[0].date).toBe(appointment1.date);
    expect(fullJoin1[0].patientId).toBe(patient1.id);
    expect(fullJoin1[0].name).toBe(patient1.name);

    expect(fullJoin1[1].id).toBe(doctor1.id);
    expect(fullJoin1[1].title).toBe(doctor1.title);
    expect(fullJoin1[1].date).toBe(appointment2.date);
    expect(fullJoin1[1].patientId).toBe(patient2.id);
    expect(fullJoin1[1].name).toBe(patient2.name);

    const fullJoin2 = await getAppointmentsAndPatientsByDoctorId(doctor2.id);
    expect(fullJoin2.length).toBe(3);

    expect(fullJoin2[0].id).toBe(doctor2.id);
    expect(fullJoin2[0].title).toBe(doctor2.title);
    expect(fullJoin2[0].date).toBe(appointment3.date);
    expect(fullJoin2[0].patientId).toBe(patient1.id);
    expect(fullJoin2[0].name).toBe(patient1.name);

    expect(fullJoin2[1].id).toBe(doctor2.id);
    expect(fullJoin2[1].title).toBe(doctor2.title);
    expect(fullJoin2[1].date).toBe(appointment4.date);
    expect(fullJoin2[1].patientId).toBe(patient2.id);
    expect(fullJoin2[1].name).toBe(patient2.name);

    expect(fullJoin2[2].id).toBe(doctor2.id);
    expect(fullJoin2[2].title).toBe(doctor2.title);
    expect(fullJoin2[2].date).toBe(appointment5.date);
    expect(fullJoin2[2].patientId).toBe(patient3.id);
    expect(fullJoin2[2].name).toBe(patient3.name);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });

  it('getPatientsByDoctorId - returns an array of patients for a given doctor', async () => {
    await createDoctorsTable();
    await createPatientsTable();
    await createAppointmentsTable();

    const [doctor1] = await addDoctor('Dr. Bob', 'Orthopedics');
    const [doctor2] = await addDoctor('Dr. Jane', 'Optometry');
    const [patient1] = await addPatient('Itzel', 42);
    const [patient2] = await addPatient('Zo', 21);
    const [patient3] = await addPatient('Craig', 31);

    await addAppointment('2023-03-01', doctor1.id, patient1.id);
    await addAppointment('2023-09-23', doctor1.id, patient3.id);
    await addAppointment('2023-09-23', doctor2.id, patient2.id);

    const doctor1Patients = await getPatientsByDoctorId(doctor1.id);
    expect(doctor1Patients.length).toBe(2);
    expect(doctor1Patients[0].id).toBe(patient1.id);
    expect(doctor1Patients[0].name).toBe(patient1.name);
    expect(doctor1Patients[0].age).toBe(patient1.age);
    expect(doctor1Patients[1].id).toBe(patient3.id);
    expect(doctor1Patients[1].name).toBe(patient3.name);
    expect(doctor1Patients[1].age).toBe(patient3.age);

    const doctor2Patients = await getPatientsByDoctorId(doctor2.id);
    expect(doctor2Patients.length).toBe(1);
    expect(doctor2Patients[0].id).toBe(patient2.id);
    expect(doctor2Patients[0].name).toBe(patient2.name);
    expect(doctor2Patients[0].age).toBe(patient2.age);

    scoreCounter.correct(expect); // DO NOT TOUCH
  });


  afterAll(async () => {
    scoreCounter.export();

    await knex.schema.dropTableIfExists('appointments');
    await knex.schema.dropTableIfExists('doctors');
    await knex.schema.dropTableIfExists('patients');

    await knex.destroy();
  });
});
