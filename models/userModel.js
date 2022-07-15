const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "doctor"],
    default: ["user"],
  },
  profile_id: {
    type: mongoose.Schema.Types.ObjectId, ref: "patient/doctor",
    required: false
  },
});

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
