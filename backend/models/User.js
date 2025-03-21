const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "Client", "Vendeur"] },
  avatar: { type: String },
  city: { type: String, required: true }, // New field for city
  telephone: { type: String, required: true } // New field for telephone
});

module.exports = mongoose.model("User", UserSchema);
