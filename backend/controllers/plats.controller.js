const Restaurant = require("../models/Restaurant");
const Categorie = require("../models/Categorie");
require("dotenv").config();
const { deleteFile } = require("../middlewares/upload.middleware");
const Plat = require("../models/Plat");

// 🔹 Add Plat
exports.addPlat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, description, prix, ingredients, categorie } = req.body;

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({ proprietaire: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Extract uploaded images and videos from the request body
    const images = req.body.imagePaths || [];
    const videos = req.body.videoPaths || [];

    // Create the plat
    const plat = new Plat({
      nom,
      description,
      prix,
      disponible: true,
      images,
      videos,
      ingredients,
      categorie,
      restaurant: restaurant._id,
    });

    await plat.save();

    // Add the plat to the restaurant's plats array
    restaurant.plats.push(plat._id);
    await restaurant.save();

    res.status(201).json({ message: "Plat created successfully", plat });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Plats of Restaurant
exports.getAllPlatsOfRestaurant = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({
      proprietaire: userId,
    }).populate("plats");
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json({
      message: "Plats retrieved successfully",
      plats: restaurant.plats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Plats by Category
exports.getAllPlatsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category and populate its plats
    const category = await Categorie.findById(categoryId).populate("plats");
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Plats retrieved successfully",
      plats: category.plats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get Plat by ID
exports.getPlatById = async (req, res) => {
  try {
    const { platId } = req.params;

    // Find the plat by ID
    const plat = await Plat.findById(platId)
      .populate("categorie")
      .populate("restaurant");
    if (!plat) {
      return res.status(404).json({ message: "Plat not found" });
    }

    res.json({ message: "Plat retrieved successfully", plat });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update Plat
exports.updatePlat = async (req, res) => {
  try {
    const { platId } = req.params;
    const { nom, description, prix, ingredients, categorie } = req.body;

    // Find the plat by ID
    const plat = await Plat.findById(platId);
    if (!plat) {
      return res.status(404).json({ message: "Plat not found" });
    }

    // Handle new images and videos
    const newImages = req.body.newImagePaths || [];
    const newVideos = req.body.videoPaths || [];

    // Delete old files if new ones are uploaded
    if (newImages.length > 0 && plat.images.length > 0) {
      plat.images.forEach((image) => deleteFile(image));
      plat.images = newImages;
    }

    if (newVideos.length > 0 && plat.videos.length > 0) {
      plat.videos.forEach((video) => deleteFile(video));
      plat.videos = newVideos;
    }

    // Update other fields
    plat.nom = nom || plat.nom;
    plat.description = description || plat.description;
    plat.prix = prix || plat.prix;
    plat.ingredients = ingredients || plat.ingredients;
    plat.categorie = categorie || plat.categorie;

    await plat.save();

    res.json({ message: "Plat updated successfully", plat });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Delete Plat
exports.deletePlat = async (req, res) => {
  try {
    const { platId } = req.params;
    console.log(req.body);
    console.log(req.params);
    console.log(platId);

    // Find the plat by ID
    const plat = await Plat.findById(platId);
    if (!plat) {
      return res.status(404).json({ message: "Plat not found" });
    }
    console.log(plat);

    // Delete the plat's images and videos
    if (plat.images.length > 0) {
      plat.images.forEach((image) => deleteFile(image));
    }
    if (plat.videos.length > 0) {
      plat.videos.forEach((video) => deleteFile(video));
    }

    //remove that plats from data base
    await Plat.findByIdAndDelete(platId);

    res.json({ message: "Plat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Change Plat Status
exports.changePlatStatus = async (req, res) => {
  try {
    const { platId } = req.params;

    // Find the plat by ID
    const plat = await Plat.findById(platId);
    if (!plat) {
      return res.status(404).json({ message: "Plat not found" });
    }

    // Toggle the status
    plat.disponible = !plat.disponible;
    await plat.save();

    res.json({ message: "Plat status updated successfully", plat });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
