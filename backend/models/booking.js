const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  departure: String,
  arrival: String,
  date: Date,
  price: Number,
  archived: { type: Boolean, default: false } // Nouveau champ pour archiver les réservations
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
