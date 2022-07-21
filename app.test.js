const app = require("./app");
const UserModel = require("./models/UserModel");
const DoctorModel = require("./models/doctorModel");
const PatientModel = require("./models/patientModel");
const request = require("supertest");
const { log } = require("console");

let accessToken;
let refreshToken;
const userId = "62d8b297b1f40068b0336cca";
let doctorId;
let patientId;
let appointmentId;
let bookingId;

describe("Auth Route Tests", () => {
  test("Cannot Create Existing User: /api/v1/register", async () => {
    const res = await request(app).post("/api/v1/register").send({
      email: "jest_test_user@test.com",
      password: "Test@1234",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Account already exists for this email");
  });

  test("User Login: /api/v1/login", async () => {
    const res = await request(app).post("/api/v1/login").send({
      email: "jest_test_user@test.com",
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

describe("User Route Tests", () => {

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

  test("Should fail to get users without access token", async () => {
    const res = await request(app).get("/api/v1/users/");
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });

  test("Get user by ID: GET /api/v1/users/:id", async () => {
    const res = await request(app)
      .get("/api/v1/users/" + userId)
      .set("Authorization", "Bearer " + accessToken);
    expect(res.status).toBe(200);
    const user = res.body;
    expect(user._id).toBe("62d8b297b1f40068b0336cca");
    expect(user.email).toBe("jest_test_user@test.com");
    expect(user.password).toBe(
      "$2b$12$ME4ThAPPNvqvwQgCp.gl2.Xw0Qn/BCeiZS0XpQoir05gRXT.nUvEO"
    );
    expect(user.roles[0]).toBe("user");
  });

  test("Should fail to get user without access token", async () => {
    const res = await request(app)
      .get("/api/v1/users/" + userId);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("Access denied: No token provided.");
  });
});

describe("Doctor Route Tests", () => {
  beforeAll(function () {
    UserModel.findByIdAndUpdate(userId, { roles: ["user"] }).then((doc) => {
      log(`User with id: ${userId} updated`);
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
  });

  test("Should fail to create doctor when bad request", async () => {
    const res = await request(app)
      .post("/api/v1/doctors/")
      .set("Authorization", "Bearer " + accessToken)
      .send({
        first_name: "test_doc_fn",
        last_name: "test_doc_ln"
      });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
    expect(res.body.message).toBe("\"gender\" is required");
  });

  test("Update doctor: PUT /api/v1/doctor/:doctorId", async () => {
    const res = await request(app)
      .put("/api/v1/doctors/" + doctorId)
      .set("Authorization", "Bearer " + accessToken)
      .send({
        experience: "15",
      });
    expect(res.status).toBe(204);
  });

  test("Delete doctor: Delete /api/v1/doctor/:doctorId", async () => {
    const res = await request(app)
      .delete("/api/v1/doctors/" + doctorId)
      .set("Authorization", "Bearer " + accessToken);
    log(res.body);
    expect(res.status).toBe(204);
  });
});
