const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const { refreshTokenBodyValidation } = require("../utils/validationSchema");
const verifyRefreshToken = require("../utils/verifyRefreshToken");

// Get new access token
router.post("/", async (req, res) => {
  // Validate request
  const { error } = refreshTokenBodyValidation(req.body);
  if (error) {
    return res.status(400).json({ error: true, message: error.message });
  }

  // Verify token
  verifyRefreshToken(req.body.refreshToken)
    .then(({ tokenDetails }) => {
      const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
      const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        { expiresIn: "15m" }
      );
      res
        .status(200)
        .json({ error: false, accessToken, message: "Access token created" });
    })
    .catch((err) => res.status(400).json(err));
});

// Logout - delete token
router.delete("/", async (req, res) => {
  try {
    // Validate request
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
      return res.status(400).json({ error: true, message: error.message });
    }

    // Find user token from given refresh token.
    // If it doesn't exist, tell user they're logged out.
    const userToken = await Token.findOne({ token: req.body.refreshToken });
    if (!userToken) {
      return res.status(200).json({ error: false, message: "Logged out" });
    }

    // If token does exist, delete it, then tell user they're logged out
    await userToken.remove();
    return res.status(200).json({ error: false, message: "Logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

module.exports = router;
