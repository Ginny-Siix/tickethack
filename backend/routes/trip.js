var express = require('express');
var router = express.Router();
require('../models/connection');
const Trip = require('../models/trips');
//const moment = require('moment-timezone');
const moment = require('moment');


//GET - Afficher la liste des voyages en fonction de la ville de départ et d'arrivée saisie par l'utilisateur
router.get('/search', (req, res) => {

    // Vérifier que tous les élements sont renseignés et non vides
    if (!req.query.departure || !req.query.arrival || !req.query.date) {
        res.json({ result: false, error: 'Missing or empty fields' });
    }
    else {
        //convertir la date en entrée du router (qui est en format string) en date
        const date = req.query.date;
   
         // Définir la date de début et la date de fin de la journée du voyage 
        //const startOfDay = new Date(date.setHours(0, 0, 0, 0)); // Début de la journée
        const startOfDay = moment(date).startOf('day');
        //const endOfDay = new Date(date.setHours(23, 59, 59, 999)); // Fin de la journée
        const endOfDay = moment(date).endOf('day');
        Trip.find({
            departure: { $regex: new RegExp(req.query.departure, 'i') },
            arrival: { $regex: new RegExp( req.query.arrival, 'i') },
            // Recherche entre le début et la fin de la journée
            date: {  $gte: startOfDay, $lte: endOfDay }
        })
            .sort({date: 'asc'})
            .then(data => {

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