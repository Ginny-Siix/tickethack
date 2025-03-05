const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    departure: String,
    arrival: String,
    date: Date,
    price: Number,
});

const cart = mongoose.model('cart', cartSchema);

module.exports = cart;
