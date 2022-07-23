const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const {
  registrationBodyValidation,
  loginBodyValidation,
} = require("../utils/validationSchema");
const generateToken = require("../utils/generateTokens");
const { StatusCodes } = require("http-status-codes");

// Registration
router.post("/register", async (req, res) => {
  try {
    // Validate registration request
    const { error } = registrationBodyValidation(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: error.message });
    }

    // Check if user already exists for this email address
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: "Account already exists for this email",
      });
    }

    // Encrypt, salt and hash password - IMPORTANT
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save User to DB, replacing supplied password with hashed+salted password
    user = await new User({ ...req.body, password: hashedPassword }).save();

    // Generate access and refresh token for newly create user
    const { accessToken, refreshToken } = await generateToken(user);
    res.status(StatusCodes.CREATED).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: true, message: "Internal Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Validate login request
    const { error } = loginBodyValidation(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: error.message });
    }

    // Check that user exists for this email address
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: true, message: "User does not exist" });
    }

    // Compare supplied password against stored password
    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: true, message: "Invalid password" });
    }

    // Generate access and refresh token if email + password correct
    const { accessToken, refreshToken } = await generateToken(user);
    res.status(StatusCodes.OK).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Login successful",
    });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
