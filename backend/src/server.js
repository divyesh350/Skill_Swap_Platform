// server.js - Main entry point
const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const winston = require('winston');

// Load environment variables
dotenv.config({ path: require('path').resolve(__dirname, '../config/.env') });

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Attach io to app for access in routes/controllers
app.set('io', io);

// Start server
server.listen(PORT, () => {
  winston.info(`Server running on port ${PORT}`);
}); 