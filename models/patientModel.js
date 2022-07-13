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
      enum: ["male", "female", "other", "do not prefer to say"],
      default: "male",
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
    // },
    appointments: {
      type: Array
    
    }
  },
  
  {
    timestamps: true,
  }

);

const patientModel = mongoose.model("patients", patientSchema);

module.exports = patientModel;
