const mongoose = require("./connection");

const doctorSchema = new mongoose.Schema(
  {
    // First name of the doctor
    first_name: {
      type: String,
      required: true,
    },
    // Last name of the doctor
    last_name: {
      type: String,
      required: true,
    },
    // Gender required as this is relevant information for comfort of some patients when choosing a practitioner
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "male",
      required: true,
    },
    // Experience = years of practicing medicine
    experience: {
      type: Number,
      required: true,
    },
    // Specialisation/area of expertise
    speciality: {
      type: String,
      required: true,
    },
    // 'About Me' for doctor - optional
    bio: {
      type: String,
      required: false,
    },
    // User Id associated with this doctor profile
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    // List of appointments for this doctor profile
    appointments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "appointments",
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("Doctor", doctorSchema);

module.exports = doctorModel;
