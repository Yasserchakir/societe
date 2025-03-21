const User = require('../models/User');

// Middleware for checking if user is a "Vendeur"
const vendeurMiddleware = (req, res, next) => {
  User.findById(req.user.id)
    .then(user => {
      if (user.role !== 'Vendeur') {
        return res.status(403).json({ message: "Access forbidden: Not a Vendeur" });
      }
      next();
    })
    .catch(err => {
      return res.status(400).json({ message: "User not found" });
    });
};

module.exports = vendeurMiddleware;
