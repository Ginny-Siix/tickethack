var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


require('./models/connection');

var tripRouter = require('./routes/trip');
var cartRouter = require('./routes/cart');
var bookingsRouter = require('./routes/bookings');
<<<<<<< HEAD
=======

>>>>>>> d1f0ce045472716df5961dbc72680ef2b0d0ced1

var app = express();

const cors = require('cors');
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/trip', tripRouter);
<<<<<<< HEAD
app.use('/cart', cartRouter);
app.use('/bookings', bookingsRouter);
=======
app.use('/cart', cartRouter)
app.use('bookings',bookingsRouter)

>>>>>>> d1f0ce045472716df5961dbc72680ef2b0d0ced1


module.exports = app;
