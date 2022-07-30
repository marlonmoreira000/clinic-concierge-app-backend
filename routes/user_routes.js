const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel.js");
const auth = require("../middleware/auth.js");
const { findAll, findById } = require("../utils/dbUtils");
const { roleCheck } = require("../middleware/roleCheck.js");


router.get("/", auth, roleCheck("doctor"), (req, res) => {
  findAll(UserModel, {}, res);
});

router.get("/:id", auth, roleCheck("doctor"), (req, res) => {
  findById(UserModel, req.params.id, res);
});

module.exports = router;
