const express = require("express");
require('dotenv').config();
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

app.get('/', (req, res) => {
  console.log('Request received');  // Ajoute des logs ici
  res.send('Hello world');
});


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
