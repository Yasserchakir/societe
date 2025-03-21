const FamilleService = require("../models/FamilleService");
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

const getAllFamilleServices = async (req, res) => {
  try {
    console.log("GET /api/familleservices called by user:", req.user?._id);
    const familleServices = await FamilleService.find().populate("createdBy", "name prenom");
    res.status(200).json(familleServices);
  } catch (error) {
    console.error("Error fetching famille services:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getFamilleServiceById = async (req, res) => {
  try {
    const familleService = await FamilleService.findById(req.params.id).populate("createdBy", "name prenom");
    if (!familleService) {
      return res.status(404).json({ message: "FamilleService not found" });
    }
    res.status(200).json(familleService);
  } catch (error) {
    console.error("Server error fetching famille service by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createFamilleService = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const createdBy = req.user?._id;

    console.log("Creating FamilleService with:", { nom, description, imageUrl, createdBy });

    if (!nom || !description || !imageUrl) {
      return res.status(400).json({
        message: "Name, description, and image are required",
        missing: { nom, description, imageUrl },
      });
    }

    if (!createdBy) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newFamilleService = new FamilleService({
      nom,
      description,
      imageUrl,
      createdBy,
    });

    await newFamilleService.save();
    res.status(201).json(newFamilleService);
  } catch (error) {
    console.error("Error creating famille service:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: `A service family with the name "${req.body.nom}" already exists.` 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateFamilleService = async (req, res) => {
  try {
    const { nom, description } = req.body;
    const updateData = { nom, description };
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const familleService = await FamilleService.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!familleService) {
      return res.status(404).json({ message: "FamilleService not found" });
    }
    res.status(200).json(familleService);
  } catch (error) {
    console.error("Server error updating famille service:", error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: `A service family with the name "${req.body.nom}" already exists.` 
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteFamilleService = async (req, res) => {
  try {
    const familleService = await FamilleService.findByIdAndDelete(req.params.id);
    if (!familleService) {
      return res.status(404).json({ message: "FamilleService not found" });
    }
    res.status(200).json({ message: "FamilleService deleted successfully" });
  } catch (error) {
    console.error("Server error deleting famille service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllFamilleServices,
  getFamilleServiceById,
  createFamilleService: [upload.single("imageUrl"), createFamilleService],
  updateFamilleService: [upload.single("imageUrl"), updateFamilleService],
  deleteFamilleService,
};