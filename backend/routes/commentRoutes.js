const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");
const Product = require("../models/Product");
const jwt = require("jsonwebtoken");

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (err) {
    console.error("Token Verification Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// POST: Add a comment (Client or Vendor)
router.post("/products/:productId/comments", authenticateToken, async (req, res) => {
  const { content, rating } = req.body;
  const { productId } = req.params;

  console.log("POST /comments Request:", { productId, content, rating, userId: req.userId });

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.userRole !== "Client" && req.userRole !== "Vendeur") {
      return res.status(403).json({ message: "Only clients or vendors can comment" });
    }

    const comment = new Comment({
      product: productId,
      user: req.userId,
      content,
      rating: parseFloat(rating),
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    console.error("Error Saving Comment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Reply to a comment (Vendor only, product owner)
router.post("/comments/:commentId/reply", authenticateToken, async (req, res) => {
  const { content } = req.body;
  const { commentId } = req.params;

  if (req.userRole !== "Vendeur") {
    return res.status(403).json({ message: "Only vendors can reply" });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const product = await Product.findById(comment.product);
    if (product.vendeur.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only reply to comments on your products" });
    }

    comment.reply = { user: req.userId, content, date: Date.now() };
    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    console.error("Error Saving Reply:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT: Update a comment (Client or Vendor, must be the author)
router.put("/comments/:commentId", authenticateToken, async (req, res) => {
  const { content, rating } = req.body;
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.userRole !== "Admin" && comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only update your own comments" });
    }

    comment.content = content || comment.content;
    comment.rating = rating ? parseFloat(rating) : comment.rating;
    await comment.save();

    res.status(200).json(comment);
  } catch (err) {
    console.error("Error Updating Comment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// DELETE: Delete a comment (Client/Vendor author or Admin)
router.delete("/comments/:commentId", authenticateToken, async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (req.userRole !== "Admin" && comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "You can only delete your own comments" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error Deleting Comment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST: Like a comment (Client or Vendor)
router.post("/comments/:commentId/like", authenticateToken, async (req, res) => {
  const { commentId } = req.params;

  if (req.userRole !== "Client" && req.userRole !== "Vendeur") {
    return res.status(403).json({ message: "Only clients or vendors can like comments" });
  }

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.likes.includes(req.userId)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== req.userId); // Unlike
    } else {
      comment.likes.push(req.userId); // Like
    }

    await comment.save();
    res.status(200).json(comment);
  } catch (err) {
    console.error("Error Liking Comment:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET: Fetch comments for a product
router.get("/products/:productId/comments", async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ product: productId })
      .populate("user", "name prenom avatar")
      .populate("reply.user", "name prenom avatar");
    res.status(200).json(comments);
  } catch (err) {
    console.error("Error Fetching Comments:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;