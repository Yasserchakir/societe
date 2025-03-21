const express = require('express');
const Booking = require('../models/Reservation');
const router = express.Router();

// Réserver un service
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Obtenir toutes les réservations
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('serviceId').populate('userId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
