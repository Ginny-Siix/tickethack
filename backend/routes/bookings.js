var express = require("express");
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');
const moment = require('moment');
//var mongoose = require('mongoose');

router.get("/", (req, res) => { //:id
  const tempObject = { departure: "Lyon", arrival: "Paris", 
    date: "2025-03-03T11:23:04.165+00:00", price: 137};
  // req.query is replaced by tempObject
  const date = new Date(tempObject.date);
  // Définir la date de début et la date de fin de la journée du voyage
  const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
  const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée
  //console.log("Conversion date ", date);
  // Using params
  //console.log(mongoose.Types.ObjectId.isValid('67c71793f2cecf2d3cdda3d8'));
  //console.log(req.params);
  //const {id}  = req.params;
  Trip.find({ //findById
    departure: { $regex: new RegExp(tempObject.departure, 'i') },
    arrival: { $regex: new RegExp(tempObject.arrival, 'i') },
    // Recherche entre le début et la fin de la journée
    date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') }})
    .then(data => {
      console.log(data);
      if (data.length > 0) { //data.length > 0
        return res.json( data );
      }
      else {
        return res.json({ error: "Trip not found" });
      }
    })
    .catch(error => {
      console.error("Error fetching trips:", error);
      res.json({ error: "Server error: " + error.message });
    });
});

module.exports = router; // Export the router