var express = require('express');
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');


//GET - Afficher la liste des voyages en fonction de la ville de départ et d'arrivée saisie par l'utilisateur
router.get('/search', (req,res) =>{
    console.log('departureCity', req.body.departure);
    console.log('departureArrival', req.body.arrival);
    // Vérifier que tous les élements sont renseignés et non vides
    if(!req.body.departure || !req.body.arrival)
    {
        res.json({result:false, error:'Missing or empty fields'});
    }
    else{
    Trip.find({ departure: { $regex: new RegExp(req.body.departure, 'i') } ,arrival: { $regex: new RegExp(req.body.arrival, 'i') } })
    .then(data =>{ 
        console.log('list departures and arrivals',data);
        if(data){
            
            res.json({result:true, trips: data});
            }

        else{
            res.json({result: false, error: "No trips found"});
        }
})}})
 


module.exports = router;