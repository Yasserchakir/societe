const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const SecteurProduitController = require("../controllers/secteurProduitController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get("/", authMiddleware, SecteurProduitController.getAllSecteurProduits);
router.get("/famille/:familleId", authMiddleware, SecteurProduitController.getSecteurProduitsByFamille); // New route
router.get("/:id", authMiddleware, SecteurProduitController.getSecteurProduitById);
router.post("/", authMiddleware, upload.single("imageUrl"), SecteurProduitController.createSecteurProduit);
router.put("/:id", authMiddleware, upload.single("imageUrl"), SecteurProduitController.updateSecteurProduit);
router.delete("/:id", authMiddleware, SecteurProduitController.deleteSecteurProduit);

module.exports = router;