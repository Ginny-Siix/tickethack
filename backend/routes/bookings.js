const express = require("express");
const router = express.Router();
require("../models/connection");
const Cart = require("../models/carts");
const Booking = require("../models/booking");

// ROUTE POST - Valider les billets dans les réservations
// ROUTE POST - Valider les billets dans les réservations
// ROUTE POST - Valider les billets dans les réservations
router.post("/pay", async (req, res) => {
  try {
    // Récupérer tous les trajets du panier
    const cartItems = await Cart.find();

    if (cartItems.length === 0) {
      return res.json({ result: false, error: "Le panier est vide" });
    }

    // Créer les réservations à partir des éléments du panier
    const bookings = cartItems.map((item) => {
      return new Booking({
        departure: item.departure,
        arrival: item.arrival,
        date: item.date,
        price: item.price,
      });
    });

    // Sauvegarder les réservations dans la collection Bookings
    await Booking.insertMany(bookings);

    // Supprimer les éléments du panier après les avoir validés
    await Cart.deleteMany();

    res.json({
      result: true,
      message:
        "Les billets ont été validés et transférés dans les réservations.",
    });
  } catch (error) {
    console.error("Erreur lors du transfert vers les réservations:", error);
    res
      .status(500)
      .json({ result: false, error: "Erreur serveur: " + error.message });
  }
});

// ROUTE PUT - Archiver une réservation
router.put("/archive/:id", async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Mettre à jour le champ 'archived' pour marquer la réservation comme archivée
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { archived: true },
      { new: true } // Retourne la réservation mise à jour
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ result: false, error: "Réservation non trouvée" });
    }

    res.json({
      result: true,
      message: "Réservation archivée avec succès",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Erreur lors de l'archivage de la réservation :", error);
    res
      .status(500)
      .json({ result: false, error: "Erreur serveur : " + error.message });
  }
});

// ROUTE GET - Récupérer toutes les réservations
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find(); // Récupérer toutes les réservations
    if (bookings.length > 0) {
      return res.json(bookings); // Renvoyer les réservations au format JSON
    } else {
      return res.json([]); // Si aucune réservation n'est trouvée, renvoyer un tableau vide
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations:", error);
    res.status(500).json({ error: "Erreur serveur: " + error.message });
  }
});

router.delete("/delete", (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Aucun ID fourni." });
  }

  Booking.deleteMany({ _id: { $in: ids } })
    .then(() => {
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression des réservations :", error);
      res
        .status(500)
        .json({ success: false, message: "Erreur lors de la suppression." });
    });
});
module.exports = router; // Exporter le router
