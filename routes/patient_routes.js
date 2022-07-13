const express = require("express");
const router = express.Router();
const PatientModel = require("../models/patientModel");

router.get("/", async (req, res) => {
  res.send(await PatientModel.find());
});

router.get("/:id", (req, res) => {
  PatientModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(404).send({ error: `Could not find Patient: ${req.params.id}` });
    } else {
      res.send(doc);
    }
  });
});

router.post("/", (req, res) => {
  PatientModel.create(req.body, (err, doc) => {
    if (err) {
      res.status(422).send({ error: err.message });
    } else {
      res.status(200).send(doc);
    }
  });
});

router.put("/:id", async (req, res) => {
  res.send(
    await PatientModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", async (req, res) => {
  PatientModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
