var express = require("express");
var router = express.Router();
require("../models/connection");
const mongoose = require("mongoose");
const Cart = require("../models/carts");
const Trip = require("../models/trips");

/**
 * @route POST /cart/add/:id
 * @desc Ajouter un voyage dans le panier
 */
router.post("/add/:id", async (req, res) => {
  try {
    const tripID = req.params.id;
    const objectId = new mongoose.Types.ObjectId(tripID);

    if (!tripID) {
      return res.json({ result: false, error: "Missing or empty fields" });
    }

    // Vérifier si le trajet existe dans la collection Trip
    const dataTrip = await Trip.findOne({ _id: objectId });
    if (!dataTrip) {
      return res.json({ result: false, error: "Trip not found" });
    }

    // Vérifier si le trajet est déjà dans le panier
    const existingTrip = await Cart.findOne({
      departure: { $regex: new RegExp(dataTrip.departure, "i") },
      arrival: { $regex: new RegExp(dataTrip.arrival, "i") },
      date: dataTrip.date,
      price: dataTrip.price,
    });

    if (existingTrip) {
      return res.json({ result: false, error: "Ce billet existe déjà" });
    }

    // Ajouter le trajet dans le panier
    const newTrip = new Cart({
      departure: dataTrip.departure,
      arrival: dataTrip.arrival,
      date: dataTrip.date,
      price: dataTrip.price,
    });

    await newTrip.save();
    res.json({
      result: true,
      message: "Votre billet a été ajouté dans le panier",
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    res.status(500).json({ result: false, error: "Internal server error" });
  }
});

/**
 * @route GET /cart/
 * @desc Récupérer le contenu du panier
 */
router.get("/", async (req, res) => {
  try {
    const data = await Cart.find().sort({ date: "asc" });
    if (data.length > 0) {
      res.json({ result: true, cart: data });
    } else {
      res.json({ result: false, error: "Cart is empty" });
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du panier:", error);
    res.status(500).json({ result: false, error: "Internal server error" });
  }
});

/**
 * @route DELETE /cart/delete/:id
 * @desc Supprimer un voyage du panier
 */
router.delete("/delete/:id", async (req, res) => {
  try {
    const tripToBeDeleted = req.params.id;
    const objectId = new mongoose.Types.ObjectId(tripToBeDeleted);

    const data = await Cart.deleteOne({ _id: objectId });
    if (data.deletedCount > 0) {
      res.json({ result: true, message: "Trip deleted from cart" });
    } else {
      res.json({ result: false, error: "Trip not found in cart" });
    }
  } catch (error) {
    console.error("Erreur lors de la suppression du trajet:", error);
    res.status(500).json({ result: false, error: "Internal server error" });
  }
});

module.exports = router;
 