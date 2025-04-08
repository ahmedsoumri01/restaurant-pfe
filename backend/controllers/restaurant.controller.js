const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Restaurant = require("../models/Restaurant");
const Categorie = require("../models/Categorie");
require("dotenv").config();
const { deleteFile } = require("../middlewares/uploadMiddleware");

// 🔹 Get My Owner Profile
exports.myOwnerProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user is authenticated and their ID is in the token

    // Find the user
    const user = await User.findById(userId).select("-motDePasse");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the associated restaurant (if any)
    const restaurant = await Restaurant.findOne({ proprietaire: userId });

    res.json({
      message: "Owner profile retrieved successfully",
      user,
      restaurant: restaurant || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update My Password
exports.updateMyPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the old password
    const isMatch = await bcrypt.compare(oldPassword, user.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.motDePasse = hashedNewPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update My Profile
exports.updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, prenom, email, telephone, adresse } = req.body;
    const profileImage = req.body.profileImage; // From upload middleware

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
    if (profileImage && user.photoProfil) {
      deleteFile(user.photoProfil); // Delete the old image file
    }

    // Update the user's profile
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.email = email || user.email;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;
    user.photoProfil = profileImage || user.photoProfil;

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Check Restaurant Data Completed
exports.checkRestaurantDataCompleted = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({ proprietaire: userId });

    if (!restaurant) {
      return res.json({
        completed: false,
        message: "Restaurant not created yet",
      });
    }

    res.json({
      completed: true,
      message: "Restaurant data is completed",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Complete Restaurant Information
exports.completeRestaurantInformation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, adresse, telephone, description, workingHours, images } =
      req.body;

    // Check if the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({
      proprietaire: userId,
    });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists" });
    }

    // Create the restaurant
    const restaurant = new Restaurant({
      proprietaire: userId,
      nom,
      adresse,
      telephone,
      description,
      workingHours,
      images: images || [],
    });

    await restaurant.save();

    res
      .status(201)
      .json({ message: "Restaurant created successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update Restaurant Information
exports.updateRestaurantInformation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, adresse, telephone, description, workingHours, images } =
      req.body;

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({ proprietaire: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Update the restaurant's information
    restaurant.nom = nom || restaurant.nom;
    restaurant.adresse = adresse || restaurant.adresse;
    restaurant.telephone = telephone || restaurant.telephone;
    restaurant.description = description || restaurant.description;
    restaurant.workingHours = workingHours || restaurant.workingHours;
    restaurant.images = images || restaurant.images;

    await restaurant.save();

    res.json({ message: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Create Category
exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom, description } = req.body;
    const image = req.body.categoryImage; // From upload middleware

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({ proprietaire: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Create the category
    const category = new Categorie({
      nom,
      description,
      image,
      restaurant: restaurant._id,
    });

    await category.save();

    // Add the category to the restaurant's categories array
    restaurant.categories.push(category._id);
    await restaurant.save();

    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Update Category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { nom, description } = req.body;
    const image = req.body.categoryImage; // From upload middleware

    // Find the category
    const category = await Categorie.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the old image if a new one is uploaded
    if (image && category.image) {
      deleteFile(category.image);
    }

    // Update the category
    category.nom = nom || category.nom;
    category.description = description || category.description;
    category.image = image || category.image;

    await category.save();

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Get All Categories
exports.getAllCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the restaurant owned by the user
    const restaurant = await Restaurant.findOne({ proprietaire: userId });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find all categories associated with the restaurant
    const categories = await Categorie.find({ restaurant: restaurant._id });

    res.json({ message: "Categories retrieved successfully", categories });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Delete Category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find the category
    const category = await Categorie.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete the category image
    if (category.image) {
      deleteFile(category.image);
    }

    // Remove the category from the restaurant's categories array
    const restaurant = await Restaurant.findOne({ categories: categoryId });
    if (restaurant) {
      restaurant.categories.pull(categoryId);
      await restaurant.save();
    }

    // Delete all associated dishes
    await Plat.deleteMany({ categorie: categoryId });

    // Delete the category
    await category.remove();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
