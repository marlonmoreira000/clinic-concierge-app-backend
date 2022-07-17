const express = require("express");
const router = express.Router();
const AppointmentModel = require("../models/appointmentModel");
const auth = require("../middleware/auth.js");
const { roleCheck, doctorCheck } = require("../middleware/roleCheck.js");
const { log } = require("console");
const DoctorModel = require("../models/doctorModel");
const { StatusCodes } = require("http-status-codes");
const {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
} = require("../utils/dbUtils");
const {
  createAppointmentRequestValidation,
} = require("../utils/validationSchema");

router.get("/", auth, (req, res) => {
  findAll(AppointmentModel, {}, res);
});

router.get("/:id", auth, (req, res) => {
  findById(AppointmentModel, req.params.id, res);
});

router.post("/", auth, roleCheck(["doctor"]), async (req, res) => {
  // Validate appointment request
  const { error } = createAppointmentRequestValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }
  const start_time = new Date(req.body.start_time);
  if (start_time < Date.now()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Appointment start date is in past" });
  }
  const end_time = new Date(req.body.end_time);
  if (end_time < Date.now()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Appointment end date is in past" });
  }
  if (end_time <= start_time) {
    return res.status(StatusCodes.BAD_REQUEST).send({
      error:
        "Appointment start time should be earlier than end time and start and end time cannot be equal.",
    });
  }
  //TODO: check appointment start_time not before other appointment end_time
  //TODO: check appointment end_time not after other appointment start_time

  const doctor = await DoctorModel.findOne({ user_id: req.user._id });
  const appointment = {
    doctor_id: doctor._id,
    appointment_slot: {
      start_time: new Date(req.body.start_time),
      end_time: new Date(req.body.end_time),
    },
  };
  log("appointment: %O", appointment);
  create(AppointmentModel, appointment, appointment, res);
});

router.put("/:id", auth, roleCheck(["doctor"]), (req, res) => {
  findByIdAndUpdate(AppointmentModel, req.params.id, req.body, res);
});

router.delete("/:id", auth, roleCheck(["doctor"]), async (req, res) => {
  const appointment = await AppointmentModel.findOne({ _id: req.params.id });

  if (!appointment) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: "Delete Appointment failed as appointment does not exist",
    });
  }

  if (appointment.booked) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Delete Appointment failed as it is already booked" });
  }

  AppointmentModel.deleteOne(appointment, (err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Delete Appointment failed" });
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  });
});

module.exports = router;
