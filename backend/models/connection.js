const mongoose = require('mongoose');
//mongodb+srv://sabrinaoulmane:ojznLRfqSxfUn5aq@cluster0.hahs6.mongodb.net
const connectionString = 'mongodb+srv://admin:T07J950p3BMfxqpi@cluster0.aotgd.mongodb.net/Tickethack';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
