const mongoose = require("mongoose");

const FamilleServiceSchema = new mongoose.Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const FamilleService = mongoose.models.FamilleService || mongoose.model("FamilleService", FamilleServiceSchema);

module.exports = FamilleService;