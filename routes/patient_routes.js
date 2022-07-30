const express = require("express");
const router = express.Router();
const PatientModel = require("../models/patientModel");
const auth = require("../middleware/auth.js");
const { StatusCodes } = require("http-status-codes");
const {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../utils/dbUtils");
const { createPatientBodyValidation } = require("../utils/validationSchema");

// Route to Get All Patients, valid JWT token must be provided
router.get("/", auth, (req, res) => {
  findAll(PatientModel, {}, res);
});

// Route to Get a Patient by ID, valid JWT token must be provided
router.get("/:id", auth, (req, res) => {
  findById(PatientModel, req.params.id, res);
});

// Route to Create new Patient profile, valid JWT token must be provided
router.post("/", auth, async (req, res) => {
  // Validate patient request
  const { error } = createPatientBodyValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }

  // use this query to make sure patient profile does not already exist for the user
  const query = {
    user_id: req.user._id,
  };

  // New patient document to be saved in database
  const patient = {
    user_id: req.user._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    contact_number: req.body.contact_number,
    address: req.body.address,
    gender: req.body.gender,
    age: req.body.age,
  };

  create(PatientModel, query, patient, res, "patient", req.user);
});

// Route to Update an existing Patient profile associated with the ID, valid JWT token must be provided
router.put("/:id", auth, async (req, res) => {
  findByIdAndUpdate(PatientModel, req.params.id, req.body, res);
});

// Route to Delete an existing Patient profile associated with the ID, valid JWT token must be provided
router.delete("/:id", auth, async (req, res) => {
  findByIdAndDelete(PatientModel, req.params.id, res);
});

module.exports = router;
