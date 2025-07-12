// routes/index.js - Main API route entry
const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Example: router.use('/auth', require('./authRoutes'));
// Add feature routes here as you implement them

router.use('/auth', authRoutes);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router; 