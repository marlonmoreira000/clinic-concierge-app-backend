const express = require("express");
const router = express.Router();
const BookingModel = require("../models/bookingModel");

router.get("/", async (req, res) => {
  res.send(await BookingModel.find());
});

router.get("/:id", (req, res) => {
  BookingModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(404).send({ error: `Could not find Booking: ${req.params.id}` });
    } else {
      res.send(doc);
    }
  });
});

router.post("/", (req, res) => {
  BookingModel.create(req.body, (err, doc) => {
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
