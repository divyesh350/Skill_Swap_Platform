// authRoutes.js - Authentication routes
const express = require('express');
const { registerValidator } = require('../validators/authValidator');
const { register } = require('../controllers/authController');
const { verifyEmailValidator } = require('../validators/authValidator');
const { verifyEmailController } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidator');
const { login } = require('../controllers/authController');
const { forgotPasswordValidator, resetPasswordValidator } = require('../validators/authValidator');
const { forgotPasswordController, resetPasswordController } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register new user
router.post('/register', registerValidator, register);

// @route   POST /api/auth/verify-email
// @desc    Verify email
router.post('/verify-email', verifyEmailValidator, verifyEmailController);

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', loginValidator, login);

router.post('/forgot-password', forgotPasswordValidator, forgotPasswordController);
router.post('/reset-password', resetPasswordValidator, resetPasswordController);

module.exports = router; 