const express = require("express");
const router = express.Router();
const DoctorModel = require("../models/doctorModel");
const auth = require("../middleware/auth.js");
const { StatusCodes } = require("http-status-codes");
const {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../utils/dbUtils");
const { createDoctorBodyValidation } = require("../utils/validationSchema");

// Route to Get All Doctors, JWT token not required
router.get("/", (req, res) => {
  findAll(DoctorModel, {}, res);
});

// Route to Get Doctor by ID, JWT token not required
router.get("/:id", (req, res) => {
  findById(DoctorModel, req.params.id, res);
});

// Route to Create new Patient profile, valid JWT token must be provided
router.post("/", auth, (req, res) => {
  // Validate create request
  const { error } = createDoctorBodyValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }

  // use this query to make sure doctor profile does not already exist for the user
  const query = {
    user_id: req.user._id,
  };

  // New doctor document to be saved in database
  const doctor = {
    user_id: req.user._id,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    experience: req.body.experience,
    speciality: req.body.speciality,
    bio: req.body.bio,
  };

  create(DoctorModel, query, doctor, res, "doctor", req.user);
});

// Route to Update an existing Doctor profile associated with the ID, valid JWT token must be provided
router.put("/:id", auth, async (req, res) => {
  findByIdAndUpdate(DoctorModel, req.params.id, req.body, res);
});

// Route to Delete an existing Doctor profile associated with the ID, valid JWT token must be provided
router.delete("/:id", auth, async (req, res) => {
  findByIdAndDelete(DoctorModel, req.params.id, res);
});

module.exports = router;
