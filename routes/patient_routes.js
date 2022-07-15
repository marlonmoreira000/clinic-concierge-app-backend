const express = require("express");
const router = express.Router();
const PatientModel = require("../models/patientModel");
const auth = require("../middleware/auth.js");
const { log } = require("console");


router.get("/", auth, async (req, res) => {
  res.send(await PatientModel.find());
});

router.get("/:id",auth, (req, res) => {
  PatientModel.findById(req.params.id, (err, doc) => {
    if (err) {
      res.status(404).send({ error: `Could not find Patient: ${req.params.id}` });
    } else {
      res.status(200).send(doc);
    }
  });
});

router.post("/", auth, async(req, res) => {
  
  log("user id: " + req.user._id);
  PatientModel.find({ user_id: req.user._id })
    .then(patient => {
      log("patient: " + patient[0]);
      if (patient[0]) {
        log("patient already exists, cannot recreate patient");
        res.status(400).send({ error: "Patient profile already exists for user." });
      } else {
        log("creating patient");
        PatientModel.create({
          user_id: req.user._id,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          contact_number: req.body.contact_number,
          address: req.body.address,
          gender: req.body.gender,
          age: req.body.age,
        }).then(newPatient => {
          log("Created new patient");
          res.status(200).send(newPatient);
        });
      }
    });  
  });

router.put("/:id", auth, async (req, res) => {
  res.send(
    await PatientModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id",auth, async (req, res) => {
  await PatientModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
