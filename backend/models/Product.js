const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  nomProduit: { type: String, required: true },
  descriptionProduit: { type: String, required: true },
  prixUnitaire: { type: Number, required: true, min: 0 },
  tva: { type: Number, required: true, enum: [0, 7, 13, 19] },
  prixTotal: { type: Number, required: true, min: 0 },
  imageUrl: [{ type: String }],
  quantiteDisponible: { type: Number, required: true, min: 0 },
  vendeur: { type: Schema.Types.ObjectId, ref: "User", required: true },
  statutProduit: { type: String, enum: ["Disponible", "Epuisé", "Retiré"], default: "Disponible" },
  promotion: { type: Schema.Types.ObjectId, ref: "Promotion", default: null },
  dateAjout: { type: Date, default: Date.now },

  // Clés étrangères
  idFamille: { type: Schema.Types.ObjectId, ref: "FamilleProduit", required: true },
  idSecteur: { type: Schema.Types.ObjectId, ref: "SecteurProduit", required: true } 

}, { timestamps: true });

// Middleware avant validation pour calculer prixTotal
productSchema.pre("validate", async function (next) {
  const prixUnitaire = this.prixUnitaire ?? 0;
  const tva = this.tva ?? 0;

  // Calcul du prix de base avec TVA
  this.prixTotal = prixUnitaire + (prixUnitaire * tva / 100);

  // Application de la promotion si disponible
  if (this.promotion) {
    try {
      const promo = await mongoose.model("Promotion").findById(this.promotion);
      if (promo && promo.active) {
        this.prixTotal -= (this.prixTotal * promo.reduction / 100);
      }
    } catch (err) {
      console.error("Erreur lors de l'application de la promotion:", err);
      return next(err);
    }
  }

  // Vérification finale
  if (isNaN(this.prixTotal) || this.prixTotal < 0) {
    this.prixTotal = prixUnitaire + (prixUnitaire * tva / 100); // Recalcul sans promotion si erreur
  }

  next();
});

// Vérification après enregistrement pour corriger le prixTotal si nécessaire
productSchema.post("save", async function (doc) {
  if (isNaN(doc.prixTotal) || doc.prixTotal <= 0) {
    const prixUnitaire = doc.prixUnitaire;
    const tva = doc.tva;
    doc.prixTotal = prixUnitaire + (prixUnitaire * tva / 100);
    await doc.save();
  }
});

module.exports = mongoose.model("Product", productSchema);
