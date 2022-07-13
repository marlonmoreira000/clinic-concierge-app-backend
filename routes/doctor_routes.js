const express = require('express');
const router = express.Router();
const DoctorModel = require("../models/doctorModel")

router.get('/', async (req, res) => {
    res.send(await DoctorModel.find())
});

router.get("/:id", (req, res) => {
  DoctorModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(404).send({ error: `Could not find doctor: ${req.params.id}` });
    } else {
      res.send(doc);
    }
  });
});

router.post("/", (req, res) => {
  DoctorModel.create(req.body, (err, doc) => {
    if (err) {
      res.status(422).send({ error: err.message });
    } else {
      res.status(200).send(doc);
    }
  });
});

router.put("/:id", async (req, res) => {
  res.send(
    await DoctorModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", async (req, res) => {
  DoctorModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
