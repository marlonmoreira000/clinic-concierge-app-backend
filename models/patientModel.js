const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // Gender not required to allow non-disclosure
    gender: {
      type: String,
      required: false,
    },
    // Age not required to allow non-disclosure
    age: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    // Password field included but commented out due to uncertainty regarding registration
    // password: {
    //   type: String,
    //   required: true,
    // },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("patients", patientSchema);

module.exports = patientModel;