var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importation de la connexion à la base de données
require('./models/connection');

// Importation des routeurs
var tripRouter = require('./routes/trip');
var cartRouter = require('./routes/cart');
var bookingsRouter = require('./routes/bookings');

var app = express();

// Configuration CORS
const cors = require('cors');
// Ajoute ici le middleware CORS pour autoriser les requêtes de ton front-end
app.use(cors({
  origin: 'https://tickethack-7w5i.vercel.app',  // Remplace par ton front-end URL
}));

// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'front-end')));

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation des routeurs
app.use('/trip', tripRouter);
app.use('/cart', cartRouter);
app.use('/bookings', bookingsRouter);

module.exports = app;
