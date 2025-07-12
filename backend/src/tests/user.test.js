// user.test.js - Integration tests for Offered Skills APIs
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');

const TEST_DB = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/skillswap_test';

describe('User API - Offered Skills', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
    // Register and login a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'skills@example.com',
        password: 'StrongPass123!',
        fullName: 'Skill User'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'skills@example.com',
        password: 'StrongPass123!'
      });
    token = loginRes.body.accessToken || loginRes.body.token;
    const user = await User.findOne({ email: 'skills@example.com' });
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

  it('should add a new offered skill', async () => {
    const res = await request(app)
      .post('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Guitar',
        category: 'Music',
        level: 'Intermediate',
        description: 'Acoustic guitar lessons'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.skill).toHaveProperty('name', 'Guitar');
    expect(res.body.skill).toHaveProperty('category', 'Music');
  });

  it('should get all offered skills for the user', async () => {
    await request(app)
      .post('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Guitar', category: 'Music', level: 'Intermediate' });
    const res = await request(app)
      .get('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.skills)).toBe(true);
    expect(res.body.skills.length).toBe(1);
    expect(res.body.skills[0]).toHaveProperty('name', 'Guitar');
  });

  it('should update an offered skill', async () => {
    const addRes = await request(app)
      .post('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Guitar', category: 'Music', level: 'Intermediate' });
    const skillId = addRes.body.skill._id;
    const res = await request(app)
      .put(`/api/users/skills/offered/${skillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ level: 'Advanced', description: 'Now advanced!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.skill).toHaveProperty('level', 'Advanced');
    expect(res.body.skill).toHaveProperty('description', 'Now advanced!');
  });

  it('should delete an offered skill', async () => {
    const addRes = await request(app)
      .post('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Guitar', category: 'Music', level: 'Intermediate' });
    const skillId = addRes.body.skill._id;
    const res = await request(app)
      .delete(`/api/users/skills/offered/${skillId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should fail validation for missing name', async () => {
    const res = await request(app)
      .post('/api/users/skills/offered')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'Music' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it('should return 404 for updating non-existent skill', async () => {
    const res = await request(app)
      .put('/api/users/skills/offered/605c5f8f8f8f8f8f8f8f8f8f')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('User API - Wanted Skills', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
    // Register and login a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'wanted@example.com',
        password: 'StrongPass123!',
        fullName: 'Wanted User'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wanted@example.com',
        password: 'StrongPass123!'
      });
    token = loginRes.body.accessToken || loginRes.body.token;
    const user = await User.findOne({ email: 'wanted@example.com' });
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

  it('should add a new wanted skill', async () => {
    const res = await request(app)
      .post('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Piano',
        category: 'Music',
        priority: 'High',
        description: 'Learn piano basics'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.skill).toHaveProperty('name', 'Piano');
    expect(res.body.skill).toHaveProperty('category', 'Music');
  });

  it('should get all wanted skills for the user', async () => {
    await request(app)
      .post('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Piano', category: 'Music', priority: 'High' });
    const res = await request(app)
      .get('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.skills)).toBe(true);
    expect(res.body.skills.length).toBe(1);
    expect(res.body.skills[0]).toHaveProperty('name', 'Piano');
  });

  it('should update a wanted skill', async () => {
    const addRes = await request(app)
      .post('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Piano', category: 'Music', priority: 'High' });
    const skillId = addRes.body.skill._id;
    const res = await request(app)
      .put(`/api/users/skills/wanted/${skillId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ priority: 'Medium', description: 'Now intermediate!' });
    expect(res.statusCode).toBe(200);
    expect(res.body.skill).toHaveProperty('priority', 'Medium');
    expect(res.body.skill).toHaveProperty('description', 'Now intermediate!');
  });

  it('should delete a wanted skill', async () => {
    const addRes = await request(app)
      .post('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Piano', category: 'Music', priority: 'High' });
    const skillId = addRes.body.skill._id;
    const res = await request(app)
      .delete(`/api/users/skills/wanted/${skillId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });

  it('should fail validation for missing name', async () => {
    const res = await request(app)
      .post('/api/users/skills/wanted')
      .set('Authorization', `Bearer ${token}`)
      .send({ category: 'Music' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it('should return 404 for updating non-existent skill', async () => {
    const res = await request(app)
      .put('/api/users/skills/wanted/605c5f8f8f8f8f8f8f8f8f8f')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Name' });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });
});

describe('User API - Availability', () => {
  let token;
  let userId;

  beforeAll(async () => {
    await mongoose.connect(TEST_DB);
    // Register and login a test user
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'avail@example.com',
        password: 'StrongPass123!',
        fullName: 'Avail User'
      });
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'avail@example.com',
        password: 'StrongPass123!'
      });
    token = loginRes.body.accessToken || loginRes.body.token;
    const user = await User.findOne({ email: 'avail@example.com' });
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

  it('should get the current user availability', async () => {
    const res = await request(app)
      .get('/api/users/availability')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.availability).toHaveProperty('isAvailable');
    expect(res.body.availability).toHaveProperty('schedule');
  });

  it('should update the user availability', async () => {
    const update = {
      timezone: 'UTC+2',
      isAvailable: false,
      schedule: [
        {
          day: 'Monday',
          timeSlots: [
            { start: '09:00', end: '11:00', isActive: true }
          ]
        }
      ],
      blockedDates: ['2024-06-01']
    };
    const res = await request(app)
      .put('/api/users/availability')
      .set('Authorization', `Bearer ${token}`)
      .send(update);
    expect(res.statusCode).toBe(200);
    expect(res.body.availability).toMatchObject({
      timezone: 'UTC+2',
      isAvailable: false
    });
    expect(res.body.availability.schedule[0]).toHaveProperty('day', 'Monday');
    expect(res.body.availability.schedule[0].timeSlots[0]).toHaveProperty('start', '09:00');
  });

  it('should fail validation for invalid schedule', async () => {
    const res = await request(app)
      .put('/api/users/availability')
      .set('Authorization', `Bearer ${token}`)
      .send({ schedule: [{ day: 'Funday' }] });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/day/i);
  });
}); 