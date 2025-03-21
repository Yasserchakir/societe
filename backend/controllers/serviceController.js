// controllers/serviceController.js
const Service = require('../models/Service');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage }).array('media', 5); // Allow up to 5 files

exports.getAllServices = async (req, res) => {
  try {
    const query = {};
    if (req.query.idFamille) {
      query.idFamille = req.query.idFamille;
    }
    const services = await Service.find(query)
      .populate('idFamille', 'nom')
      .populate('idSecteur', 'nomSecteur')
      .populate('createdBy', 'name prenom');
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services", error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('idFamille', 'nom')
      .populate('idSecteur', 'nomSecteur')
      .populate('createdBy', 'name prenom');
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Error fetching service", error: error.message });
  }
};

exports.createService = [
  upload,
  async (req, res) => {
    try {
      const {
        servicename,
        description,
        availability,
        price,
        tva,
        promotionActive,
        reduction,
        state,
        idFamille,
        idSecteur,
      } = req.body;

      console.log("Request body:", req.body);
      console.log("Request files:", req.files);
      console.log("User:", req.user);

      if (!servicename || !description || !availability || !price || !tva || !idFamille || !idSecteur) {
        return res.status(400).json({ message: "All required fields must be provided" });
      }

      if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const priceNum = parseFloat(price);
      const tvaNum = parseFloat(tva);
      const reductionNum = promotionActive && reduction ? parseFloat(reduction) : 0;
      const promotionActiveBool = promotionActive === 'true' || promotionActive === true;

      const media = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

      const newService = new Service({
        servicename,
        description,
        availability,
        price: priceNum,
        tva: tvaNum,
        promotionActive: promotionActiveBool,
        reduction: promotionActiveBool ? reductionNum : undefined,
        state: state || 'à faire',
        media,
        createdBy: req.user._id,
        idFamille,
        idSecteur,
        availableTimeSlots: [], // Initialize empty, can be populated later
      });

      await newService.save();
      const populatedService = await Service.findById(newService._id)
        .populate('idFamille', 'nom')
        .populate('idSecteur', 'nomSecteur')
        .populate('createdBy', 'name prenom');
      res.status(201).json(populatedService);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(500).json({ message: "Error creating service", error: error.message });
    }
  }
];

exports.updateService = [
  upload,
  async (req, res) => {
    try {
      const {
        servicename,
        description,
        availability,
        price,
        tva,
        promotionActive,
        reduction,
        state,
        idFamille,
        idSecteur,
      } = req.body;

      const priceNum = price ? parseFloat(price) : undefined;
      const tvaNum = tva ? parseFloat(tva) : undefined;
      const reductionNum = promotionActive && reduction ? parseFloat(reduction) : 0;
      const promotionActiveBool = promotionActive === 'true' || promotionActive === true;

      const media = req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/${file.filename}`)
        : req.body.existingMedia
        ? (Array.isArray(req.body.existingMedia) ? req.body.existingMedia : [req.body.existingMedia])
        : undefined;

      const updateData = {
        servicename,
        description,
        availability,
        price: priceNum,
        tva: tvaNum,
        promotionActive: promotionActiveBool,
        reduction: promotionActiveBool ? reductionNum : undefined,
        state,
        media,
        idFamille,
        idSecteur,
      };

      const updatedService = await Service.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      )
        .populate('idFamille', 'nom')
        .populate('idSecteur', 'nomSecteur')
        .populate('createdBy', 'name prenom');

      if (!updatedService) return res.status(404).json({ message: "Service not found" });
      res.status(200).json(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ message: "Error updating service", error: error.message });
    }
  }
];

exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: "Service not found" });
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Error deleting service", error: error.message });
  }
};

exports.generateTimeSlots = async (req, res) => {
  try {
    const { startDate, endDate, slotDuration } = req.body;

    if (!startDate || !endDate || !slotDuration) {
      return res.status(400).json({ message: "startDate, endDate, and slotDuration are required" });
    }

    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.generateTimeSlots(startDate, endDate, parseInt(slotDuration));
    const updatedService = await Service.findById(req.params.id)
      .populate('idFamille', 'nom')
      .populate('idSecteur', 'nomSecteur')
      .populate('createdBy', 'name prenom');

    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error generating time slots:", error);
    res.status(500).json({ message: "Error generating time slots", error: error.message });
  }
};

module.exports = exports;