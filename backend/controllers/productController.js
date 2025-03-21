const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.createProduct = async (req, res) => {
  try {
    console.log("Creating product - Received body:", req.body);
    console.log("Creating product - Received files:", req.files);

    const {
      nomProduit,
      descriptionProduit,
      prixUnitaire,
      tva,
      quantiteDisponible,
      statutProduit,
      promotion,
      idFamille,
      idSecteur,
    } = req.body;

    if (
      !nomProduit ||
      !descriptionProduit ||
      prixUnitaire === undefined ||
      tva === undefined ||
      quantiteDisponible === undefined ||
      !idFamille ||
      !idSecteur
    ) {
      console.log("Validation failed - Missing required fields");
      return res.status(400).json({
        message:
          "All fields are required: nomProduit, descriptionProduit, prixUnitaire, tva, quantiteDisponible, idFamille, idSecteur",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(idFamille) || !mongoose.Types.ObjectId.isValid(idSecteur)) {
      console.log("Validation failed - Invalid idFamille or idSecteur");
      return res.status(400).json({ message: "Invalid idFamille or idSecteur" });
    }

    const tvaValue = parseInt(tva);
    if (![0, 7, 13, 19].includes(tvaValue)) {
      console.log("Validation failed - Invalid tva value:", tvaValue);
      return res.status(400).json({ message: "tva must be one of: 0, 7, 13, 19" });
    }

    const statutProduitValue = statutProduit || "Disponible";
    if (!["Disponible", "Epuisé", "Retiré"].includes(statutProduitValue)) {
      console.log("Validation failed - Invalid statutProduit value:", statutProduitValue);
      return res.status(400).json({ message: "statutProduit must be one of: Disponible, Epuisé, Retiré" });
    }

    let promotionValue = null;
    if (promotion && promotion !== "" && promotion !== "null") {
      if (!mongoose.Types.ObjectId.isValid(promotion)) {
        console.log("Validation failed - Invalid promotion ID:", promotion);
        return res.status(400).json({ message: "Invalid promotion ID" });
      }
      promotionValue = promotion;
    }

    const imageUrl = req.files
      ? req.files.map((file) => {
          console.log("File uploaded - Path:", file.path, "Filename:", file.filename);
          return `/uploads/${file.filename}`;
        })
      : [];

    const product = new Product({
      nomProduit,
      descriptionProduit,
      prixUnitaire: parseFloat(prixUnitaire),
      tva: tvaValue,
      quantiteDisponible: parseInt(quantiteDisponible),
      statutProduit: statutProduitValue,
      promotion: promotionValue,
      idFamille,
      idSecteur,
      imageUrl,
      vendeur: req.user._id,
    });

    await product.save();
    console.log("Product saved successfully:", product);
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ statutProduit: "Disponible" })
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom");
    console.log(
      "Fetched products (public):",
      products.map((p) => ({ id: p._id, nomProduit: p.nomProduit, imageUrl: p.imageUrl }))
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching products (public):", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log(`Invalid product ID: ${productId}`);
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(productId)
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom");

    if (!product) {
      console.log(`Product not found for ID: ${productId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(`Fetched product by ID ${productId}:`, {
      id: product._id,
      nomProduit: product.nomProduit,
      imageUrl: product.imageUrl,
    });
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product by ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("Updating product - Received body:", req.body);
    console.log("Updating product - Received files:", req.files);

    const {
      nomProduit,
      descriptionProduit,
      prixUnitaire,
      tva,
      quantiteDisponible,
      statutProduit,
      promotion,
      idFamille,
      idSecteur,
    } = req.body;

    const updateData = {};
    if (nomProduit !== undefined) updateData.nomProduit = nomProduit;
    if (descriptionProduit !== undefined) updateData.descriptionProduit = descriptionProduit;
    if (prixUnitaire !== undefined) updateData.prixUnitaire = parseFloat(prixUnitaire);
    if (tva !== undefined) {
      const tvaValue = parseInt(tva);
      if (![0, 7, 13, 19].includes(tvaValue)) {
        console.log("Validation failed - Invalid tva value:", tvaValue);
        return res.status(400).json({ message: "tva must be one of: 0, 7, 13, 19" });
      }
      updateData.tva = tvaValue;
    }
    if (quantiteDisponible !== undefined) updateData.quantiteDisponible = parseInt(quantiteDisponible);
    if (statutProduit !== undefined) {
      if (!["Disponible", "Epuisé", "Retiré"].includes(statutProduit)) { // Fixed typo here
        console.log("Validation failed - Invalid statutProduit value:", statutProduit);
        return res.status(400).json({ message: "statutProduit must be one of: Disponible, Epuisé, Retiré" });
      }
      updateData.statutProduit = statutProduit;
    }
    if (idFamille !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(idFamille)) {
        console.log("Validation failed - Invalid idFamille:", idFamille);
        return res.status(400).json({ message: "Invalid idFamille" });
      }
      updateData.idFamille = idFamille;
    }
    if (idSecteur !== undefined) {
      if (!mongoose.Types.ObjectId.isValid(idSecteur)) {
        console.log("Validation failed - Invalid idSecteur:", idSecteur);
        return res.status(400).json({ message: "Invalid idSecteur" });
      }
      updateData.idSecteur = idSecteur;
    }
    if (promotion !== undefined) {
      updateData.promotion = promotion === "" || promotion === "null" ? null : promotion;
      if (updateData.promotion && !mongoose.Types.ObjectId.isValid(updateData.promotion)) {
        console.log("Validation failed - Invalid promotion ID:", updateData.promotion);
        return res.status(400).json({ message: "Invalid promotion ID" });
      }
    }

    if (req.files && req.files.length > 0) {
      updateData.imageUrl = req.files.map((file) => {
        console.log("File updated - Path:", file.path, "Filename:", file.filename);
        return `/uploads/${file.filename}`;
      });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom");

    if (!product) {
      console.log(`Product not found for update - ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    console.log("Product updated successfully:", {
      id: product._id,
      nomProduit: product.nomProduit,
      imageUrl: product.imageUrl,
    });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log("Invalid product ID for deletion:", req.params.id);
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.log(`Product not found for deletion - ID: ${req.params.id}`);
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.vendeur.toString() !== req.user._id.toString()) {
      console.log("Unauthorized deletion attempt:", { userId: req.user._id, productVendeur: product.vendeur });
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();
    console.log(`Product deleted successfully - ID: ${req.params.id}`);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

exports.getProductsBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      console.log("Invalid seller ID:", sellerId);
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const products = await Product.find({ vendeur: sellerId })
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom");

    if (products.length === 0) {
      console.log(`No products found for seller ID: ${sellerId}`);
      return res.status(404).json({ message: "No products found for this seller" });
    }

    console.log(
      "Fetched products by seller:",
      products.map((p) => ({ id: p._id, nomProduit: p.nomProduit, imageUrl: p.imageUrl }))
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching products by seller ID:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.getPublicProductsBySellerId = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      console.log("Invalid seller ID (public):", sellerId);
      return res.status(400).json({ message: "Invalid seller ID" });
    }

    const products = await Product.find({ vendeur: sellerId, statutProduit: "Disponible" })
      .populate("vendeur", "name prenom avatar")
      .populate("idFamille", "nom")
      .populate("idSecteur", "nom");

    if (products.length === 0) {
      console.log(`No public products found for seller ID: ${sellerId}`);
      return res.status(404).json({ message: "No available products found for this seller" });
    }

    console.log(
      "Fetched public products by seller:",
      products.map((p) => ({ id: p._id, nomProduit: p.nomProduit, imageUrl: p.imageUrl }))
    );
    res.json(products);
  } catch (error) {
    console.error("Error fetching public products by seller ID:", error);
    res.status(500).json({ message: "Error fetching public products", error: error.message });
  }
};