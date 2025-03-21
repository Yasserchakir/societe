const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./familleProduit'); // Ensure FamilleProduit model is registered

const secteurProduitSchema = new Schema({
  nomSecteur: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: false },
  description: { type: String, required: true },
  familleProduit: { type: Schema.Types.ObjectId, ref: 'FamilleProduit', required: true }
}, { timestamps: true });

const SecteurProduit = mongoose.model('SecteurProduit', secteurProduitSchema);
module.exports = SecteurProduit;