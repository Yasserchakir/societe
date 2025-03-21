const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  nomPromotion: { type: String, required: true },
  description: { type: String, required: true },
  reduction: { type: Number, required: true, min: 1, max: 100 },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  active: { type: Boolean, default: true },
  vendeur: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Only Vendeur can add promotions
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }] // Link to the product
});

module.exports = mongoose.model("Promotion", PromotionSchema);
