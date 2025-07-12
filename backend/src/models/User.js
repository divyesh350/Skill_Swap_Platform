// User.js - Mongoose User Schema
const mongoose = require('mongoose');

/**
 * User Schema for Skill Swap Platform
 * @module models/User
 */
const skillOfferedSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
  description: { type: String, trim: true, maxlength: 200 },
  endorsements: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const skillWantedSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  description: { type: String, trim: true, maxlength: 200 },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const userSchema = new mongoose.Schema({
  // Authentication fields
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },

  // Profile information
  profile: {
    fullName: { type: String, required: true, trim: true },
    bio: { type: String, trim: true, maxlength: 500 },
    location: {
      city: String,
      country: String,
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    profilePhoto: {
      url: String,
      publicId: String,
      uploadDate: Date
    },
    isPublic: { type: Boolean, default: true },
    timezone: { type: String, default: 'UTC' },
    languages: [String]
  },

  // Skills management
  skills: {
    offered: [skillOfferedSchema],
    wanted: [skillWantedSchema]
  },

  // Availability configuration
  availability: {
    timezone: { type: String },
    isAvailable: { type: Boolean, default: true },
    schedule: [
      {
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
        timeSlots: [
          {
            start: String, // HH:MM
            end: String,   // HH:MM
            isActive: { type: Boolean, default: true }
          }
        ]
      }
    ],
    blockedDates: [Date],
    lastUpdated: { type: Date, default: Date.now }
  },

  // Reputation system
  reputation: {
    overallRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    completedSwaps: { type: Number, default: 0 },
    cancelledSwaps: { type: Number, default: 0 },
    responseTime: { type: Number, default: 24 },
    reliabilityScore: { type: Number, default: 100, min: 0, max: 100 }
  },

  // User preferences
  preferences: {
    emailNotifications: {
      newRequests: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    inAppNotifications: { type: Boolean, default: true },
    maxDistance: { type: Number, default: 50 },
    preferredLanguages: [String],
    autoAcceptSimilarSkills: { type: Boolean, default: false }
  },

  // Account management
  accountStatus: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
  lastLoginAt: { type: Date },
  lastActiveAt: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },

  // Audit fields
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 