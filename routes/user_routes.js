const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel.js");
const auth = require("../middleware/auth.js");
const { findAll, findById } = require("../utils/dbUtils");

router.get("/", auth, (req, res) => {
  findAll(UserModel, {}, res);
});

router.get("/:id", auth, (req, res) => {
  findById(UserModel, req.params.id, res);
});

module.exports = router;
