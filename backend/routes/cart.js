var express = require('express');
var router = express.Router();
require('../models/connection');
const mongoose = require('mongoose');
const Cart = require('../models/carts');
const Trip = require('../models/trips');
const moment = require('moment');

// ROUTE POST QUI PERMET D'AJOUTER UN VOYAGE DANS LE PANIER
router.post('/add/:id', (req, res) => {

  const tripID = req.params.id;

  const objectId = new mongoose.Types.ObjectId(tripID);
  console.log("Converted ObjectId: ", objectId);

  // Vérifier que tous les élements sont renseignés et non vides
  if (!req.params.id) {
    res.json({ result: false, error: 'Missing or empty fields' });
  }
  else {

    Trip.findOne({
      _id: objectId,
    })
      .then(dataTrip => {
        console.log('data', dataTrip);
        if (dataTrip !== null) {
          Cart.findOne({
            departure: { $regex: new RegExp(dataTrip.departure, 'i') },
            arrival: { $regex: new RegExp(dataTrip.arrival, 'i') },
            date: dataTrip.date,
            price: dataTrip.price
          })
            .then(dataCart => {
              if (dataCart === null) {
                const newTrip = new Cart({
                  departure: dataTrip.departure,
                  arrival: dataTrip.arrival,
                  date: dataTrip.date,
                  price: dataTrip.price
                })

                newTrip.save().then(newTrip => {
                  console.log('Trip well added : ', dataTrip);
                  res.json({ result: true });
                })
              }
            })
        }

        else {
          console.log("Trip is not added backend");
          console.log("data ", dataTrip);
          res.json({ result: false, error: 'Trip already in the cart' });
        }

      })
  }
})

//AJOUT DE LA ROUTE GET CART POUR AFFICHER LE CONTENU DE LA COLLECTION CART
router.get("/", (req, res) => {
  Cart.find().sort({ date: 'asc' }).then(data => {
    if (data && data.length > 0) {
      res.json({ result: true, cart: data });
    } else {
      res.json({ result: false, error: "Cart is empty" });
    }
  });
});

//route delete : pour supprimer un voyage dans la collection cart
router.delete("/delete/:id", (req, res) => {
  const tripToBeDeleted = req.params.id;

  const objectId = new mongoose.Types.ObjectId(tripToBeDeleted);
  console.log("Converted ObjectId: ", objectId);


  Cart.deleteOne({ _id: objectId })
    .then(data => {

      if (data.deletedCount > 0) {
        console.log("Trip deleted : ", tripToBeDeleted);
        res.json({ result: true });

      }
      else {
        console.log("Trip that is not deleted : ", data);
        res.json({ result: false, error: "Trip is not deleted in the cart because not found or already deleted" })
      }

    })
})





module.exports = router;