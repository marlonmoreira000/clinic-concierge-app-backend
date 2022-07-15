const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    contact_number: {
      type: Number,
      required: true
    },
    address: {
      street_number: { type: Number, required: true },
      street_name: { type: String, required: true },
      suburb: { type: String, required: true },
      state: { type: String, enum: ["Victoria", "Queensland", "South Australia", "Western Australia", "Perth", "New South Wales", "Tasmania"], required: true },
      postcode:{type: Number, required: true}

    },
    // Gender not required to allow non-disclosure
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "male",
      required: false,
    },
    // Age not required to allow non-disclosure
    age: {
      type: Number,
      required: false,
    },

    appointments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", required: false }
    ],
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"user"
    }
  },
  {
    timestamps: true,
  }
);

const patientModel = mongoose.model("patients", patientSchema);

module.exports = patientModel;
