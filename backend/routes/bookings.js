var express = require("express");
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');
const moment = require('moment');

router.get("/", (req, res) => {
  const date = new Date(req.query.date);
  // Définir la date de début et la date de fin de la journée du voyage
  //const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
  //const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée
  console.log("Conversion date ", date);
  Trip.find({
    departure: { $regex: new RegExp(req.query.departure, 'i') },
    arrival: { $regex: new RegExp(req.query.arrival, 'i') },
    // Recherche entre le début et la fin de la journée
    date: { $gte: moment(date).startOf('day'), $lte: moment(date).endOf('day') }})
    .then(data => {
      console.log(data);
      if (data.length > 0) {
        return res.json({ Tripfound: data });
      }
      else {
        return res.json({ error: "Trip not found" });
      }
    })
    .catch(error => {
      console.error("Error fetching trips:", error);
      res.json({ error: "Server error: " + error.message });
    });
    console.log(req.query.arrival);
});

module.exports = router; // Export the router