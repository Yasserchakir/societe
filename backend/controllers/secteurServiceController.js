const SecteurService = require("../models/secteurService");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

exports.getAllSecteurServices = async (req, res) => {
  try {
    const secteurServices = await SecteurService.find().populate("familleService", "nom");
    res.status(200).json(secteurServices);
  } catch (error) {
    console.error("Error fetching all secteur services:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSecteurServicesByFamille = async (req, res) => {
  try {
    const { familleId } = req.params;
    const secteurServices = await SecteurService.find({ familleService: familleId }).populate(
      "familleService",
      "nom"
    );
    res.status(200).json(secteurServices);
  } catch (error) {
    console.error("Error fetching secteur services by famille:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getSecteurServiceById = async (req, res) => {
  try {
    const secteurService = await SecteurService.findById(req.params.id).populate(
      "familleService",
      "nom"
    );
    if (!secteurService) {
      return res.status(404).json({ message: "SecteurService not found" });
    }
    res.status(200).json(secteurService);
  } catch (error) {
    console.error("Error fetching secteur service by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.createSecteurService = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      console.error("File filter error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("Request headers:", req.headers);
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);

      const { nomSecteur, description, familleService } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Image is required" });
      }
      const imageUrl = `/uploads/${req.file.filename}`;

      if (!nomSecteur || !description || !familleService) {
        return res.status(400).json({
          message: "Name, description, and familleService are required",
          missing: { nomSecteur, description, familleService },
        });
      }

      const newSecteurService = new SecteurService({
        nomSecteur,
        description,
        familleService,
        imageUrl,
      });

      const savedService = await newSecteurService.save();
      res.status(201).json(savedService);
    } catch (error) {
      console.error("Error creating secteur service:", error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Sector name must be unique" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

exports.updateSecteurService = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: "File upload error: " + err.message });
    } else if (err) {
      console.error("File filter error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      console.log("Request headers:", req.headers);
      console.log("Update request body:", req.body);
      console.log("Update request file:", req.file);

      const { nomSecteur, description, familleService, imageUrl: existingImageUrl } = req.body;
      const updateData = { nomSecteur, description, familleService };

      if (req.file) {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
        if (existingImageUrl && fs.existsSync(path.join(__dirname, "..", existingImageUrl))) {
          fs.unlinkSync(path.join(__dirname, "..", existingImageUrl));
        }
      } else if (existingImageUrl) {
        updateData.imageUrl = existingImageUrl;
      } else {
        return res.status(400).json({ message: "Image is required" });
      }

      const secteurService = await SecteurService.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!secteurService) {
        return res.status(404).json({ message: "SecteurService not found" });
      }
      res.status(200).json(secteurService);
    } catch (error) {
      console.error("Error updating secteur service:", error);
      if (error.code === 11000) {
        return res.status(400).json({ message: "Sector name must be unique" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

exports.deleteSecteurService = async (req, res) => {
  try {
    const secteurService = await SecteurService.findById(req.params.id);
    if (!secteurService) {
      return res.status(404).json({ message: "SecteurService not found" });
    }

    if (secteurService.imageUrl && fs.existsSync(path.join(__dirname, "..", secteurService.imageUrl))) {
      fs.unlinkSync(path.join(__dirname, "..", secteurService.imageUrl));
    }

    await SecteurService.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "SecteurService deleted successfully" });
  } catch (error) {
    console.error("Error deleting secteur service:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};