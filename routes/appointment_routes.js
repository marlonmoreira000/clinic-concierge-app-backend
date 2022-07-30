const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const { roleCheck } = require("../middleware/roleCheck.js");
const AppointmentModel = require("../models/appointmentModel");
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

router.get("/", auth, async (req, res) => {
  const query = {};
  const fromTime = req.query.fromTime;
  if (fromTime) {
    query["appointment_slot.start_time"] = {
      $gte: req.query.fromTime,
    };
  }
  const toTime = req.query.toTime;
  if (toTime) {
    query["appointment_slot.end_time"] = {
      $lt: new Date(req.query.toTime),
    };
  }
  const booked = req.query.booked;
  if (booked || booked === false) {
    query["booked"] = booked;
  }
  const doctorId = req.query.doctorId;
  if (doctorId) {
    query["doctor_id"] = doctorId;
  }
  const userId = req.query.userId;
  if (userId) {
    const doc = await DoctorModel.findOne({ user_id: userId });
    if (doc) {
      query["doctor_id"] = doc._id;
    } else {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: true, message: "Doctor not found for given userId." });
    }
  }

  const sortBy = {
    doctor_id: 1,
    "appointment_slot.start_time": 1,
  };
  findAll(AppointmentModel, query, res, sortBy);
});

router.get("/:id", auth, (req, res) => {
  findById(AppointmentModel, req.params.id, res);
});

router.post("/", auth, async (req, res) => {
  // Validate appointment request
  const { error } = createAppointmentRequestValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }
  const start_time = new Date(req.body.start_time);
  if (start_time < Date.now()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: `Appointment start date is in past.`,
    });
  }
  const end_time = new Date(req.body.end_time);
  if (end_time < Date.now()) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: `Appointment end date is in past.`,
    });
  }
  if (end_time <= start_time) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: `Appointment start time should be earlier than end time and start and end time cannot be equal.`,
    });
  }

  const doctor = await DoctorModel.findOne({ user_id: req.user._id });
  if (!doctor) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message:
        "Cannot create appointment as failed to find doctor associated with this request.",
    });
  }
  const appointment = {
    doctor_id: doctor._id,
    appointment_slot: {
      start_time: new Date(req.body.start_time),
      end_time: new Date(req.body.end_time),
    },
  };
  create(AppointmentModel, appointment, appointment, res);
});

router.put("/:id", auth, roleCheck("doctor"), (req, res) => {
  findByIdAndUpdate(AppointmentModel, req.params.id, req.body, res);
});

router.delete("/:id", auth, roleCheck("doctor"), async (req, res) => {
  const appointment = await AppointmentModel.findOne({ _id: req.params.id });

  if (!appointment) {
    return res.status(StatusCodes.NOT_FOUND).json({
      error: true,
      message: `Delete Appointment failed as appointment does not exist`,
    });
  }

  if (appointment.booked) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: `Delete Appointment failed as it is already booked`,
    });
  }

  AppointmentModel.deleteOne(appointment, (err) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Delete Appointment failed for appointmentId: ${req.params.id}`,
      });
    }
    res.sendStatus(StatusCodes.NO_CONTENT);
  });
});

module.exports = router;
