// authController.js - Authentication request handlers
const { validationResult } = require('express-validator');
const { registerUser, verifyEmail, loginUser, forgotPassword, resetPassword } = require('../services/authService');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendMail } = require('../config/nodemailer');

/**
 * Register a new user controller
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function register(req, res, next) {
  try {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { email, password, fullName } = req.body;
    const user = await registerUser(email, password, fullName);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || 'user' },
      config.jwtSecret,
      { expiresIn: '15m' }
    );

    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      user: { id: user._id, email: user.email, fullName: user.profile.fullName },
      token
    });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Verify email controller
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function verifyEmailController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { token } = req.body;
    await verifyEmail(token);
    res.json({ message: 'Email verified successfully', verified: true });
  } catch (err) {
    if (err.status === 400 || err.status === 409) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Login controller
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(email, password);
    res.json({
      token: accessToken,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.profile.fullName,
        profileComplete: !!(user.profile && user.profile.fullName && user.skills && user.skills.offered.length > 0)
      },
      expiresIn: 15 * 60 // 15 minutes in seconds
    });
  } catch (err) {
    if ([401, 403, 423].includes(err.status)) {
      return res.status(err.status).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Forgot password controller
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function forgotPasswordController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { email } = req.body;
    try {
      const user = await forgotPassword(email);
      // Send reset email
      const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${user.passwordResetToken}`;
      await sendMail({
        to: user.email,
        subject: 'Skill Swap Password Reset',
        html: `<p>You requested a password reset. <a href="${resetUrl}">Click here to reset your password</a>.<br/>If you did not request this, please ignore this email.</p>`
      });
    } catch (err) {
      // Always return generic message for security
    }
    res.json({ message: 'If the email exists, a reset link will be sent.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Reset password controller
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function resetPasswordController(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const { token, newPassword } = req.body;
    await resetPassword(token, newPassword);
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  register,
  verifyEmailController,
  login,
  forgotPasswordController,
  resetPasswordController
}; 