// models/Comment.js
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5, default: 0 }, // Allow decimals
  date: { type: Date, default: Date.now },
  reply: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    date: { type: Date, default: Date.now },
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who liked
});

module.exports = mongoose.model("Comment", commentSchema);