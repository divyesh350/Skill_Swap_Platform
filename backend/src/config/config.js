// config.js - Centralized configuration
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  redisUrl: process.env.REDIS_URL,
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  email: {
    provider: process.env.EMAIL_PROVIDER,
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.EMAIL_FROM
  }
}; 