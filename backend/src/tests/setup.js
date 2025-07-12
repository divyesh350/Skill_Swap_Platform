// setup.js - Jest test environment setup
process.env.NODE_ENV = 'test';
require('dotenv').config({ path: require('path').resolve(__dirname, '../config/.env') });

// You can add global setup/teardown logic here if needed
// To use: add "setupFilesAfterEnv": ["<rootDir>/src/tests/setup.js"] to jest.config.js 