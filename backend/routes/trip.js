var express = require('express');
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');


//GET - Afficher la liste des voyages en fonction de la ville de départ et d'arrivée saisie par l'utilisateur
router.get('/search', (req, res) => {
    console.log('departureCity', req.body.departure);
    console.log('arrivalCity', req.body.arrival);
    console.log('dateTrip', req.body.date);
    // Vérifier que tous les élements sont renseignés et non vides
    if (!req.body.departure || !req.body.arrival || !req.body.date) {
        res.json({ result: false, error: 'Missing or empty fields' });
    }
    else {
        //convertir la date en entrée du router (qui est en format string) en date
        const date = new Date(req.body.date);
         // Définir la date de début et la date de fin de la journée du voyage 
        const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
        const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée
        console.log("Conversion date ", date);
        Trip.find({
            departure: { $regex: new RegExp(req.body.departure, 'i') },
            arrival: { $regex: new RegExp(req.body.arrival, 'i') },
            // Recherche entre le début et la fin de la journée
            date: {  $gte: startOfDay, $lte: endOfDay }
        })
            //gte : greater than equal : chercher à partir de cette date là
            .then(data => {
                console.log('list of departures and arrivals', data);
                if (data.length >0) {

                    res.json({ result: true, trips: data });
                }

                else {
                    res.json({ result: false, error: "No trips found" });
                }
            })
    }
})


module.exports = router;