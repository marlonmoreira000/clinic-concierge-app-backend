const express = require('express');
const router = express.Router();
const DoctorModel = require("../models/doctorModel");
const UserModel = require("../models/userModel");
const auth = require("../middleware/auth.js");
const { log } = require("console");



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

router.post("/", auth, (req, res) => {
  DoctorModel.find({ user_id: req.user._id }).then(async(doctor) => {
    log("doctor: " + doctor[0]);
    if (doctor[0]) {
      log("doctor already exists, cannot recreate doctor");
      res
        .status(400)
        .send({ error: "Doctor profile already exists for user." });
    } else {
      ;
      log("creating doctor");
      DoctorModel.create({
        user_id: req.user._id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        experience: req.body.experience,
        speciality: req.body.speciality,
        bio: req.body.bio,
      })
      .then((newDoctor) => {
        log("Created new doctor");
        res.status(200).send(newDoctor);
      })
      .then(
        await UserModel.findById(req.user._id)
          .then((user) => {
            if (!user.roles.includes("doctor")) {
              user.updateOne(
                { roles: [...req.user.roles, "doctor"] },
                { returnDocument: "after" }
              );
            }  
          }
        )
      );
    }
  });
});


router.put("/:id", auth, async (req, res) => {
  res.send(
    await DoctorModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", auth, async (req, res) => {
  DoctorModel.findByIdAndDelete(req.params.id, () => res.sendStatus(204));
});

module.exports = router;
