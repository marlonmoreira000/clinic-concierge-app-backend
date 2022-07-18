const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.js");
const roleCheck = require("../middleware/roleCheck.js");

const appointmentRoutes = require("./appointment_routes");
const bookingRoutes = require("./booking_routes");
const doctorRoutes = require("./doctor_routes");
const patientRoutes = require("./patient_routes");
const userRoutes = require("./user_routes");

router.use("/appointments", appointmentRoutes);
router.use("/bookings", bookingRoutes);
router.use("/doctors", doctorRoutes);
router.use("/patients", patientRoutes);
router.use("/users", userRoutes);

module.exports = router;