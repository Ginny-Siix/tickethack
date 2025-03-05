var express = require("express");
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');

router.get("/", (req, res) => {
  const { departure, arrival, date, price } = req.query;
  //date = { $regex: `^${date}` };
  //console.log(date);
  //console.log({ departure, arrival, date, price });
  
  Trip.find({ departure, arrival, date: {$regex: `^${date}`} , price })
    .then(data => {
      if (!data) {
        return res.status(404).json({ error: "Trip not found" });
      }
      res.status(200).json({ Tripfound: data });
    })
    .catch(error => {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: "Server error: " + error.message });
    });
});

module.exports = router; // Export the router