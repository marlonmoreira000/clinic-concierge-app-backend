const express = require("express");
const router = express.Router();
const UserModel = require("../models/userModel.js");
const auth = require("../middleware/auth.js");
const { StatusCodes } = require("http-status-codes");

router.get("/", auth, (req, res) => {
  UserModel.find({}, (err, users) => {
    if (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ error: `Failed to get users: ${err}` });
    } else {
      res.status(StatusCodes.OK).send(users);
    }
  });
});

router.get("/:id", auth, (req, res) => {
  UserModel.findById(req.params.id, (err, user) => {
    if (err) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `Could not find user: ${req.params.id}` });
    } else {
      res.status(StatusCodes.OK).send(user);
    }
  });
});

module.exports = router;
