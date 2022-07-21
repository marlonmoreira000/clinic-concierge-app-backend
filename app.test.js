const app = require("./app");
const UserModel = require("./models/UserModel");
const AppointmentModel = require("./models/appointmentModel");
const TokenModel = require("./models/tokenModel");
const request = require("supertest");
const { log } = require("console");

const testEmail = "jest_test_user@test.com";
let userId;
let accessToken;
let refreshToken;
let doctorId;
let patientId;
let appointmentId;
let bookingId;

afterAll(function () {
  UserModel.findOne({ email: testEmail }).then((user) => {
    if (user) {
      UserModel.findByIdAndDelete(user.id, (err, usr) => {
        if (err) {
          log("Failed to delete existing jest test user");
        } else {
          log("Successfully deleted existing jest test user");
        }
      });
    }
  });
});

describe("Auth Routes Tests", () => {
  describe("Success Scenarios", () => {
    test("Create new User: POST /api/v1/register", async () => {
      const res = await request(app).post("/api/v1/register").send({
        email: testEmail,
        password: "Test@1234",
      });

      expect(res.status).toBe(201);
      expect(res.body.error).toBe(false);
      expect(res.body.message).toBe("Account created successfully");

      const user = await UserModel.findOne({ email: testEmail });
      userId = user._id;
    });

    test("User Login: POST /api/v1/login", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: testEmail,
        password: "Test@1234",
      });

      expect(res.status).toBe(200);
      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(res.body.error).toBe(false);
      expect(res.body.message).toBe("Login successful");
    });

    test("Refresh Token: POST /api/v1/refreshToken", async () => {
      const res = await request(app).post("/api/v1/refreshToken").send({
        refreshToken: refreshToken,
      });

      accessToken = res.body.accessToken;
      expect(res.status).toBe(200);
      expect(res.body.error).toBe(false);
      expect(accessToken).toBeDefined();
      expect(res.body.message).toBe("Access token created");
    });
  });

  describe("Failure Scenarios", () => {
    test("Cannot Create Existing User: POST /api/v1/register", async () => {
      const res = await request(app).post("/api/v1/register").send({
        email: "jest_test_user@test.com",
        password: "Test@1234",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Account already exists for this email");
    });

    test("Create new User failed invalid email", async () => {
      const res = await request(app).post("/api/v1/register").send({
        email: "jest_test_user",
        password: "Test@1234",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('"Email" must be a valid email');
    });

    test("Login failed invalid request", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: testEmail,
        pass: "Test@1234",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('"Password" is required');
    });

    test("Login failed invalid email", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "XXX",
        password: "Test@1234",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('"Email" must be a valid email');
    });

    test("Login failed unknown user", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: "XXX@ss.com",
        password: "Test@1234",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("User does not exist");
    });

    test("Login failed invalid password", async () => {
      const res = await request(app).post("/api/v1/login").send({
        email: testEmail,
        password: "XXX",
      });

      expect(res.status).toBe(401);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Invalid password");
    });

    test("Refresh Token failed invalid request", async () => {
      const res = await request(app).post("/api/v1/refreshToken").send({
        refresh_token: refreshToken,
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe('"Refresh Token" is required');
    });

    test("Refresh Token failed invalid token", async () => {
      const res = await request(app).post("/api/v1/refreshToken").send({
        refreshToken: "refreshToken",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Invalid refresh token");
    });

    test("Refresh Token expired token", async () => {
      const res = await request(app).post("/api/v1/refreshToken").send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmQzYjgzN2I2OTJmOGQ4M2U2ZGEzNTgiLCJyb2xlcyI6WyJ1c2VyIiwicGF0aWVudCJdLCJpYXQiOjE2NTg0MTMwNjYsImV4cCI6MTY1ODQxMzk2Nn0.uDCcHBExJxVCELnr4wGNOiwX6L5gMM2va4xvSLTqImQ",
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Invalid refresh token");
    });
  });
});

describe("User Routes Tests", () => {
  describe("Success Scenarios", () => {
    test("Get all users: GET /api/v1/users", async () => {
      const res = await request(app)
        .get("/api/v1/users")
        .set("Authorization", "Bearer " + accessToken);
      expect(res.status).toBe(200);
      const user = res.body[0];
      expect(user._id).toBe("62cfb8a8776e94160cfee75b");
      expect(user.email).toBe("test_user1@test.com");
      expect(user.password).toBe(
        "$2b$12$YAldOssSHn44F.4SkKNx1ufckRZKTBgZ2PdDhetHs3TL6jYycaR7C"
      );
      expect(user.roles[0]).toBe("user");
    });

    test("Get user by ID: GET /api/v1/users/:id", async () => {
      const res = await request(app)
        .get("/api/v1/users/" + userId)
        .set("Authorization", "Bearer " + accessToken);
      expect(res.status).toBe(200);
      const user = res.body;
      expect(user.email).toBe("jest_test_user@test.com");
      expect(user.password).toBeDefined();
      expect(user.roles[0]).toBe("user");
    });
  });

  describe("Failure Scenarios", () => {
    test("Should fail to get users without access token", async () => {
      const res = await request(app).get("/api/v1/users/");
      expect(res.status).toBe(401);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Access denied: No token provided.");
    });

    test("Should fail to get user without access token", async () => {
      const res = await request(app).get("/api/v1/users/" + userId);
      expect(res.status).toBe(401);
      expect(res.body.error).toBe(true);
      expect(res.body.message).toBe("Access denied: No token provided.");
    });
  });
});

describe("Doctor Routes Tests", () => {
  test("Get all doctors: GET /api/v1/doctors", async () => {
    const res = await request(app).get("/api/v1/doctors");
    expect(res.status).toBe(200);
    const doctor = res.body[0];
    expect(doctor._id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(doctor.first_name).toBe("doctor1");
    expect(doctor.last_name).toBe("doctor");
    expect(doctor.gender).toBe("male");
    expect(doctor.experience).toBe(15);
    expect(doctor.speciality).toBe("diabetology");
    expect(doctor.bio).toBeDefined();
    expect(doctor.user_id).toBe("62cfb8a8776e94160cfee75b");
  });

  test("Get doctor by ID: GET /api/v1/doctors/:id", async () => {
    const res = await request(app).get(
      "/api/v1/doctors/62d0b723973a6ab7e30b3bc8"
    );
    expect(res.status).toBe(200);
    const doctor = res.body;
    expect(doctor._id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(doctor.first_name).toBe("doctor1");
    expect(doctor.last_name).toBe("doctor");
    expect(doctor.gender).toBe("male");
    expect(doctor.experience).toBe(15);
    expect(doctor.speciality).toBe("diabetology");
    expect(doctor.bio).toBeDefined();
    expect(doctor.user_id).toBe("62cfb8a8776e94160cfee75b");
  });

  test("Create new doctor: POST /api/v1/doctors", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_doc_fn",
        last_name: "test_doc_ln",
        gender: "male",
        experience: "5",
        speciality: "Orthopaedics",
        bio: "something something something more",
      });
    expect(res.status).toBe(201);
    const doctor = res.body;
    doctorId = doctor._id;
    log(`DoctorID for userId: ${userId}: ${doctorId}`);
    expect(doctorId).toBeDefined();
    expect(doctor.first_name).toBe("test_doc_fn");
    expect(doctor.last_name).toBe("test_doc_ln");
    expect(doctor.gender).toBe("male");
    expect(doctor.experience).toBe(5);
    expect(doctor.speciality).toBe("Orthopaedics");
    expect(doctor.bio).toBe("something something something more");
    expect(doctor.appointments).toEqual([]);

    const user = await UserModel.findById(userId);
    expect(user.roles[0]).toEqual("user");
    expect(user.roles[1]).toEqual("doctor");
  });

  test("Should fail to create doctor when bad request", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_doc_fn",
        last_name: "test_doc_ln",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe('"gender" is required');
  });

  test("Should fail to create doctor when doctor profile already exists", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_doc_fn",
        last_name: "test_doc_ln",
        gender: "male",
        experience: "5",
        speciality: "Orthopaedics",
        bio: "something something something more",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Doctor already exist, cannot recreate it");
  });

  test("Update doctor: PUT /api/v1/doctors/:id", async () => {
    const res = await request(app)
      .put("/api/v1/doctors/" + doctorId)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        experience: "15",
      });
    expect(res.status).toBe(200);
    const doctor = res.body;
    expect(doctor._id).toBe(doctorId);
    expect(doctor.first_name).toBe("test_doc_fn");
    expect(doctor.last_name).toBe("test_doc_ln");
    expect(doctor.gender).toBe("male");
    expect(doctor.experience).toBe(15);
    expect(doctor.speciality).toBe("Orthopaedics");
    expect(doctor.bio).toBe("something something something more");
    expect(doctor.appointments).toEqual([]);
  });
});

describe("Patient Routes Tests", () => {
  test("Get all patients: GET /api/v1/patients", async () => {
    const res = await request(app)
      .get("/api/v1/patients")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const patient = res.body[0];
    expect(patient._id).toBe("62d037df1ceb4dda0110949c");
    expect(patient.first_name).toBe("patient1");
    expect(patient.last_name).toBe("patient");
    expect(patient.contact_number).toBe(3232323232);
    expect(patient.gender).toBe("male");
    expect(patient.address.street_number).toBe(5);
    expect(patient.address.street_name).toBe("abc st");
    expect(patient.address.suburb).toBe("Melbourne");
    expect(patient.address.state).toBe("Victoria");
    expect(patient.address.postcode).toBe(3000);
    expect(patient.age).toBeUndefined();
    expect(patient.user_id).toBe("62cfb8a8776e94160cfee75b");
  });

  test("Failed to Get all patients without token: GET /api/v1/patients", async () => {
    const res = await request(app).get("/api/v1/patients");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });

  test("Get patient by ID: GET /api/v1/patients/:id", async () => {
    const res = await request(app)
      .get("/api/v1/patients/62d037df1ceb4dda0110949c")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const patient = res.body;
    expect(patient._id).toBe("62d037df1ceb4dda0110949c");
    expect(patient.first_name).toBe("patient1");
    expect(patient.last_name).toBe("patient");
    expect(patient.contact_number).toBe(3232323232);
    expect(patient.gender).toBe("male");
    expect(patient.address.street_number).toBe(5);
    expect(patient.address.street_name).toBe("abc st");
    expect(patient.address.suburb).toBe("Melbourne");
    expect(patient.address.state).toBe("Victoria");
    expect(patient.address.postcode).toBe(3000);
    expect(patient.age).toBeUndefined();
    expect(patient.user_id).toBe("62cfb8a8776e94160cfee75b");
  });

  test("Failed to Get all patient with ID without token: GET /api/v1/patients/:id", async () => {
    const res = await request(app).get(
      "/api/v1/patients/62d037df1ceb4dda0110949c"
    );
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });

  test("Create new patient: POST /api/v1/patients", async () => {
    const res = await request(app)
      .post("/api/v1/patients/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_patient_fn",
        last_name: "test_patient_ln",
        contact_number: "1234567890",
        address: {
          street_number: "1",
          street_name: "def st",
          suburb: "Melbourne",
          state: "Victoria",
          postcode: "3000",
        },
      });
    expect(res.status).toBe(201);
    const patient = res.body;
    patientId = patient._id;
    log(`PatientID for userId: ${userId}: ${patientId}`);
    expect(patientId).toBeDefined();
    expect(patient.first_name).toBe("test_patient_fn");
    expect(patient.last_name).toBe("test_patient_ln");
    expect(patient.contact_number).toBe(1234567890);
    expect(patient.gender).toBe("male");
    expect(patient.address.street_number).toBe(1);
    expect(patient.address.street_name).toBe("def st");
    expect(patient.address.suburb).toBe("Melbourne");
    expect(patient.address.state).toBe("Victoria");
    expect(patient.address.postcode).toBe(3000);
    expect(patient.age).toBeUndefined();

    const user = await UserModel.findById(userId);
    expect(user.roles[0]).toEqual("user");
    expect(user.roles[1]).toEqual("doctor");
    expect(user.roles[2]).toEqual("patient");
  });

  test("Should fail to create patient when bad request", async () => {
    const res = await request(app)
      .post("/api/v1/patients/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_patient_fn",
        last_name: "test_patient_ln",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe('"contact_number" is required');
  });

  test("Should fail to create patient when patient profile already exists", async () => {
    const res = await request(app)
      .post("/api/v1/patients/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_patient_fn",
        last_name: "test_patient_ln",
        contact_number: "1234567890",
        address: {
          street_number: "1",
          street_name: "def st",
          suburb: "Melbourne",
          state: "Victoria",
          postcode: "3000",
        },
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Patient already exist, cannot recreate it");
  });

  test("Update patient: PUT /api/v1/patients/:id", async () => {
    const res = await request(app)
      .put("/api/v1/patients/" + patientId)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        contact_number: "9876543210",
      });
    expect(res.status).toBe(200);
    const patient = res.body;
    expect(patient._id).toBe(patientId);
    expect(patient.first_name).toBe("test_patient_fn");
    expect(patient.last_name).toBe("test_patient_ln");
    expect(patient.contact_number).toBe(9876543210);
    expect(patient.gender).toBe("male");
    expect(patient.address.street_number).toBe(1);
    expect(patient.address.street_name).toBe("def st");
    expect(patient.address.suburb).toBe("Melbourne");
    expect(patient.address.state).toBe("Victoria");
    expect(patient.address.postcode).toBe(3000);
    expect(patient.age).toBeUndefined();
  });
});

describe("Appointment Routes Tests", () => {
  test("Get all appointments: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body[0];
    expect(appointment._id).toBe("62d0fc5ce3ca1b817cc22b9c");
    expect(appointment.doctor_id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d037df1ceb4dda0110949c");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
  });

  test("Get all appointments by fromTime: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments?fromTime=2022-07-17T00:00:00.000Z")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body[0];
    expect(appointment._id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(appointment.doctor_id).toBe("62d3b3e99c3bf66e4319adc1");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d3b883b692f8d83e6da35f");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-30T06:30:00.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-30T07:30:00.000Z"
    );
  });

  test("Get all appointments by toTime: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments?toTime=2022-07-18T00:00:00.000Z")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body[0];
    expect(appointment._id).toBe("62d0fc5ce3ca1b817cc22b9c");
    expect(appointment.doctor_id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d037df1ceb4dda0110949c");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
  });

  test("Get all appointments by booked: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments?booked=true")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body[0];
    expect(appointment._id).toBe("62d0fc5ce3ca1b817cc22b9c");
    expect(appointment.doctor_id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d037df1ceb4dda0110949c");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
  });

  test("Get all appointments by doctorId: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments?doctorId=62d0b723973a6ab7e30b3bc8")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body[0];
    expect(appointment._id).toBe("62d0fc5ce3ca1b817cc22b9c");
    expect(appointment.doctor_id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d037df1ceb4dda0110949c");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
  });

  test("Failed to Get all appointments without token: GET /api/v1/appointments", async () => {
    const res = await request(app).get("/api/v1/appointments");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });

  test("Get all appointment by id: GET /api/v1/appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments/62d0fc5ce3ca1b817cc22b9c")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const appointment = res.body;
    expect(appointment._id).toBe("62d0fc5ce3ca1b817cc22b9c");
    expect(appointment.doctor_id).toBe("62d0b723973a6ab7e30b3bc8");
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBe("62d037df1ceb4dda0110949c");
    expect(appointment.appointment_slot.start_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2022-07-14T05:35:59.000Z"
    );
  });

  test("Failed to Get all appointment with ID without token: GET /api/v1/appointments/:id", async () => {
    const res = await request(app).get(
      "/api/v1/appointments/62d037df1ceb4dda0110949c"
    );
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });

  test("Create new appointment: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
        end_time: "2042-07-28T12:00:00.000+10:00",
      });
    expect(res.status).toBe(201);
    const appointment = res.body;
    appointmentId = appointment._id;
    log(`AppointmentID for userId: ${userId}: ${appointmentId}`);
    expect(appointment._id).toBeDefined();
    expect(appointment.doctor_id).toBe(doctorId);
    expect(appointment.booked).toBe(false);
    expect(appointment.booked_by).toBeUndefined();
    expect(appointment.appointment_slot.start_time).toBe(
      "2042-07-28T01:00:00.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2042-07-28T02:00:00.000Z"
    );
  });

  test("Failed to Create new appointment invalid request: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe('"end_time" is required');
  });

  test("Failed to Create new appointment invalid start time: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2012-07-28T11:00:00.000+10:00",
        end_time: "2042-07-28T12:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Appointment start date is in past.");
  });

  test("Failed to Create new appointment invalid end time: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
        end_time: "2012-07-28T12:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Appointment end date is in past.");
  });

  test("Failed to Create new appointment end time before start time: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
        end_time: "2042-07-28T10:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Appointment start time should be earlier than end time and start and end time cannot be equal."
    );
  });

  test("Failed to Create new appointment doctor doesn't exist: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: "test_patient3@test.com",
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
        end_time: "2042-07-28T12:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Cannot create appointment as failed to find doctor associated with this request."
    );
  });

  test("Failed to Create existing appointment: POST /api/v1/appointments", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/appointments/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        start_time: "2042-07-28T11:00:00.000+10:00",
        end_time: "2042-07-28T12:00:00.000+10:00",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Appointment already exist, cannot recreate it"
    );
  });

  test("Update appointment: PUT /api/v1/appointments/:id", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .put("/api/v1/appointments/" + appointmentId)
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        booked: true,
      });
    expect(res.status).toBe(200);
    const appointment = res.body;
    expect(appointment._id).toBe(appointmentId);
    expect(appointment.doctor_id).toBe(doctorId);
    expect(appointment.booked).toBe(true);
    expect(appointment.booked_by).toBeUndefined();
    expect(appointment.appointment_slot.start_time).toBe(
      "2042-07-28T01:00:00.000Z"
    );
    expect(appointment.appointment_slot.end_time).toBe(
      "2042-07-28T02:00:00.000Z"
    );
  });
});

describe("Booking Routes Tests", () => {
  test("Get all bookings: GET /api/v1/bookings", async () => {
    const res = await request(app)
      .get("/api/v1/bookings")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const booking = res.body[0];
    expect(booking._id).toBe("62d765b0ed2c4ee6dd3d2662");
    expect(booking.appointment_id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(booking.patient_id).toBe("62d3b883b692f8d83e6da35f");
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);
  });

  test("Get all bookings by patientId: GET /api/v1/bookings", async () => {
    const res = await request(app)
      .get("/api/v1/bookings?patientId=62d3b883b692f8d83e6da35f")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const booking = res.body[0];
    expect(booking._id).toBe("62d765b0ed2c4ee6dd3d2662");
    expect(booking.appointment_id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(booking.patient_id).toBe("62d3b883b692f8d83e6da35f");
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);
  });

  test("Get all bookings by attended: GET /api/v1/bookings", async () => {
    const res = await request(app)
      .get("/api/v1/bookings?attended=false")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const booking = res.body[0];
    expect(booking._id).toBe("62d765b0ed2c4ee6dd3d2662");
    expect(booking.appointment_id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(booking.patient_id).toBe("62d3b883b692f8d83e6da35f");
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);
  });

  test("Get all bookings by fee paid: GET /api/v1/bookings", async () => {
    const res = await request(app)
      .get("/api/v1/bookings?feePaid=false")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const booking = res.body[0];
    expect(booking._id).toBe("62d765b0ed2c4ee6dd3d2662");
    expect(booking.appointment_id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(booking.patient_id).toBe("62d3b883b692f8d83e6da35f");
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);
  });

  test("Get all booking by id: GET /api/v1/bookings/:id", async () => {
    const res = await request(app)
      .get("/api/v1/bookings/62d765b0ed2c4ee6dd3d2662")
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const booking = res.body;
    expect(booking._id).toBe("62d765b0ed2c4ee6dd3d2662");
    expect(booking.appointment_id).toBe("62d0fc7e4a0130949b8eb5e7");
    expect(booking.patient_id).toBe("62d3b883b692f8d83e6da35f");
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);
  });

  test("Create new booking: POST /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        appointment_id: appointmentId,
      });
    expect(res.status).toBe(201);
    const booking = res.body;
    bookingId = booking._id;
    log(`BookingID for userId: ${userId}: ${bookingId}`);
    expect(booking._id).toBeDefined();
    expect(booking.appointment_id).toBe(appointmentId);
    expect(booking.patient_id).toBe(patientId);
    expect(booking.attended).toBe(false);
    expect(booking.fee_paid).toBe(false);

    const appointment = await AppointmentModel.findById(appointmentId);
    expect(appointment.booked).toBe(true);
  });

  test("Create booking failed invalid role: POST /api/v1/bookings", async () => {
    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        appointment_id: appointmentId,
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("You are not authorised");
  });

  test("Create booking failed invalid access token: POST /api/v1/bookings", async () => {
    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer accessToken")
      .send({
        appointment_id: appointmentId,
      });
    expect(res.status).toBe(403);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: Invalid or expired token.");
  });

  test("Create booking failed invalid request: POST /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        appointmentId: appointmentId,
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe('"appointment_id" is required');
  });

  test("Create booking failed appointmentId not found: POST /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        appointment_id: "62d96a677031381202d9b3dd",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Failed to create booking as invalid appointment id provided"
    );
  });

  test("Create booking failed invalid patientId: POST /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        appointment_id: appointmentId,
        patient_id: "62d96a677031381202d9b3dd",
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Failed to create booking as invalid patient id provided"
    );
  });

  test("Create existing booking failed: POST /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .post("/api/v1/bookings/")
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        appointment_id: appointmentId,
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Booking already exist, cannot recreate it");
  });

  test("Update booking: PUT /api/v1/bookings", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .put("/api/v1/bookings/" + bookingId)
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken)
      .send({
        attended: true,
        fee_paid: true,
      });
    expect(res.status).toBe(200);
    const booking = res.body;
    bookingId = booking._id;
    log(`BookingID for userId: ${userId}: ${bookingId}`);
    expect(booking._id).toBe(bookingId);
    expect(booking.appointment_id).toBe(appointmentId);
    expect(booking.patient_id).toBe(patientId);
    expect(booking.attended).toBe(true);
    expect(booking.fee_paid).toBe(true);
  });
});

describe("Delete Routes Tests", () => {
  test("Delete doctor: Delete /api/v1/doctors/:id", async () => {
    const res = await request(app)
      .delete("/api/v1/doctors/" + doctorId)
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(204);
  });

  test("Delete patient: Delete /api/v1/patients/:id", async () => {
    const res = await request(app)
      .delete("/api/v1/patients/" + patientId)
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(204);
  });

  test("Delete booking: Delete /api/v1/bookings/:id", async () => {
    const res = await request(app)
      .delete("/api/v1/bookings/" + bookingId)
      .set("Authorization", "Bearer " + accessToken);
    log("res.body: %0", res.body);
    expect(res.status).toBe(204);
  });

  test("Failed to Delete deleted booking: Delete /api/v1/bookings/:id", async () => {
    const res = await request(app)
      .delete("/api/v1/bookings/" + bookingId)
      .set("Authorization", "Bearer " + accessToken);
    log("res.body: %0", res.body);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      `Failed to delete Booking as booking with id: ${bookingId} does not exist`
    );
  });

  test("Delete appointment failed appointment booked: DELETE /api/v1/appointments/:id", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { booked: true },
      { returnDocument: "after" }
    );

    const res = await request(app)
      .delete("/api/v1/appointments/" + appointmentId)
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken);
    expect(res.status).toBe(400);
    log("res.body: %O", res.body);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Delete Appointment failed as it is already booked"
    );
  });

  test("Delete appointment: DELETE /api/v1/appointments/:id", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      { booked: false },
      { returnDocument: "after" }
    );

    const res = await request(app)
      .delete("/api/v1/appointments/" + appointmentId)
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken);
    expect(res.status).toBe(204);
  });

  test("Failed to Delete appointment id not found: DELETE /api/v1/appointments/:id", async () => {
    const tokenResponse = await request(app).post("/api/v1/login").send({
      email: testEmail,
      password: "Test@1234",
    });

    const res = await request(app)
      .delete("/api/v1/appointments/" + appointmentId)
      .set("Authorization", "Bearer " + tokenResponse.body.accessToken);
    expect(res.status).toBe(404);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe(
      "Delete Appointment failed as appointment does not exist"
    );
  });

  test("Delete Token: DELETE /api/v1/refreshToken", async () => {
    const userToken = await TokenModel.findOne({});
    const res = await request(app).delete("/api/v1/refreshToken").send({
      refreshToken: userToken.token,
    });
    expect(res.status).toBe(200);
    expect(res.body.error).toBe(false);
    expect(res.body.message).toBe("Logged out");
  });

  test("Delete failed invalid Token: DELETE /api/v1/refreshToken", async () => {
    const res = await request(app).delete("/api/v1/refreshToken").send({
      refreshToken: "refreshToken",
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(false);
    expect(res.body.message).toBe("Logged out");
  });

  test("Delete Token failed invalid request", async () => {
    const res = await request(app).delete("/api/v1/refreshToken").send({
      refresh_token: refreshToken,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe('"Refresh Token" is required');
  });
});
