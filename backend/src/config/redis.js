// redis.js - Redis client setup for Upstash
const { createClient } = require('redis');
const winston = require('winston');

const redisUrl = process.env.REDIS_URL;

const client = createClient({
  url: redisUrl
});

client.on('error', (err) => {
  winston.error('Redis Client Error:', err);
  // Optionally, you can throw or handle reconnection here
});

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    winston.info('Connected to Redis (Upstash)');
  }
}

module.exports = {
  client,
  connectRedis
}; 