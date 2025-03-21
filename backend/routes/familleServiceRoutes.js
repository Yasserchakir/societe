const express = require("express");
const router = express.Router();
const FamilleServiceController = require("../controllers/familleServiceController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, FamilleServiceController.getAllFamilleServices);
router.get("/:id", authenticateToken, FamilleServiceController.getFamilleServiceById);
router.post("/", authenticateToken, FamilleServiceController.createFamilleService);
router.put("/:id", authenticateToken, FamilleServiceController.updateFamilleService);
router.delete("/:id", authenticateToken, FamilleServiceController.deleteFamilleService);

module.exports = router;