const express = require("express");
const router = express.Router();
const { log } = require("console");
const auth = require("../middleware/auth.js");
const { roleCheck } = require("../middleware/roleCheck.js");
const BookingModel = require("../models/bookingModel");
const AppointmentModel = require("../models/appointmentModel");
const PatientModel = require("../models/patientModel");
const { StatusCodes } = require("http-status-codes");
const {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findByIdAndDelete,
} = require("../utils/dbUtils");
const { createBookingRequestValidation } = require("../utils/validationSchema");

router.get("/", (req, res) => {
  log("query parameters: %O", req.query);
  const query = {};
  const patientId = req.query.patientId;
  if (patientId) {
    query["patient_id"] = patientId;
  }
  const attended = req.query.attended;
  if (attended || attended === false) {
    query["attended"] = attended;
  }
  const feePaid = req.query.feePaid;
  if (feePaid || feePaid === false) {
    query["fee_paid"] = feePaid;
  }
  log("query: %O", query);
  findAll(BookingModel, query, res);
});

router.get("/:id", (req, res) => {
  findById(BookingModel, req.params.id, res);
});

router.post("/", async (req, res) => {
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

  const query = {
    appointment_id: appointment,
    patient_id: patient,
  };
  const booking = {
    appointment_id: appointment,
    patient_id: patient,
    attended: req.body.attended,
    fee_paid: req.body.fee_paid,
    reason_for_visit: req.body.reason_for_visit,
  };
  log("booking: %O", booking);

  log(`Creating Booking`);
  BookingModel.findOne(query)
    .then((existingDoc) => {
      if (existingDoc) {
        log(`Booking already exist, cannot recreate it`);
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Booking already exist, cannot recreate it`,
        });
      }

      BookingModel.create(booking)
        .then(async (doc) => {
          log(`Booking created successfully`);

          const apppointmentUpdate = {
            booked: true,
            booked_by: patient,
          };

          const appointmentId = appointment.id;
          log(`Updating appointment with id: ${appointmentId}`);
          AppointmentModel.findByIdAndUpdate(
            appointmentId,
            apppointmentUpdate
          ).then((appt) => {
            log(
              `Appointment with id: ${appointmentId} updated successfully, updated appointment details: ${appt}`
            );
          });
          return res.status(StatusCodes.CREATED).json(doc);
        })
        .catch((error) => {
          log(`Failed to create Booking: ${error}`);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: `Failed to create Booking`,
          });
        });
    })
    .catch((error) => {
      log(`Failed to create Booking: ${error}`);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: `Failed to create Booking`,
      });
    });
});

router.put("/:id", async (req, res) => {
  findByIdAndUpdate(BookingModel, req.params.id, req.body, res);
});

router.delete("/:id", async (req, res) => {
  findByIdAndDelete(BookingModel, req.params.id, res);
});

module.exports = router;
