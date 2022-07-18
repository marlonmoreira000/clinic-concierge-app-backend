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

router.get("/", auth, (req, res) => {
  findAll(PatientModel, {}, res);
});

router.get("/:id", auth, (req, res) => {
  findById(PatientModel, req.params.id, res);
});

router.post("/", auth, async (req, res) => {
  // Validate patient request
  const { error } = createPatientBodyValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }

  const query = {
    user_id: req.user._id,
  };
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

router.put("/:id", auth, async (req, res) => {
  findByIdAndUpdate(PatientModel, req.params.id, req.body, res);
});

router.delete("/:id", auth, async (req, res) => {
  findByIdAndDelete(PatientModel, req.params.id, res);
});

module.exports = router;
