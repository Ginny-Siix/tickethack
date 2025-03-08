var express = require("express");
var router = express.Router();
require('../models/connection');
const Cart = require('../models/carts');


router.get("/", (req, res) => { //:id

  Cart.find()

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