const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// 🔹 Get My Profile
router.get("/my-profile", authMiddleware, clientController.getMyProfile);

// 🔹 Update Client Profile (with optional profile image upload)
router.put(
  "/update-profile",
  authMiddleware,
  uploadMiddleware.uploadProfileImage, // Middleware to handle profile image upload
  clientController.updateClientProfile
);

// 🔹 Delete My Account
router.delete(
  "/delete-account",
  authMiddleware,
  clientController.deleteMyAccount
);

// 🔹 Create Avis
router.post("/avis", authMiddleware, clientController.createAvis);

// 🔹 Get All Avis
router.get("/avis", authMiddleware, clientController.getAllAvis);

// 🔹 Delete Avis
router.delete("/avis/:avisId", authMiddleware, clientController.deleteAvis);

// 🔹 Update Avis
router.put("/avis/:avisId", authMiddleware, clientController.updateAvis);

// 🔹 Get All Disponible Plats
router.get(
  "/plats/disponible",
  authMiddleware,
  clientController.getAllDisponiblePlats
);

// 🔹 Get All Disponible Plats of Categorie
router.get(
  "/plats/disponible/categories/:categorieId",
  authMiddleware,
  clientController.getAllDisponiblePlatsOfCategorie
);

// 🔹 Get All Disponible Plats of Restaurant
router.get(
  "/plats/disponible/restaurants/:restaurantId",
  authMiddleware,
  clientController.getAllDisponiblePlatsOfRestaurant
);

module.exports = router;
