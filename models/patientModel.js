const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    givenName: {
      type: String,
      required: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    // Gender not required to allow registration to work
    gender: {
      type: String,
      required: false,
    },
    // Age not required to allow registration to work
    age: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    // NOT REQUIRED ONLY FOR INITIAL TESTING/DEVELOPMENT
    // SET TO REQUIRED: TRUE FOR PRODUCTION!
    auth0Id: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("Patients", patientSchema);

module.exports = patientModel;
