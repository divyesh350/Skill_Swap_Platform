// authService.js - Authentication business logic
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const SALT_ROUNDS = 12;

/**
 * Register a new user.
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @returns {Promise<User>}
 * @throws {Error} if user exists or creation fails
 */
async function registerUser(email, password, fullName) {
  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.status = 409;
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Generate email verification token
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  // Create user
  const user = new User({
    email,
    password: hashedPassword,
    emailVerificationToken,
    profile: { fullName },
    emailVerified: false
  });
  await user.save();
  return user;
}

/**
 * Verify a user's email using the verification token.
 * @param {string} token
 * @returns {Promise<User>}
 * @throws {Error} if token is invalid or user already verified
 */
async function verifyEmail(token) {
  const user = await User.findOne({ emailVerificationToken: token });
  if (!user) {
    const err = new Error('Invalid or expired verification token');
    err.status = 400;
    throw err;
  }
  if (user.emailVerified) {
    const err = new Error('Email already verified');
    err.status = 409;
    throw err;
  }
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  return user;
}

/**
 * Login a user and handle lockout, verification, and password check.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: User, accessToken: string, refreshToken: string}>}
 * @throws {Error} for invalid credentials, lockout, or unverified email
 */
async function loginUser(email, password) {
  const user = await User.findOne({ email });
  if (!user) {
    // Prevent email enumeration
    await new Promise(resolve => setTimeout(resolve, 100));
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const err = new Error('Account temporarily locked');
    err.status = 423;
    throw err;
  }
  if (!user.emailVerified) {
    const err = new Error('Email not verified');
    err.status = 403;
    throw err;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000; // 30 min lock
    }
    await user.save();
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  // Reset login attempts on success
  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();
  // Generate tokens
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, role: user.role || 'user' },
    config.jwtSecret,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id, type: 'refresh' },
    config.jwtRefreshSecret,
    { expiresIn: '7d' }
  );
  return { user, accessToken, refreshToken };
}

/**
 * Generate and save a password reset token for the user, and set expiry.
 * @param {string} email
 * @returns {Promise<User>}
 * @throws {Error} if user not found
 */
async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) {
    // Prevent email enumeration
    await new Promise(resolve => setTimeout(resolve, 100));
    const err = new Error('If the email exists, a reset link will be sent');
    err.status = 200;
    throw err;
  }
  const token = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = token;
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();
  return user;
}

/**
 * Reset a user's password using the reset token.
 * @param {string} token
 * @param {string} newPassword
 * @returns {Promise<void>}
 * @throws {Error} if token invalid/expired
 */
async function resetPassword(token, newPassword) {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });
  if (!user) {
    const err = new Error('Invalid or expired reset token');
    err.status = 400;
    throw err;
  }
  user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
}

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword
}; 