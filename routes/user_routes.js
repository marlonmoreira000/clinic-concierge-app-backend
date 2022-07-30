const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel.js");
const auth = require("../middleware/auth.js");
const { findAll, findById } = require("../utils/dbUtils");
const { roleCheck } = require("../middleware/roleCheck.js");

// Route to Get All Users, valid JWT token must be provided
// only users with role doctor is allowed to do this operation
router.get("/", auth, roleCheck("doctor"), (req, res) => {
  findAll(UserModel, {}, res);
});

// Route to Get User by ID, valid JWT token must be provided
// only users with role doctor is allowed to do this operation
router.get("/:id", auth, roleCheck("doctor"), (req, res) => {
  findById(UserModel, req.params.id, res);
});

module.exports = router;
