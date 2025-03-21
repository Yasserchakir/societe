const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('./User'); // Ensure User model is registered

const familleProduitSchema = new Schema({
  nom: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const FamilleProduit = mongoose.model('FamilleProduit', familleProduitSchema);
module.exports = FamilleProduit;