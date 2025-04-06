const commandeSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    livreur: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    plats: [
      {
        plat: { type: mongoose.Schema.Types.ObjectId, ref: "Plat" },
        quantite: Number,
      },
    ],
    statut: {
      type: String,
      enum: [
        "en attente",
        "préparation",
        "prête",
        "en route",
        "arrivée",
        "livrée",
      ],
      default: "en attente",
    },
    total: Number,
  },
  { timestamps: true }
);

const Commande = mongoose.model("Commande", commandeSchema);
module.exports = Commande;
