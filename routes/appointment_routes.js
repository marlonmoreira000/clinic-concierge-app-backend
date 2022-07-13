const express = require("express");
const router = express.Router();
const AppointmentModel = require("../models/appointmentModel");

router.get("/", async (req, res) => {
  res.send(await AppointmentModel.find());
});

router.get("/:id", (req, res) => {
  AppointmentModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(404).send({ error: `Could not find Appointment: ${req.params.id}` });
    } else {
      res.send(doc);
    }
  });
});

router.post("/", (req, res) => {
  AppointmentModel.create(req.body, (err, doc) => {
    if (err) {
      res.status(422).send({ error: err.message });
    } else {
      res.status(200).send(doc);
    }
  });
});

router.put("/:id", async (req, res) => {
  res.send(
    await AppointmentModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", async (req, res) => {
  AppointmentModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
