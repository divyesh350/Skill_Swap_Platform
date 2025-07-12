// user.test.js - Integration tests for User Profile Photo APIs
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const TEST_DB = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/skillswap_test';

describe('User API - Profile Photo', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
    // Register and login a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'photo@example.com',
        password: 'StrongPass123!',
        fullName: 'Photo User'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'photo@example.com',
        password: 'StrongPass123!'
      });
    token = loginRes.body.accessToken || loginRes.body.token;
    const user = await User.findOne({ email: 'photo@example.com' });
    userId = user._id;
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

  it('should upload a profile photo successfully', async () => {
    const res = await request(app)
      .post('/api/users/profile/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'test.jpg'); // minimal JPEG
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('profilePhoto');
    expect(res.body.profilePhoto).toHaveProperty('url');
  });

  it('should fail to upload photo if no file is sent', async () => {
    const res = await request(app)
      .post('/api/users/profile/photo')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/no file/i);
  });

  it('should delete the profile photo successfully', async () => {
    // First upload a photo
    await request(app)
      .post('/api/users/profile/photo')
      .set('Authorization', `Bearer ${token}`)
      .attach('photo', Buffer.from([0xff, 0xd8, 0xff, 0xd9]), 'test.jpg');
    // Then delete
    const res = await request(app)
      .delete('/api/users/profile/photo')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should succeed deleting when no photo exists (idempotent)', async () => {
    const res = await request(app)
      .delete('/api/users/profile/photo')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
}); 