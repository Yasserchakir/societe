const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) { // Assurez-vous que vous avez une méthode comparePassword
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Générer le jeton avec _id et role
    const token = jwt.sign(
      {
        _id: user._id, // L'ID MongoDB de l'utilisateur
        role: user.role // Le rôle de l'utilisateur (par ex. "Admin", "Vendeur", "Client")
      },
      process.env.JWT_SECRET, // Votre clé secrète
      { expiresIn: '1h' } // Optionnel : expiration du jeton
    );

    res.json({ token }); // Renvoie le jeton au client
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login };