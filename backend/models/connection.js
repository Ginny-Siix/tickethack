const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://sabrinaoulmane:ojznLRfqSxfUn5aq@cluster0.hahs6.mongodb.net/tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
