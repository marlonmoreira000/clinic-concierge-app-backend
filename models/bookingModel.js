const mongoose = require("./connection");

const bookingSchema = new mongoose.Schema(
  {
    // appointment_id is required to check specific appointment details.
    appointment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "appointment",
      required: true,
    }, // doctor_id is required to check which doctor is available for this appointment.
    patient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "patient",
      required: true,
    },
    // Current booking status or availability status of the appointment
    attended: {
      type: Boolean,
      required: true,
      default: false,
    },
    // to check whether the patient has paid the fee for the appointment- optional
    fee_paid: {
      type: Boolean,
      required: true,
      default: false,
    },
    // 'Reason for visiting doctor' - optional
    reason_for_visit: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const bookingModel = mongoose.model("Booking", bookingSchema);

module.exports = bookingModel;
