const express = require("express");
const {
  register,
  getLoggedUser,
  login,
  logout,
} = require("../controllers/auth.controller");
const {
  authMiddleware,
  clientMiddleware,
  restaurantMiddleware,
  livreurMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");
const { check } = require("express-validator");
const router = express.Router();

// 🔹 Register Route
router.post(
  "/register",
  [
    check("nom", "Nom is required").not().isEmpty(),
    check("prenom", "Prenom is required").not().isEmpty(),
    check("email", "Please provide a valid email").isEmail(),
    check("motDePasse", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("role", "Role must be one of: client, restaurant, livreur").isIn([
      "client",
      "restaurant",
      "livreur",
    ]),
  ],
  register
);

// 🔹 Login Route
router.post(
  "/login",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("motDePasse", "Password is required").exists(),
  ],
  login
);

// 🔹 Logout route
router.post("/logout", authMiddleware, logout);

// 🔹 Role-specific profile routes
router.get("/me/client", authMiddleware, clientMiddleware, getLoggedUser);
router.get(
  "/me/restaurant",
  authMiddleware,
  restaurantMiddleware,
  getLoggedUser
);
router.get("/me/livreur", authMiddleware, livreurMiddleware, getLoggedUser);
router.get("/me/admin", authMiddleware, adminMiddleware, getLoggedUser);

module.exports = router;
