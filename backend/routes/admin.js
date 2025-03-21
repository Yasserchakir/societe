const express = require("express");
const router = express.Router();
const User = require("../models/User");  // Import the User model
const auth = require("../middleware/auth");  // Import the authentication middleware

// Route to get all users (Admin Only)
router.get("/users", auth, async (req, res) => {
  try {
    // Check if the user is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
    }
    
    // Get all users
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to create a new user (Admin Only)
router.post("/users", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
  }

  const { name, prenom, email, password, role, city, telephone } = req.body;

  try {
    // Create new user
    const newUser = new User({
      name,
      prenom,
      email,
      password, // Make sure to hash the password before saving
      role,
      city,
      telephone
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to update a user's information (Admin Only)
router.put("/users/:id", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
  }

  const { name, prenom, email, role, city, telephone } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user information
    user.name = name || user.name;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.role = role || user.role;
    user.city = city || user.city;
    user.telephone = telephone || user.telephone;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to delete a user (Admin Only)
router.delete("/users/:id", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user
    await user.remove();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
