const mongoose = require("./connection");

const bookingSchema = new mongoose.Schema({
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
    // Appointment Slot defines the date and time of the appoinment
    appointment_slot: {
        type: Date,
        required: true,
    },
    // Appointment time
    // appointment_time: {
    //   type: Number,
    //   required: true,
    // },
    // Current booking status or availability status of the appointment
    attended: {
        type: Boolean,
        required: true,
        default: false,
    },
    // 'Reason for visiting doctor' - optional
    fee_status: {
        type: Boolean,
        required: true,
        default: false
    
    },

},
{
    timestamps: true,
},
);

const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
