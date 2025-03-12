require('dotenv').config();  // Charge les variables d'environnement depuis le fichier .env
const mongoose = require('mongoose');

const dbUri = process.env.MONGODB_URI;  // Récupère l'URI de connexion à MongoDB depuis .env

// Vérifie si l'URI est bien définie, sinon, on arrête le processus
if (!dbUri) {
  console.error("La variable d'environnement MONGODB_URI est manquante !");
  process.exit(1);  // Arrête l'exécution si l'URI n'est pas défini
}

// Connexion à MongoDB avec une gestion d'erreur avancée
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à la base de données réussie');
  })
  .catch((err) => {
    console.error('Erreur de connexion à la base de données:', err.message);
  });
