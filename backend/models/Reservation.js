const mongoose = require("mongoose");

const ReservationSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timeSlot: {
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
    },
    status: { type: String, enum: ["pending", "confirmed", "canceled"], default: "pending" },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Reservation || mongoose.model("Reservation", ReservationSchema);
