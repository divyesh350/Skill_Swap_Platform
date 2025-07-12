// db.js - MongoDB connection setup
const mongoose = require('mongoose');
const winston = require('winston');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    winston.info('MongoDB connected');
  } catch (error) {
    winston.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 