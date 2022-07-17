const express = require("express");
const router = express.Router();
const AppointmentModel = require("../models/appointmentModel");
const auth = require("../middleware/auth.js");
const { roleCheck, doctorCheck } = require("../middleware/roleCheck.js");
const { log } = require("console");
const DoctorModel = require("../models/doctorModel");
const { StatusCodes } = require("http-status-codes");

router.get("/", auth, async (req, res) => {
  res.status(StatusCodes.OK).send(await AppointmentModel.find());
});

router.get("/:id", auth, (req, res) => {
  AppointmentModel.findById(req.params.id, (err, patient) => {
    if (err) {
      res
        .status(StatusCodes.NOT_FOUND)
        .send({ error: `Could not find Appointment: ${req.params.id}` });
    } else {
      res.status(StatusCodes.OK).send(patient);
    }
  });
});

// router.post("/",auth, (req, res) => {
//   AppointmentModel.create({ doctor_id: req.user._id }, (err, doc) => {
//     if (err) {
//       res.status(422).send({ error: err.message });
//     } else {
//       res.status(200).send(doc);
//     }
//   });
// });
//router.post("/", auth,async (req, res) => {
// AppointmentModel.find({ user_id: req.user._id }).then(async (doctor) => {
//   log("doctor: " + doctor[0]);
//   if (doctor[0]) {
//     log("doctor already exists, cannot recreate doctor");
//     res
//       .status(400)
//       .send({ error: "Doctor profile already exists for user." });
//   } else {
// log("creating appointment");
// AppointmentModel.create({
//   doctor_id: req.user._id,
//   appointment_slot: {
//     start_time: new Date(req.body.appointment_slot.start_time),
//     end_time: new Date(req.body.appointment_slot.end_time)
//   },
//   booked:false
// })
// .then((newAppointment) => {
//   log("Created new Appointment");
//   res.status(200).send(newAppointment);
// })
// .then(async (newAppointment) => {
//   await DoctorModel.find({ user_id: req.user._id })
//     .then((doctor) => {
//       doctor.updateOne(
//         { appointments: [...doctor.appointments, newAppointment._id] },
//         { returnDocument: "after" }
//       )
//     });
//   res.status(200).send(newAppointment);
// })
//});

router.post("/", auth, async (req, res) => {
  if (!req.body.start_time) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Appointment start_time is required but not provided." });
    return;
  }
  const start_time = new Date(req.body.start_time);
  if (start_time < Date.now()) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Appointment start date is in past" });
    return;
  }
  if (!req.body.end_time) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Appointment end_time is required but not provided." });
    return;
  }
  const end_time = new Date(req.body.end_time);
  if (end_time < Date.now()) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ error: "Appointment end date is in past" });
    return;
  }
  if (end_time <= start_time) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({
        error:
          "Appointment start time should be earlier than end time and start and end time cannot be equal.",
      });
    return;
  }

  const appointment_slot = {
    start_time: new Date(req.body.start_time),
    end_time: new Date(req.body.end_time),
  };

  const appointment = {
    doctor_id: req.user._id,
    appointment_slot: appointment_slot,
  };
  log("appointment: %O", appointment);

  //TODO: check appointment start_time notbefore other appointment end_time
  //TODO: check appointment end_time not after other appointment start_time

  AppointmentModel.find(appointment).then((existingAppointment) => {
    log(existingAppointment[0]);
    if (existingAppointment[0]) {
      log("appointment already exists, cannot recreate appointment");
      res
        .status(StatusCodes.BAD_REQUEST)
        .send({ error: "Appointment already exists for doctor." });
    } else {
      appointment["booked_by"] = null;
      log("creating appointment: " + appointment);
      AppointmentModel.create(appointment).then((newAppointment) => {
        log(`created new appointment: ${newAppointment}`);
        res.status(StatusCodes.OK).send(newAppointment);
      });
    }
  });
});

router.put("/:id", auth, roleCheck(["doctor"]), async (req, res) => {
  res.send(
    await AppointmentModel.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
  );
});

router.delete("/:id", auth, async (req, res) => {
  AppointmentModel.findByIdAndDelete(req.params.id, () =>
    res.sendStatus(StatusCodes.NO_CONTENT)
  );
});

module.exports = router;
