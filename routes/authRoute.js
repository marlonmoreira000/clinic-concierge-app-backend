const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
import { registrationBodyValidation } from "../utils/validationSchema";

// Registration
router.post("/register", async (req, res) => {
  try {
    // Validate body of registration request
    const { error } = registrationBodyValidation(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }

    // check if user already exists for this email address
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({
        error: true,
        message: "Account already exists for this email",
      });
    }

    // Encrypt, salt and hash password - IMPORTANT
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save User to DB, replacing supplied password with hashed+salted password
    await new User({ ...req.body, password: hashedPassword }).save();
    res
      .status(201)
      .json({ error: false, message: "Account created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
