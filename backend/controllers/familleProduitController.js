const FamilleProduit = require("../models/familleProduit");
exports.getAllFamilleProduits = async (req, res) => {
  try {
    console.log("Fetching famille produits for user:", req.user?._id || "No user");
    const familleProduits = await FamilleProduit.find().populate("createdBy", "name prenom");
    console.log("Famille produits fetched:", familleProduits);
    if (!familleProduits || familleProduits.length === 0) {
      console.log("No product families found in database.");
      return res.status(404).json({ message: "Aucune famille de produits trouvée." });
    }
    res.status(200).json(familleProduits);
  } catch (error) {
    console.error("Erreur serveur lors de la récupération des familles de produits:", error);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer.", error: error.message });
  }
};

exports.getFamilleProduitById = async (req, res) => {
  try {
    const familleProduit = await FamilleProduit.findById(req.params.id).populate("createdBy", "name prenom");
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json(familleProduit);
  } catch (error) {
    console.error("Server error fetching famille produit by ID:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.createFamilleProduit = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    const { nom, description } = req.body;
    const createdBy = req.user._id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!nom || !description) {
      return res.status(400).json({ message: "Nom and description are required" });
    }

    const newFamilleProduit = new FamilleProduit({
      nom,
      description,
      imageUrl,
      createdBy,
    });

    await newFamilleProduit.save();
    res.status(201).json(newFamilleProduit);
  } catch (error) {
    console.error("Error occurred creating famille produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.updateFamilleProduit = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    const { nom, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const familleProduit = await FamilleProduit.findByIdAndUpdate(
      req.params.id,
      { nom, description, imageUrl: imageUrl || "" },
      { new: true, runValidators: true }
    );
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json(familleProduit);
  } catch (error) {
    console.error("Server error updating famille produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.deleteFamilleProduit = async (req, res) => {
  try {
    const familleProduit = await FamilleProduit.findByIdAndDelete(req.params.id);
    if (!familleProduit) {
      return res.status(404).json({ message: "FamilleProduit not found" });
    }
    res.status(200).json({ message: "FamilleProduit deleted successfully" });
  } catch (error) {
    console.error("Server error deleting famille produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};