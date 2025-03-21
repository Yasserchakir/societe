const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// Middleware pour vérifier l'authentification de l'utilisateur
const auth = require("../middleware/auth");

// Obtenir les informations du profil
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Mettre à jour les informations du profil
router.put("/profile", auth, [
  check("name", "Name is required").not().isEmpty(),
  check("prenom", "Prenom is required").not().isEmpty(),
  check("email", "Please include a valid email").isEmail(),
  check("telephone", "Please include a valid telephone number").not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, prenom, email, telephone, avatar, city } = req.body;

    // Mettre à jour l'utilisateur
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Mettre à jour les champs
    user.name = name;
    user.prenom = prenom;
    user.email = email;
    user.telephone = telephone;
    user.avatar = avatar;
    user.city = city;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Supprimer un compte utilisateur
router.delete("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await user.remove();
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
