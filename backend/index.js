const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db.js");
const path = require("path");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const platsRoutes = require("./routes/plats.routes.js");
const clientRoutes = require("./routes/client.routes.js");
const { createAdminAccount } = require("./controllers/auth.controller");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();
// Initialize Express app
const app = express();
// Enable CORS for all requests
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://k8m7bj3t-3000.uks1.devtunnels.ms",
      "https://k8m7bj3t-3001.uks1.devtunnels.ms",
    ],
    credentials: true,
  })
);

// Serve static files (profile images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//create default admin account
createAdminAccount();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/plats", platsRoutes);
app.use("/api/client", clientRoutes);

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Set the port from environment variables or default to 3001
const PORT = process.env.PORT || 3002;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
