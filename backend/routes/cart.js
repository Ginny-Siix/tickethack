var express = require('express');
var router = express.Router();
require('../models/connection');
const Cart = require('../models/carts');

// ROUTE POST QUI PERMET D'AJOUTER UN VOYAGE DANS LE PANIER
router.post('/add', (req,res) =>{

    console.log('departureCity', req.query.departure);
    console.log('arrivalCity', req.query.arrival);
    console.log('dateTrip', req.query.date);
    console.log('priceTrip', req.query.price)

    // Vérifier que tous les élements sont renseignés et non vides
    if (!req.query.departure || !req.query.arrival || !req.query.date || !req.query.price) {
        res.json({ result: false, error: 'Missing or empty fields' });
    }
    else{
         //convertir la date en entrée du router (qui est en format string) en date
         const dateTrip = new Date(req.query.date);
        console.log("Conversion date ", dateTrip);

    Cart.findOne({
            departure: { $regex: new RegExp(req.query.departure, 'i') },
            arrival: { $regex: new RegExp( req.query.arrival, 'i') },
            date: dateTrip,
            price: req.query.price
        })
    .then(data => { 
        console.log('data',data);
        if(data === null){
            
            const newTrip = new Cart({
                departure: req.query.departure,
                arrival: req.query.arrival,
                date: req.query.date,
                price: req.query.price
            })

            newTrip.save().then(newTrip =>{
                res.json({result: true});

            })}

        else{
            res.json({result:false, error:'Trip already in the cart'});
        }

})}
})

//AJOUT DE LA ROUTE GET CART POUR AFFICHER LE CONTENU DE LA COLLECTION CART
router.get("/", (req, res) => {
    Cart.find().then(data => {
      if (data) {
        res.json({ result: true, cart : data });
      } else {
        res.json({ result: false, error: "Cart is empty" });
      }
    });
  });
  
  



module.exports = router;