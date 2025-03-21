const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController"); // Adjusted path
const authMiddleware = require("../middleware/authMiddleware");

router.post("/cart", authMiddleware, ordersController.addToCart);
router.get("/cart", authMiddleware, ordersController.getCart);
router.post("/cart/remove", authMiddleware, ordersController.removeFromCart);
router.post("/cart/update", authMiddleware, ordersController.updateCartQuantity);
router.post("/order", authMiddleware, ordersController.placeOrder);
router.get("/vendor", authMiddleware, ordersController.getVendorOrders);
router.post("/vendor/update", authMiddleware, ordersController.updateOrderStatus);

module.exports = router;