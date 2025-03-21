require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");


// Déclare `app` ici AVANT de l'utiliser
const app = express();
const cors = require("cors");
app.use(cors())

// Importation de la connexion à la base de données
require("./models/connection");

// Importation des routeurs
const tripRouter = require("./routes/trip");
const cartRouter = require("./routes/cart");
const bookingsRouter = require("./routes/bookings");


// Middleware pour parser les requêtes JSON
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation des routeurs
app.use("/trip", tripRouter);
app.use("/cart", cartRouter);
app.use("/bookings", bookingsRouter);

module.exports = app;
