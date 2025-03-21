const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const FamilleProduitController = require("../controllers/familleProduitController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.get("/", authMiddleware, FamilleProduitController.getAllFamilleProduits);
router.get("/:id", authMiddleware, FamilleProduitController.getFamilleProduitById);
router.post("/", authMiddleware, upload.single("imageUrl"), FamilleProduitController.createFamilleProduit);
router.put("/:id", authMiddleware, upload.single("imageUrl"), FamilleProduitController.updateFamilleProduit);
router.delete("/:id", authMiddleware, FamilleProduitController.deleteFamilleProduit);

module.exports = router;