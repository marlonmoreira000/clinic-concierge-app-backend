const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const { roleCheck } = require("../middleware/roleCheck.js");
const BookingModel = require("../models/bookingModel");
const AppointmentModel = require("../models/appointmentModel");
const PatientModel = require("../models/patientModel");
const { StatusCodes } = require("http-status-codes");
const { findAll, findById, findByIdAndUpdate } = require("../utils/dbUtils");
const { createBookingRequestValidation } = require("../utils/validationSchema");

router.get("/", auth, async (req, res) => {
  const query = {};
  const patientId = req.query.patientId;
  if (patientId) {
    query["patient_id"] = patientId;
  }

  const userId = req.query.userId;
  if (userId) {
    const pat = await PatientModel.findOne({ user_id: userId });
    if (pat) {
      query["patient_id"] = pat._id;
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: true, message: 'Patient not found for given userId.' });
    }
  }

  const attended = req.query.attended;
  if (attended || attended === false) {
    query["attended"] = attended;
  }
  const feePaid = req.query.feePaid;
  if (feePaid || feePaid === false) {
    query["fee_paid"] = feePaid;
  }
  const sortBy = {
    patient_id: 1,
    appointment_id: 1,
  };

  findAll(BookingModel, query, res, sortBy);
});

router.get("/:id", auth, (req, res) => {
  findById(BookingModel, req.params.id, res);
});

router.post("/", auth, roleCheck("patient"), async (req, res) => {
  // Validate appointment request
  const { error } = createBookingRequestValidation(req.body);
  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: true, message: error.message });
  }
  const appointment = await AppointmentModel.findOne({
    _id: req.body.appointment_id,
  });
  if (!appointment) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: "Failed to create booking as invalid appointment id provided",
    });
  }

  const patientQuery = req.body.patient_id
    ? { _id: req.body.patient_id }
    : { user_id: req.user._id };

  const patient = await PatientModel.findOne(patientQuery);
  if (!patient) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: true,
      message: "Failed to create booking as invalid patient id provided",
    });
  }

  const booking = {
    appointment_id: appointment,
    patient_id: patient,
    attended: req.body.attended,
    fee_paid: req.body.fee_paid,
    reason_for_visit: req.body.reason_for_visit,
  };
  BookingModel.findOne({
    appointment_id: appointment,
    patient_id: patient,
  })
    .then((existingDoc) => {
      if (existingDoc) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: true,
          message: `Booking already exist, cannot recreate it`,
        });
      }

      BookingModel.create(booking).then(async (doc) => {

        const apppointmentUpdate = {
          booked: true,
          booked_by: patient,
        };

        const appointmentId = appointment.id;
        AppointmentModel.findByIdAndUpdate(
          appointmentId,
          apppointmentUpdate
        ).then((appt) => {
          return res.status(StatusCodes.CREATED).json(doc);
        });
      });
    })
    .catch((error) => {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to create Booking`,
      });
    });
});

router.put("/:id", auth, (req, res) => {
  findByIdAndUpdate(BookingModel, req.params.id, req.body, res);
});

router.delete("/:id", auth, (req, res) => {
  const bookingId = req.params.id;
  BookingModel.findById(bookingId, async (err, booking) => {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to delete Booking with id: ${bookingId}`,
      });
    }

    if (!booking) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: `Failed to delete Booking as booking with id: ${bookingId} does not exist`,
      });
    }
    const appointment = await AppointmentModel.findByIdAndUpdate(
      booking.appointment_id,
      {
        booked: false,
        booked_by: null,
      }
    );
    if (!appointment) {
      
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: true,
        message: `Failed to delete Booking with id: ${bookingId}`,
      });
    }
   

    await BookingModel.findByIdAndDelete(bookingId);
    res.sendStatus(StatusCodes.NO_CONTENT);
  });
});

module.exports = router;
