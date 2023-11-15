const knex = require('./knex');

// Do these three first!
const createDoctorsTable = async () => {
  const query = ``;

  return knex.raw(query);
};

const createPatientsTable = async () => {
  const query = ``;

  return knex.raw(query);
};

const createAppointmentsTable = async () => {
  const query = ``;

  return knex.raw(query);
};

// Then these three!
const addDoctor = async (title, specialty) => {
  const query = ``;

  const { rows } = await knex.raw(query, [title, specialty]);
  // console.log(rows); // For debugging purposes
  return rows;
};

const addPatient = async (name, age) => {
  const query = ``;

  const { rows } = await knex.raw(query, [name, age]);
  // console.log(rows); // For debugging purposes
  return rows;
};

const addAppointment = async (date, doctorId, patientId) => {
  const query = ``;

  const { rows } = await knex.raw(query, [date, doctorId, patientId]);
  // console.log(rows); // For debugging purposes
  return rows;
};

// Here's where we start doing some joins (or not in some cases)!
// Remember, you'll still need to pass in the appropriate arguments to the query like you did above,
// we just want to see you do it on your own
const getDoctorAndAppointments = async () => {
  const query = ``;

  const { rows } = await knex.raw(query, []);
  // console.log(rows); // For debugging purposes
  return rows;
};

const getAppointmentDatesByPatient = async () => {
  const query = ``;

  const { rows } = await knex.raw(query, []);
  // console.log(rows); // For debugging purposes
  return rows;
};

const getAppointmentsAndPatientsByDoctorId = async () => {
  const query = ``;

  const { rows } = await knex.raw(query, []);
  // console.log(rows); // For debugging purposes
  return rows;
};

const getPatientsByDoctorId = async () => {
  const query = ``;

  const { rows } = await knex.raw(query, []);
  // console.log(rows); // For debugging purposes
  return rows;
};

module.exports = {
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
};
