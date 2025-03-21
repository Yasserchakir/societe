const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createSociete,
  getAllSocietes,
  getSocieteById,
  updateSociete,
  deleteSociete,
} = require('../controllers/societeController');

router.post('/', authMiddleware, createSociete);
router.get('/', authMiddleware, getAllSocietes);
router.get('/:id', authMiddleware, getSocieteById);
router.put('/:id', authMiddleware, updateSociete);
router.delete('/:id', authMiddleware, deleteSociete);

module.exports = router;