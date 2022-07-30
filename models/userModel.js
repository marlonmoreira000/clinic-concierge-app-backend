const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Email Address of the user, must be unique
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Password of the user
  password: {
    type: String,
    required: true,
  },
  // Roles a user can have
  roles: {
    type: [String],
    enum: ["user", "admin", "doctor", "patient"],
    default: ["user"],
  },
  // Doctor or Patient Profile Id for the user
  profile_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "patient/doctor",
    required: false,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
