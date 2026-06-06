/**
 * server/config/db.js
 * MongoDB connection
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hakim');
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.warn(`⚠️  MongoDB not connected (demo mode active): ${err.message}`);
  }
};

module.exports = connectDB;
