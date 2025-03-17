var express = require("express");
var router = express.Router();
require("../models/connection"); // Import de la connexion à la base de données
const Trip = require("../models/trips"); // Import du modèle de trajet
const moment = require("moment"); // Import de moment.js pour la gestion des dates

router.get('/all', async function (req, res) {
  // Récupérer tous les trajets
  const trips = await Trip.find();
  // Si il y a des trajets
  if (trips.length > 0) {
    res.json({ result: true, trips: trips });
  } else {
    res.json({ result: false, error: "No trips found" });
  }
});


// GET - Afficher la liste des voyages en fonction des critères de recherche
router.get("/search", async (req, res) => {
  console.log("CC world")
  try {
    // Récupération des paramètres de la requête
    const { departure, arrival, date } = req.query;

    // Vérifier que tous les champs sont fournis et non vides
    if (!departure || !arrival || !date) {
      return res.json({ result: false, error: "Missing or empty fields" });
    }

    // Vérifier si la date fournie est valide (format attendu : YYYY-MM-DD)
    const parsedDate = moment(date, "YYYY-MM-DD", true);
    if (!parsedDate.isValid()) {
      return res.json({ result: false, error: "Invalid date format" });
    }

    // Définir les limites de la journée recherchée (00:00 à 23:59)
    const startOfDay = parsedDate.startOf("day").toDate(); // Début de la journée
    const endOfDay = parsedDate.endOf("day").toDate(); // Fin de la journée

    // Rechercher les trajets qui correspondent aux critères
    const trips = await Trip.find({
      departure: { $regex: new RegExp(departure, "i") }, // Recherche insensible à la casse sur la ville de départ
      arrival: { $regex: new RegExp(arrival, "i") }, // Recherche insensible à la casse sur la ville d'arrivée
      date: { $gte: startOfDay, $lte: endOfDay }, // Vérifier que la date est bien dans la journée
    }).sort({ date: "asc" }); // Trier les résultats par date croissante

    // Vérifier si des trajets ont été trouvés
    if (trips.length > 0) {
      res.json({ result: true, trips }); // Retourner les trajets trouvés
    } else {
      res.json({ result: false, error: "No trips found" }); // Aucun trajet trouvé
    }
  } catch (error) {
    console.error("Erreur lors de la recherche des voyages:", error);
    res.status(500).json({ result: false, error: "Internal server error" }); // Gérer les erreurs serveur
  }
});

module.exports = router; // Exporter le router pour utilisation dans l'application principale
