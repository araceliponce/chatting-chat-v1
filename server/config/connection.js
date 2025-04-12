require('dotenv').config(); // al inicio

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todayis4of4");

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ MongoDB connected successfully');
});

module.exports = mongoose.connection