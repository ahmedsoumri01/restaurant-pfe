const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");
const {
  authMiddleware,
  clientMiddleware,
} = require("../middlewares/auth.middleware");
const uploadMiddleware = require("../middlewares/upload.middleware");

// 🔹 Get My Profile
router.get("/my-profile", authMiddleware, clientController.getMyProfile);

// 🔹 Update Client Profile (with optional profile image upload)
router.put(
  "/update-profile",
  authMiddleware,
  clientMiddleware,
  uploadMiddleware.uploadProfileImage, // Middleware to handle profile image upload
  clientController.updateClientProfile
);

// 🔹 Delete My Account
router.delete(
  "/delete-account",
  authMiddleware,
  clientMiddleware,
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
// 🔹 Get All Categories
router.get(
  "/plats/categories",
  authMiddleware,
  clientController.getAllCategories
);

// 🔹 Get All Restaurants
router.get(
  "/plats/restaurants",
  authMiddleware,
  clientController.getAllRestaurants
);
// 🔹 Get  Plat details

router.get("/plats/:platId", authMiddleware, clientController.getPlatById);

// 🔹 Make Comment
router.post(
  "/plats/:platId/comment",
  authMiddleware,
  clientController.makeComment
);

// 🔹 Like Plat
router.put("/plats/:platId/like", authMiddleware, clientController.likePlat);

// 🔹 Get All Comments on a Plat
router.get(
  "/plats/:platId/comments",
  authMiddleware,
  clientController.getAllCommentsOnPlat
);
module.exports = router;
