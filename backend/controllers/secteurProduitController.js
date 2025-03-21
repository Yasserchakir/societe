const SecteurProduit = require("../models/secteurProduit");

exports.getAllSecteurProduits = async (req, res) => {
  try {
    console.log("Fetching secteur produits for user:", req.user?._id || "No user");
    const secteurProduits = await SecteurProduit.find().populate("familleProduit", "nom");
    if (!secteurProduits || secteurProduits.length === 0) {
      return res.status(404).json({ message: "No product sectors found." });
    }
    res.status(200).json(secteurProduits);
  } catch (error) {
    console.error("Server error fetching secteur produits:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

// New controller to fetch SecteurProduits by FamilleProduit ID
exports.getSecteurProduitsByFamille = async (req, res) => {
  try {
    const { familleId } = req.params;
    const secteurProduits = await SecteurProduit.find({ familleProduit: familleId }).populate("familleProduit", "nom");
    if (!secteurProduits || secteurProduits.length === 0) {
      return res.status(404).json({ message: "No sectors found for this family." });
    }
    res.status(200).json(secteurProduits);
  } catch (error) {
    console.error("Server error fetching secteur produits by famille:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.getSecteurProduitById = async (req, res) => {
  try {
    const secteurProduit = await SecteurProduit.findById(req.params.id).populate("familleProduit", "nom");
    if (!secteurProduit) {
      return res.status(404).json({ message: "SecteurProduit not found" });
    }
    res.status(200).json(secteurProduit);
  } catch (error) {
    console.error("Server error fetching secteur produit by ID:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.createSecteurProduit = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    const { nomSecteur, description, familleProduit } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : "";

    if (!nomSecteur || !description || !familleProduit) {
      return res.status(400).json({ message: "All fields (nomSecteur, description, familleProduit) are required" });
    }

    const newSecteurProduit = new SecteurProduit({
      nomSecteur,
      imageUrl,
      description,
      familleProduit,
    });

    await newSecteurProduit.save();
    res.status(201).json(newSecteurProduit);
  } catch (error) {
    console.error("Error occurred creating secteur produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.updateSecteurProduit = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File:", req.file);
    const { nomSecteur, description, familleProduit } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.imageUrl;

    const secteurProduit = await SecteurProduit.findByIdAndUpdate(
      req.params.id,
      { nomSecteur, imageUrl: imageUrl || "", description, familleProduit },
      { new: true, runValidators: true }
    );
    if (!secteurProduit) {
      return res.status(404).json({ message: "SecteurProduit not found" });
    }
    res.status(200).json(secteurProduit);
  } catch (error) {
    console.error("Server error updating secteur produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};

exports.deleteSecteurProduit = async (req, res) => {
  try {
    const secteurProduit = await SecteurProduit.findByIdAndDelete(req.params.id);
    if (!secteurProduit) {
      return res.status(404).json({ message: "SecteurProduit not found" });
    }
    res.status(200).json({ message: "SecteurProduit deleted successfully" });
  } catch (error) {
    console.error("Server error deleting secteur produit:", error);
    res.status(500).json({ message: "Server error, please try again.", error: error.message });
  }
};