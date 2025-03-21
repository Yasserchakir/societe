const express = require("express");
const router = express.Router();
const SecteurServiceController = require("../controllers/secteurServiceController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", authenticateToken, SecteurServiceController.getAllSecteurServices);
router.get("/famille/:familleId", authenticateToken, SecteurServiceController.getSecteurServicesByFamille);
router.get("/:id", authenticateToken, SecteurServiceController.getSecteurServiceById);
router.post("/", authenticateToken, SecteurServiceController.createSecteurService); // Removed upload here
router.put("/:id", authenticateToken, SecteurServiceController.updateSecteurService); // Removed upload here
router.delete("/:id", authenticateToken, SecteurServiceController.deleteSecteurService);

module.exports = router;