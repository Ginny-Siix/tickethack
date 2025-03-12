const mongoose = require('mongoose');
require('dotenv').config();  // Charge les variables d'environnement depuis le fichier .env

const dbUri = process.env.MONGODB_URI;  // Récupère l'URI de connexion à MongoDB depuis .env


if (!dbUri) {
  console.error("La variable d'environnement MONGODB_URI est manquante !");
  process.exit(1);  // Arrête l'exécution si l'URI n'est pas défini
}

// Connexion à MongoDB sans les options obsolètes
mongoose.connect(dbUri)
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données:', err);
  });
