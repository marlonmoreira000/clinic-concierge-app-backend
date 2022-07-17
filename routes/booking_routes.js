const express = require("express");
const router = express.Router();
const { log } = require("console");
const auth = require("../middleware/auth.js");
const BookingModel = require("../models/bookingModel");
const AppointmentModel = require("../models/appointmentModel");
const { findAll, findById } = require("../utils/dbUtils");

router.get("/", auth, (req, res) => {
  findAll(BookingModel, {}, res);
});

router.get("/:id", auth, (req, res) => {
  findById(BookingModel, req.params.id, res);
});

router.post("/", (req, res) => {
  BookingModel.create({ patient_id: req.user._id }, req.body, (err, doc) => {
    if (err) {
      res.status(422).send({ error: err.message });
    } else {
      res.status(200).send(doc);
    }
  });
});

router.put("/:id", async (req, res) => {
  res.send(
    await BookingModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", async (req, res) => {
  BookingModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
