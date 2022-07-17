const mongoose = require("./connection");

const doctorSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    appointments: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "appointments",
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctors", doctorSchema);

module.exports = doctorModel;
