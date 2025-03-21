const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Multer - Setting upload destination to uploads/");
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`;
    console.log("Multer - Generated filename:", filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /^image\//; // Only images as per schema
  if (allowedTypes.test(file.mimetype)) {
    console.log("Multer - File type accepted:", file.mimetype);
    cb(null, true);
  } else {
    console.log("Multer - File type rejected:", file.mimetype);
    cb(new Error("Only image files are allowed."), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 50, files: 5 }, // 50MB, max 5 files
});

// Public routes
router.get("/public", (req, res, next) => {
  console.log("GET /public - Fetching public products");
  productsController.getProducts(req, res, next);
});

router.get("/public/:id", (req, res, next) => {
  console.log("GET /public/:id - Fetching public product by ID:", req.params.id);
  productsController.getProductById(req, res, next);
});

router.get("/public/seller/:sellerId", (req, res, next) => {
  console.log("GET /public/seller/:sellerId - Fetching public products for seller ID:", req.params.sellerId);
  productsController.getPublicProductsBySellerId(req, res, next);
});

// Authenticated routes
router.post("/", authMiddleware, upload.array("imageUrl", 5), (req, res, next) => {
  console.log("POST / - Creating product after authMiddleware");
  productsController.createProduct(req, res, next);
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("GET / - Fetching products for authenticated user:", req.user._id);
    const products = await Product.find({ vendeur: req.user._id })
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom"); // Added idSecteur population
    console.log(
      "GET / - Products fetched:",
      products.map((p) => ({ id: p._id, nomProduit: p.nomProduit, imageUrl: p.imageUrl }))
    );
    res.json(products);
  } catch (error) {
    console.error("GET / - Error fetching products for user:", error);
    res.status(500).json({ message: "Error fetching user's products", error: error.message });
  }
});

router.get("/:id", authMiddleware, (req, res, next) => {
  console.log("GET /:id - Fetching product by ID:", req.params.id);
  productsController.getProductById(req, res, next);
});

router.put("/:id", authMiddleware, upload.array("imageUrl", 5), (req, res, next) => {
  console.log("PUT /:id - Updating product with ID:", req.params.id);
  productsController.updateProduct(req, res, next);
});

router.delete("/:id", authMiddleware, (req, res, next) => {
  console.log("DELETE /:id - Deleting product with ID:", req.params.id);
  productsController.deleteProduct(req, res, next);
});

router.get("/seller/:sellerId", authMiddleware, (req, res, next) => {
  console.log("GET /seller/:sellerId - Fetching products for seller ID:", req.params.sellerId);
  productsController.getProductsBySellerId(req, res, next);
});

module.exports = router;