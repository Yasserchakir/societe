require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const bodyParser = require("body-parser");

// Import des routes
const familleProduitRoutes = require("./routes/familleProduitRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const productRoutes = require("./routes/productRoutes");
const societeRoutes = require("./routes/societeRoutes");
const familleServiceRoutes = require("./routes/familleServiceRoutes");
const reservationRoutes = require("./routes/reservationRoutes");

const app = express();

// Middleware (placés avant les routes)
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json()); // Pour parser les requêtes JSON
app.use(bodyParser.json()); // Alternative à express.json() (pas nécessaire si express.json() est utilisé)
app.use(bodyParser.urlencoded({ extended: true })); // Pour parser les formulaires URL-encoded
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, filePath) => {
    console.log(`Serving static file: ${filePath}`);
  },
}));

// Routes (placées après les middlewares)
app.use("/api/reservations", reservationRoutes);
app.use("/api/secteurProduits", require("./routes/secteurProduitRoutes"));
app.use("/api/secteurservice", require("./routes/secteurServiceRoutes"));
app.use("/api/promotions", require("./routes/promotionRoutes"));
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/familleservice", familleServiceRoutes);
app.use("/api/familleproduit", familleProduitRoutes);
app.use("/api/societes", societeRoutes);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Configuration de Multer pour les uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log(`Multer - Saving file to uploads/: ${filename}`);
    cb(null, filename);
  },
});
const upload = multer({ storage });

// Routes d'authentification
app.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    const { name, prenom, email, password, role, city, telephone } = req.body;
    const avatar = req.file ? req.file.path : null;

    const validRoles = ["Admin", "Client", "Vendeur"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      prenom,
      email,
      password: hashedPassword,
      role,
      avatar,
      city,
      telephone,
    });

    await newUser.save();
    res.json({
      message: "User registered successfully!",
      user: {
        name: newUser.name,
        prenom: newUser.prenom,
        email: newUser.email,
        role: newUser.role,
        city: newUser.city,
        telephone: newUser.telephone,
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      user: {
        name: user.name,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        city: user.city,
        telephone: user.telephone,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Middleware isAdmin
const isAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Failed to authenticate token." });
    if (decoded.role !== "Admin") {
      return res.status(403).json({ message: "Access to the resource is prohibited. Admins only." });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Routes Admin
app.get("/admin/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users!" });
  }
});

app.post("/admin/users", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, password, role, city, telephone } = req.body;
    const avatar = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      prenom,
      email,
      password: hashedPassword,
      role,
      avatar,
      city,
      telephone,
    });

    await newUser.save();
    res.json({ message: "User added successfully!", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

app.put("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const { name, prenom, email, role, city, telephone } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.name = name || user.name;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.role = role || user.role;
    user.city = city || user.city;
    user.telephone = telephone || user.telephone;

    await user.save();
    res.json({ message: "User updated successfully!", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

app.delete("/admin/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error, please try again." });
  }
});

// Routes Profile
app.get("/profile", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

app.put("/profile", upload.single("avatar"), async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let updateData = { ...req.body };
    if (req.file) {
      updateData.avatar = req.file.path;
    }
    const updatedUser = await User.findByIdAndUpdate(decoded.userId, updateData, { new: true }).select("-password");
    res.json({ message: "Profile updated successfully!", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));