# Relationships and Joins
- [6.0.2 Assignment: Relationships and joins!](#602-assignment-relationships-and-joins)
- [Before Getting started](#before-getting-started)
  - [Knex](#knex)
- [Part 1: The tables](#part-1-the-tables)
  - [Question 1: createDoctorsTable](#question-1-createdoctorstable)
  - [Question 2: createPatientsTable](#question-2-createpatientstable)
  - [Question 3: createAppointmentsTable](#question-3-createappointmentstable)
- [Part 2: The data](#part-2-the-data)
  - [Question 4: addDoctor](#question-4-adddoctor)
  - [Question 5: addPatient](#question-5-addpatient)
  - [Question 6: addAppointment](#question-6-addappointment)
- [Part 3: The Joins!](#part-3-the-joins)
  - [Question 7: getDoctorAndAppointments](#question-7-getdoctorandappointments)
  - [Question 8: getAppointmentDatesByPatient](#question-8-getappointmentdatesbypatient)
  - [Question 9: getAppointmentsAndPatientsByDoctorId](#question-9-getappointmentsandpatientsbydoctorid)
  - [Question 10: getPatientsByDoctorId](#question-10-getpatientsbydoctorid)

# Before Getting started
We'll be practicing our joins today with doctors, patients, and the appointments that link them! This assignment is about teaching you to write these joins yourself, it's not trying to do anything complex. We're just making sure you're aware of the syntax. It's up to you to push yourself on your own to go further!

Remember, a parent has many children, and each child belongs to an adult. So a doctor has many appointments, and each appointment belongs to a doctor. A patient also has many appointments and each appointment belongs to a patient.

Ok? that's the start, now carry it through. So according to that, then a doctor has many patients *through* appointments, and it's also true that each patient can have many doctors *through* appointments as well. The appointments table is the child, and it links the two parents together.

Now what important is that doctors and patients don't know a thing about each other. The only thing linking them together are the rows on the appointments table. And how does the appointments table do that? By storing the "foreign keys" on it.

This is all just a review, and if it doesn't quite click, please spend some time with AI or Google so you understand the concepts. Remember, always understand the core ideas before jumping into code!

## Knex
So we're using knex again to allow our JS files to talk to our database like we always do! Just like last time, we need you to make a copy of `.env.template` as `.env` and fill it with the values you need!

```env
PG_HOST=127.0.0.1
PG_PORT=5432
PG_USER='postgres'
PG_PASSWORD='postgres'
PG_DATABASE='postgres'
```
 Make sure your `.env` file is in the root of your project (same level as you `package.json`). Also, the database doesn't matter, we aren't using migrations or DB dumps. I've left everything to the default `postgres`.

# Part 1: The tables
Before we get to our join statements, we need to create some tables! This is important as we need to make sure our tables are set up properly. Now, the tests will use the first 3 functions to setup all the rest, so make sure you nail your table setup before moving on.

Also, the tests will wipe whatever tables you create, so don't worry about cleaning up after yourself, but do be aware any data you added in the postgres terminal will be lost.


## Question 1: createDoctorsTable
Make a SQL query that creates a table `doctors`, with an `id`, `title`, and `specialty` column. The `id` column should be a primary key, and the `title` and `specialty` columns should be text.

## Question 2: createPatientsTable
Make a SQL query that creates a table `patients`, with an `id`, `name`, and `age` column. The `id` column should be a primary key, the `name` is text and the `age` columns should be an integer.

## Question 3: createAppointmentsTable
Ok, this is where it gets tricky. Our `appointments` table is the "join" table that links doctors to patients? It need to have `data` column (that's just text to keep things simple) and an `id` primary key column of it's own.

But in order to link it to the other two with official foreign keys, you need to do something like this:

```sql
some_table_id INTEGER REFERENCES some_table
some_other_table_id INTEGER REFERENCES some_other_table
```

There are many ways to link tables, but this is a pretty simple way to start that works as long as the other tables have a proper primary key `id` column.

So apply that to your tables and you should be all set!

# Part 2: The data
Ok, with our tables set up properly, now we need to add some data to them! Remember, when using `knex.raw` we have to interpolate arguments to add data. Check this template and apply it to your code:

```js
const query = `INSERT INTO cats (name, age) VALUES (?, ?)`;
knex.raw(query, ['Tom', 12]);
// that would create the sql query:
// INSERT INTO cats (name, age) VALUES ('Tom', 12)
```

Remember, the order of inserted values matters! So make sure you're putting them in the right order for the `?` placeholders to make sense.


## Question 4: addDoctor
Make a function that takes a `title` and `specialty` and inserts a new doctor into the database. It should return the id of the new doctor. By the way "title" is just to help us distinguish our doctors from our patients. So "Dr. Jane" is the kind of data we'd enter.

The function should return the `rows` from the query. The functions are setup to do this for you by default because we care more about the SQL than the JS right now. But remember this pattern for your own work! We've also included a commented out log statement to help you see what's going on.

## Question 5: addPatient
Make a function that takes a `name` and `age` and inserts a new patient into the database.

## Question 6: addAppointment
Here is where things get interesting. This time, you're given a `date`, `patientId` and a `doctorId`. How can you use these things to create an appointment linking them together? Make sure to check the tests!

# Part 3: The Joins!
Whew! Now that we finally have our tables and data setup lets get to the good stuff! Building out our joins!

## Question 7: getDoctorAndAppointments
As you know, a "many to many" relationship is really just two "has many/belongs to" relationships combined. So before we get to our many to many, lets just tackle that first half: "A Doctor has many appointments"

To do this let's write `getDoctorAndAppointments`, and it takes in a doctor id as an argument. Your task is to use a single `JOIN` and return the rows with the following data:

- all columns on the `doctors` table
- appointments.data
- appointments.patient_id

You do not need anything else from the appointments table for this query.

Now, what's important to notice about this is that the doctor data will be the same on each row. That makes sense right? That single doctor has many appointments.

Ok, once you feel good about this and get it working, let's work on another way of finding similar data. Here's a hint on the order

```
SELECT clause
FROM clause
JOIN / ON Clause
WHERE clause
```
The filtering with the `WHERE` comes after your joins!

## Question 8: getAppointmentDatesByPatient
This time, let's go from the patient side. Build a function `getAppointmentDatesByPatient` that takes in a patient id as an argument. It should return *only* the `date` column from the associated appointments:


```sql

-- What we want as the return from this query
date
------
2023-01-01
2023-08-15

```

Now, you can of course create another join to do this, but the question is: do you need to? You have the `patient_id` and the `date` on the `appointments` table. So you can just use a `WHERE` clause to filter the results. Give it a try ok?

## Question 9: getAppointmentsAndPatientsByDoctorId
Now here we're going to do a full join! Write the function `getAppointmentsAndPatientsByDoctorId` that takes in a doctor id as an argument. It should return the following data (and *only* this data, we know its partials from each table):

- doctors.id
- doctors.title
- appointments.date
- patients.id aliased to "patientId"
  - remember when aliasing camelCase use "double" quotes to define the new name
- patients.name

Now, this is a bit tricky, but you can do it! Remember, you can use `WHERE` clauses to filter out to only the doctor we care about. You will need 2 joins this time!


## Question 10: getPatientsByDoctorId
Now, just like we could simplify our query in question 8, you can do that here too. If you have the doctor id, and don't want any doctor data, you can just *start* with the appointments table and only use one join.

So write a function `getPatientsByDoctorId`, it takes in a doctor id, and all it will do is return a list of patients associated with a doctor id. It should return every column on the `patients` table and no other data in each row.

Again, you can solve this by doing a full join like we just did in question 9 and simply selecting a sub set of the data, but technically you don't need to. Play around with it, what I'm describing is a little hard to understand, you have to just do it.


