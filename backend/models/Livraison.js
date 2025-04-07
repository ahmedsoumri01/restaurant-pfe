const mongoose = require("mongoose");

const livraisonSchema = new mongoose.Schema(
  {
    commande: { type: mongoose.Schema.Types.ObjectId, ref: "Commande" },
    livreur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    statut: {
      type: String,
      enum: ["à récupérer", "en route", "arrivée", "livrée"],
      default: "à récupérer",
    },
    estimationLivraison: Date,
    dateDebut: Date,
    dateFin: Date,
    payee: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Livraison", livraisonSchema);
