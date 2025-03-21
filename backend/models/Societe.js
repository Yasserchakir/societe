const mongoose = require('mongoose');

const SocieteSchema = new mongoose.Schema({
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  typeVendeur: {
    type: String, 
    enum: ['Personne physique', 'Société'], 
    required: true
  },
  nomEntreprise: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Société'; } 
  },
  nomVendeur: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Personne physique'; } 
  },
  numeroEnregistrement: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Société'; } 
  },
  secteurActivite: { type: String, required: true },
  description: { type: String, required: true },
  nomResponsable: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Société'; } 
  },
  email: { 
    type: String, 
    required: true, 
    match: [/\S+@\S+\.\S+/, 'Veuillez entrer une adresse email valide.'] 
  },
  numeroTelephone: { type: String, required: true },
  adresseEntreprise: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Société'; } 
  },
  adresseCorrespondance: { type: String },
  statutJuridique: { 
    type: String, 
    required: function() { return this.typeVendeur === 'Société'; } 
  },
  ribIban: { type: String, required: true },
  methodesPaiement: { 
    type: [String], 
    enum: ['Carte bancaire', 'Cash'], 
    required: true 
  }
}, { timestamps: true });

// Assigner adresseCorrespondance si non fournie
SocieteSchema.pre('save', function(next) {
  if (!this.adresseCorrespondance || this.adresseCorrespondance.trim() === '') {
    this.adresseCorrespondance = this.adresseEntreprise;
  }
  next();
});

module.exports = mongoose.model('Societe', SocieteSchema);