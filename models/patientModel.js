const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    // First name of the patient
    first_name: {
      type: String,
      required: true,
    },
    // Last name of the patient
    last_name: {
      type: String,
      required: true,
    },
    // Contact number of the patient
    contact_number: {
      type: Number,
      required: true,
    },
    // Address of the patient
    address: {
      street_number: { type: Number, required: true },
      street_name: { type: String, required: true },
      suburb: { type: String, required: true },
      state: {
        type: String,
        enum: [
          "Victoria",
          "Queensland",
          "South Australia",
          "Western Australia",
          "Australian Capital Territory",
          "New South Wales",
          "Tasmania",
          "Northern Territory",
        ],
        required: true,
      },
      postcode: { type: Number, required: true },
    },
    // Gender not required to allow non-disclosure
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "prefer not to say",
      required: false,
    },
    // Age not required to allow non-disclosure
    age: {
      type: Number,
      required: false,
    },
    // List of appointment booked by the patient
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: false,
      },
    ],
    // UserId associated with the patient profile
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("Patient", patientSchema);

module.exports = patientModel;
