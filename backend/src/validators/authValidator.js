// authValidator.js - Validation for authentication routes
const { body } = require('express-validator');

/**
 * Registration input validation middleware
 * - Email: required, valid format
 * - Password: min 8 chars, upper, lower, number, special char
 * - fullName: 2-50 chars, letters and spaces only
 */
const registerValidator = [
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain only letters and spaces')
];

/**
 * Email verification input validation
 * - token: required, string, length 32-128
 */
const verifyEmailValidator = [
  body('token')
    .isString().withMessage('Token must be a string')
    .isLength({ min: 32, max: 128 }).withMessage('Invalid token length')
];

/**
 * Login input validation
 * - email: required, valid format
 * - password: required
 */
const loginValidator = [
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail(),
  body('password')
    .isString().withMessage('Password is required')
    .notEmpty().withMessage('Password cannot be empty')
];

/**
 * Forgot password input validation
 * - email: required, valid format
 */
const forgotPasswordValidator = [
  body('email')
    .isEmail().withMessage('Valid email required')
    .normalizeEmail()
];

/**
 * Reset password input validation
 * - token: required, string, length 32-128
 * - newPassword: required, strong password
 */
const resetPasswordValidator = [
  body('token')
    .isString().withMessage('Token must be a string')
    .isLength({ min: 32, max: 128 }).withMessage('Invalid token length'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain a number')
    .matches(/[^A-Za-z0-9]/).withMessage('Password must contain a special character')
];

module.exports = {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
}; 