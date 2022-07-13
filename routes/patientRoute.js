const express = require("express");
const router = express.Router();
const Patient = require("../models/patientModel");

router.post("/profile", async (req, res) => {
  try {
    const newPatient = new Patient(req.body);
    await newPatient.save();
    res
      .status(200)
      .send({ message: "Account creation successful", success: true });
  } catch (error) {
    console.log(error, req.body);
    res
      .status(500)
      .send({ message: "Error creating account", success: false, error });
  }
});

module.exports = router;
