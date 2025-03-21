const mongoose = require("mongoose");

const SecteurServiceSchema = new mongoose.Schema({
  nomSecteur: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  description: { type: String, required: true },
  familleService: { type: mongoose.Schema.Types.ObjectId, ref: "FamilleService", required: true },
}, { timestamps: true });

module.exports = mongoose.models.SecteurService || mongoose.model("SecteurService", SecteurServiceSchema);