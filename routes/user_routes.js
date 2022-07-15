const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel.js");
const auth = require("../middleware/auth.js");

router.get("/", auth, async (req, res) => {
  res.send(await UserModel.find());
});

router.get("/:id", (req, res) => {
  UserModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res
        .status(404)
        .send({ error: `Could not find doctor: ${req.params.id}` });
    } else {
      res.send(doc);
    }
  });
});

module.exports = router;