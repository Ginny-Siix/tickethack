const mongoose = require("mongoose"); // Import de mongoose
require("dotenv").config(); // Charge les variables d'environnement

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error("La variable d'environnement MONGO_URI est manquante !");
  process.exit(1);
}

mongoose
  .connect(dbUri)
  .then(() => {
    console.log("Connexion à la base de données réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données:", err.message);
  });
