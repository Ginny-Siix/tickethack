const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
require('dotenv').config();  // Charge les variables d'environnement


// Importation de la connexion à la base de données
require("./models/connection");

// Importation des routeurs
const tripRouter = require("./routes/trip");
const cartRouter = require("./routes/cart");
const bookingsRouter = require("./routes/bookings");

const app = express();

// Configuration CORS
const cors = require("cors");
// app.use(
//   cors({
//     origin: "https://tickethack-git-main-ginny-siixs-projects.vercel.app", // Remplace par l'URL de ton front-end
//   })
// );




// Middleware pour parser les requêtes JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Utilisation des routeurs
app.use("/trip", tripRouter);
app.use("/cart", cartRouter);
app.use("/bookings", bookingsRouter);

module.exports = app;
