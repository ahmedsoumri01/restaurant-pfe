const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

const {
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  changeAccountStatus,
  createRestaurantOwner,
} = adminController;

// 🔹 Get Admin Profile
router.get("/profile", authMiddleware, adminMiddleware, getAdminProfile);

// 🔹 Update Admin Profile
router.put("/profile", authMiddleware, adminMiddleware, updateAdminProfile);

// 🔹 Get All Users
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

// 🔹 Change Account Status
router.put(
  "/users/status",
  authMiddleware,
  adminMiddleware,
  changeAccountStatus
);

// 🔹 Create Restaurant Owner
router.post(
  "/restaurant-owner",
  authMiddleware,
  adminMiddleware,
  createRestaurantOwner
);

module.exports = router;
