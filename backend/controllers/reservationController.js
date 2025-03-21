 
const Reservation = require('../models/Reservation');
const Service = require('../models/Service');

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate('service', 'servicename price')
      .populate('user', 'name prenom');
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ message: "Error fetching reservations", error: error.message });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('service', 'servicename price')
      .populate('user', 'name prenom');
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Error fetching reservation:", error);
    res.status(500).json({ message: "Error fetching reservation", error: error.message });
  }
};

exports.createReservation = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing or invalid" });
    }

    const { serviceId, timeSlot } = req.body;

    if (!serviceId || !timeSlot || !timeSlot.date || !timeSlot.startTime || !timeSlot.endTime) {
      return res.status(400).json({ message: "serviceId and complete timeSlot are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 🔹 Utiliser directement le créneau sans vérification
    const formattedDate = new Date(timeSlot.date).toISOString();
    const bookedSlot = {
      date: formattedDate,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime
    };

    const newReservation = new Reservation({
      service: serviceId,
      user: req.user._id,
      timeSlot: bookedSlot,
     });

    await newReservation.save();
    const populatedReservation = await Reservation.findById(newReservation._id)
      .populate("service", "servicename price")
      .populate("user", "name prenom");

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ message: "Error creating reservation", error: error.message });
  }
};
exports.updateReservation = async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = {};
    if (status) updateData.status = status;

    const updatedReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('service', 'servicename price')
      .populate('user', 'name prenom');

    if (!updatedReservation) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json(updatedReservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ message: "Error updating reservation", error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    // Optional: Free up the time slot in the Service
    const service = await Service.findById(reservation.service);
    if (service) {
      const slot = service.availableTimeSlots.find(s =>
        s.date.toISOString() === reservation.timeSlot.date.toISOString() &&
        s.startTime === reservation.timeSlot.startTime &&
        s.endTime === reservation.timeSlot.endTime
      );
      if (slot) {
        slot.isBooked = false;
        await service.save();
      }
    }

    await Reservation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ message: "Error deleting reservation", error: error.message });
  }
};

module.exports = exports;