// routes/serviceRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const serviceController = require('../controllers/serviceController');

// Public routes (no authentication required)
router.get('/public', serviceController.getAllServices);
router.get('/public/:id', serviceController.getServiceById);

// Authenticated routes (require authMiddleware)
router.get('/', serviceController.getAllServices);
router.get('/:id', authMiddleware, serviceController.getServiceById);
router.post('/', authMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);
router.post('/:id/generate-time-slots', authMiddleware, serviceController.generateTimeSlots);

module.exports = router;