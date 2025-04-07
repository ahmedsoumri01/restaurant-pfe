const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    livreur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    commande: { type: mongoose.Schema.Types.ObjectId, ref: "Commande" },
    note: { type: Number, min: 1, max: 5 },
    commentaire: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Avis", avisSchema);
