const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Restaurant = require("../models/Restaurant");
const Categorie = require("../models/Categorie");
const Plat = require("../models/Plat");
require("dotenv").config();
const { deleteFile } = require("../middlewares/upload.middleware");
const Avis = require("../models/Avis");

// 🔹 Get My Profile
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated and their ID is in the token

    // Find the user
    const user = await User.findById(userId).select("-motDePasse");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Client profile retrieved successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update Client Profile
exports.updateClientProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, prenom, email, telephone, adresse } = req.body;
    const photoProfil = req.body.profileImage; // From upload middleware

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the email is already used by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
      }
    }

    // Delete the old profile image if a new one is uploaded
    if (photoProfil && user.photoProfil) {
      deleteFile(user.photoProfil); // Delete the old image file
    }

    // Update the user's profile
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;
    user.photoProfil = photoProfil || user.photoProfil;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Delete My Account
exports.deleteMyAccount = async (req, res) => {
  try {
    console.log("Deleting account...");
    const userId = req.user.id;

    // Find the user
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the profile image if it exists
    if (user.photoProfil) {
      deleteFile(user.photoProfil);
    }

    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Create Avis
exports.createAvis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { restaurant, livreur, commande, note, commentaire } = req.body;

    // Validate note
    if (note < 1 || note > 5) {
      return res.status(400).json({ message: "Note must be between 1 and 5" });
    }

    // Create the avis
    const avis = new Avis({
      client: userId,
      restaurant,
      livreur,
      commande,
      note,
      commentaire,
    });

    await avis.save();

    res.status(201).json({ message: "Avis created successfully", avis });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Avis
exports.getAllAvis = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all avis made by the client
    const avis = await Avis.find({ client: userId })
      .populate("restaurant")
      .populate("livreur")
      .populate("commande");

    res.json({ message: "Avis retrieved successfully", avis });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Delete Avis
exports.deleteAvis = async (req, res) => {
  try {
    const { avisId } = req.params;

    // Find the avis
    const avis = await Avis.findById(avisId);
    if (!avis) {
      return res.status(404).json({ message: "Avis not found" });
    }

    // Ensure the avis belongs to the logged-in client
    if (avis.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this avis" });
    }

    // Delete the avis
    await avis.remove();

    res.json({ message: "Avis deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update Avis
exports.updateAvis = async (req, res) => {
  try {
    const { avisId } = req.params;
    const { note, commentaire } = req.body;

    // Validate note
    if (note && (note < 1 || note > 5)) {
      return res.status(400).json({ message: "Note must be between 1 and 5" });
    }

    // Find the avis
    const avis = await Avis.findById(avisId);
    if (!avis) {
      return res.status(404).json({ message: "Avis not found" });
    }

    // Ensure the avis belongs to the logged-in client
    if (avis.client.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this avis" });
    }

    // Update the avis
    avis.note = note || avis.note;
    avis.commentaire = commentaire || avis.commentaire;

    await avis.save();

    res.json({ message: "Avis updated successfully", avis });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Disponible Plats
exports.getAllDisponiblePlats = async (req, res) => {
  try {
    // Find all plats with disponible = true
    const plats = await Plat.find({ disponible: true })
      .populate("categorie")
      .populate("restaurant");

    res.json({ message: "Disponible plats retrieved successfully", plats });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Disponible Plats of Categorie
exports.getAllDisponiblePlatsOfCategorie = async (req, res) => {
  try {
    const { categorieId } = req.params;

    // Find all plats with disponible = true and matching categorieId
    const plats = await Plat.find({ disponible: true, categorie: categorieId })
      .populate("categorie")
      .populate("restaurant");

    res.json({ message: "Disponible plats retrieved successfully", plats });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Disponible Plats of Restaurant
exports.getAllDisponiblePlatsOfRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Find all plats with disponible = true and matching restaurantId
    const plats = await Plat.find({
      disponible: true,
      restaurant: restaurantId,
    })
      .populate("categorie")
      .populate("restaurant");

    res.json({ message: "Disponible plats retrieved successfully", plats });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    console.log("Fetching categories...");
    // Find all categories
    const categories = await Categorie.find();

    res.json({ message: "Categories retrieved successfully", categories });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Restaurants
exports.getAllRestaurants = async (req, res) => {
  try {
    // Find all restaurants
    const restaurants = await Restaurant.find().populate("categories");

    res.json({ message: "Restaurants retrieved successfully", restaurants });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
