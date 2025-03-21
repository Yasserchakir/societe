// routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const reservationController = require('../controllers/reservationController');

// Public routes (no authentication required)
router.get('/public', reservationController.getAllReservations);
router.get('/public/:id', reservationController.getReservationById);

// Authenticated routes (require authMiddleware)
router.get('/', reservationController.getAllReservations);
router.get('/:id', authMiddleware, reservationController.getReservationById);
router.post('/', authMiddleware,reservationController.createReservation);
router.put('/:id', reservationController.updateReservation);
router.delete('/:id', authMiddleware, reservationController.deleteReservation);

module.exports = router;