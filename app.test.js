const app = require("./app");
const UserModel = require("./models/UserModel");
const DoctorModel = require("./models/doctorModel");
const PatientModel = require("./models/patientModel");
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

  DoctorModel.findOne({ user_id: userId }).then((doctor) => {
    if (doctor) {
      DoctorModel.findByIdAndDelete(doctor._id, (err, doc) => {
        if (err) {
          log("Failed to delete existing doctor: %O", err);
        } else {
          log("Deleted existing doctor: %O", doc);
        }
      });
    } else {
      log(`No doctor found for user with id ${userId}`);
    }
  });
});

describe("Auth Route Tests", () => {
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
  });
});

describe("User Route Tests", () => {
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

describe("Doctor Route Tests", () => {
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

  test("Get doctor by ID: GET /api/v1/doctor/:id", async () => {
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

  test("Create new doctor: POST /api/v1/doctor", async () => {
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

  test("Update doctor: PUT /api/v1/doctor/:doctorId", async () => {
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

  test("Delete doctor: Delete /api/v1/doctor/:doctorId", async () => {
    const res = await request(app)
      .delete("/api/v1/doctors/" + doctorId)
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(204);
  });
});

describe("Patient Route Tests", () => {
  test("Get all patients: GET /api/v1/patients", async () => {
    const res = await request(app).get("/api/v1/patients");
    expect(res.status).toBe(200);
    const patient = res.body[0];
    expect(patient._id).toBe("62d037df1ceb4dda0110949c");
    expect(patient.first_name).toBe("patient1");
    expect(patient.last_name).toBe("patient");
    expect(patient.contact_number).toBe("3232323232");
    expect(patient.gender).toBe("male");
    expect(patient.address.street_number).toBe(5);
    expect(patient.address.street_name).toBe("abc st");
    expect(patient.address.suburb).toBe("Melbourne");
    expect(patient.address.state).toBe("Victoria");
    expect(patient.address.postcode).toBe(3000);
    expect(patient.age).toBe("diabetology");
    expect(patient.user_id).toBeDefined();
    expect(patient.user_id).toBe("62cfb8a8776e94160cfee75b");
  });

  test("Get patient by ID: GET /api/v1/patients/:id", async () => {
    const res = await request(app).get(
      "/api/v1/patients/62d037df1ceb4dda0110949c"
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

});
