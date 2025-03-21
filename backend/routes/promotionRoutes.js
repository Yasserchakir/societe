// routes/promotionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotionController');

// Routes with authMiddleware
router.post('/', authMiddleware, createPromotion);
router.get('/', authMiddleware, getPromotions);
router.put('/:id', authMiddleware, updatePromotion);
router.delete('/:id', authMiddleware, deletePromotion);

module.exports = router;