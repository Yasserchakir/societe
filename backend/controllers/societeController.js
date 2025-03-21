const Societe = require('../models/Societe');

const createSociete = async (req, res) => {
  try {
    const {
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement,
    } = req.body;

    const societe = new Societe({
      idUser: req.user._id,
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement,
    });

    await societe.save();
    return res.status(201).json(societe);
  } catch (error) {
    console.error('Error creating Societe:', error);
    return res.status(500).json({ message: 'Error creating Societe', error });
  }
};

const getAllSocietes = async (req, res) => {
  try {
    console.log('Fetching all sociétés for user:', req.user._id); // Debug log
    const societes = await Societe.find().populate('idUser', 'name email');
    console.log('Sociétés found:', societes); // Debug log
    return res.status(200).json(societes);
  } catch (error) {
    console.error('Error fetching Societes:', error);
    return res.status(500).json({ message: 'Error fetching Societes', error });
  }
};

const getSocieteById = async (req, res) => {
  try {
    const societe = await Societe.findById(req.params.id).populate('idUser', 'name email');
    if (!societe) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json(societe);
  } catch (error) {
    console.error('Error fetching Societe:', error);
    return res.status(500).json({ message: 'Error fetching Societe', error });
  }
};

const updateSociete = async (req, res) => {
  try {
    const {
      typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
      nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
      ribIban, methodesPaiement,
    } = req.body;

    const updatedSociete = await Societe.findByIdAndUpdate(
      req.params.id,
      {
        typeVendeur, nomEntreprise, nomVendeur, numeroEnregistrement, secteurActivite, description,
        nomResponsable, email, numeroTelephone, adresseEntreprise, adresseCorrespondance, statutJuridique,
        ribIban, methodesPaiement,
      },
      { new: true }
    );

    if (!updatedSociete) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json(updatedSociete);
  } catch (error) {
    console.error('Error updating Societe:', error);
    return res.status(500).json({ message: 'Error updating Societe', error });
  }
};

const deleteSociete = async (req, res) => {
  try {
    const societe = await Societe.findByIdAndDelete(req.params.id);
    if (!societe) {
      return res.status(404).json({ message: 'Societe not found' });
    }
    return res.status(200).json({ message: 'Societe deleted successfully' });
  } catch (error) {
    console.error('Error deleting Societe:', error);
    return res.status(500).json({ message: 'Error deleting Societe', error });
  }
};

module.exports = {
  createSociete,
  getAllSocietes,
  getSocieteById,
  updateSociete,
  deleteSociete,
};