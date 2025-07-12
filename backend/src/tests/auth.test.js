// auth.test.js - Integration tests for Authentication APIs
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const TEST_DB = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/skillswap_test';

describe('Auth API - Register', () => {
  jest.setTimeout(20000); // Increase timeout for slow DB operations

  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
  });
  afterAll(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
    await mongoose.disconnect();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'StrongPass123!',
        fullName: 'Test User'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe('testuser@example.com');
    expect(res.body.user.fullName).toBe('Test User');
    expect(res.body).toHaveProperty('token');
  });

  it('should not allow duplicate email registration', async () => {
    await User.create({
      email: 'dupe@example.com',
      password: 'hashed',
      profile: { fullName: 'Dupe' },
      emailVerified: false
    });
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'dupe@example.com',
        password: 'StrongPass123!',
        fullName: 'Dupe'
      });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('should fail for invalid input (weak password)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'bad@example.com',
        password: '123',
        fullName: 'Bad User'
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/validation/i);
    expect(res.body.details).toBeInstanceOf(Array);
  });
}); 