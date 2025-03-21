const Promotion = require('../models/Promotion');
const Product = require('../models/Product');

// Create Promotion (Admin or Vendeur)
const  createPromotion = async (req, res) => {
  try {
    const { nomPromotion, description, reduction, dateDebut, dateFin, product } = req.body;

    // Validate required fields
    if (!nomPromotion || !reduction || !dateDebut || !dateFin || !product) {
      return res.status(400).json({ message: 'All fields are required, including a product.' });
    }

    // Check if product exists
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Authorization check
    if (req.user.role !== 'Admin' && productExists.vendeur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous n’êtes pas autorisé à ajouter une promotion sur ce produit' });
    }

    // Create new promotion
    const newPromotion = new Promotion({
      nomPromotion,
      description,
      reduction,
      dateDebut,
      dateFin,
      vendeur: req.user._id, // Set to the current user (Admin or Vendeur)
      product,
    });

    await newPromotion.save();

    // Link promotion to product
    productExists.promotion = newPromotion._id;
    await productExists.save();

    res.status(201).json({ message: 'Promotion créée avec succès', promotion: newPromotion });
  } catch (err) {
    console.error('Erreur lors de la création de la promotion:', err);
    res.status(500).json({ message: 'Erreur lors de la création de la promotion', error: err.message });
  }
};

// Get all Promotions (Admin or Vendeur)
const getPromotions = async (req, res) => {
  try {
    let promotions;
    if (req.user.role === 'Admin') {
      // Admins can see all promotions
      promotions = await Promotion.find().populate('product', 'nomProduit descriptionProduit');
    } else {
      // Vendeurs can only see their own promotions
      promotions = await Promotion.find({ vendeur: req.user._id }).populate('product', 'nomProduit descriptionProduit');
    }
    res.status(200).json(promotions);
  } catch (err) {
    console.error('Erreur lors de la récupération des promotions:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des promotions', error: err.message });
  }
};

// Update Promotion (Admin or Vendeur)
const updatePromotion = async (req, res) => {
  try {
    const { nomPromotion, description, reduction, dateDebut, dateFin, product } = req.body;

    // Check if the promotion exists
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }

    // Check product ownership
    const productExists = await Product.findById(product || promotion.product);
    if (!productExists) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Authorization check
    if (req.user.role !== 'Admin' && productExists.vendeur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous n’êtes pas autorisé à modifier cette promotion' });
    }

    // Update promotion fields
    promotion.nomPromotion = nomPromotion || promotion.nomPromotion;
    promotion.description = description || promotion.description;
    promotion.reduction = reduction || promotion.reduction;
    promotion.dateDebut = dateDebut || promotion.dateDebut;
    promotion.dateFin = dateFin || promotion.dateFin;
    promotion.product = product || promotion.product;

    await promotion.save();

    // Update product link if product changed
    if (product && product !== promotion.product.toString()) {
      await Product.updateOne({ promotion: promotion._id }, { $unset: { promotion: '' } });
      productExists.promotion = promotion._id;
      await productExists.save();
    }

    res.status(200).json({ message: 'Promotion mise à jour avec succès', promotion });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la promotion:', err);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la promotion', error: err.message });
  }
};

// Delete Promotion (Admin or Vendeur)
const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }

    // Check product ownership
    const productExists = await Product.findById(promotion.product);
    if (!productExists) {
      return res.status(404).json({ message: 'Produit associé non trouvé' });
    }

    // Authorization check
    if (req.user.role !== 'Admin' && productExists.vendeur.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Vous n’êtes pas autorisé à supprimer cette promotion' });
    }

    // Remove promotion reference from product
    productExists.promotion = null;
    await productExists.save();

    await promotion.deleteOne();

    res.status(200).json({ message: 'Promotion supprimée avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la promotion:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression de la promotion', error: err.message });
  }
};

module.exports = {
  createPromotion,
  getPromotions,
  updatePromotion,
  deletePromotion,
};