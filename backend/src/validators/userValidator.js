// userValidator.js - Validation for user profile routes
const { body } = require('express-validator');

/**
 * Update profile input validation middleware
 * - fullName: optional, 2-50 chars, letters and spaces
 * - bio: optional, max 500 chars
 * - location: optional, city/country strings
 * - timezone: optional, string
 * - preferences: optional, object
 */
const updateProfileValidator = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Full name must be 2-50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Full name must contain only letters and spaces'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  body('location.city')
    .optional()
    .isString().withMessage('City must be a string'),
  body('location.country')
    .optional()
    .isString().withMessage('Country must be a string'),
  body('timezone')
    .optional()
    .isString().withMessage('Timezone must be a string'),
  body('preferences')
    .optional()
    .isObject().withMessage('Preferences must be an object')
];

/**
 * Offered skill input validation middleware
 * - name: required, 2-50 chars
 * - category: required
 * - level: optional, must be one of enum
 * - description: optional, max 200 chars
 */
const offeredSkillValidator = [
  body('name')
    .exists().withMessage('Skill name is required')
    .isString().withMessage('Skill name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Skill name must be 2-50 characters'),
  body('category')
    .exists().withMessage('Category is required')
    .isString().withMessage('Category must be a string'),
  body('level')
    .optional()
    .isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid skill level'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
];

/**
 * Wanted skill input validation middleware
 * - name: required, 2-50 chars
 * - category: required
 * - priority: optional, must be one of enum
 * - description: optional, max 200 chars
 */
const wantedSkillValidator = [
  body('name')
    .exists().withMessage('Skill name is required')
    .isString().withMessage('Skill name must be a string')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Skill name must be 2-50 characters'),
  body('category')
    .exists().withMessage('Category is required')
    .isString().withMessage('Category must be a string'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High']).withMessage('Invalid skill priority'),
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
];

/**
 * Availability input validation middleware
 * - timezone: optional, string
 * - isAvailable: optional, boolean
 * - schedule: optional, array of days with timeSlots
 * - blockedDates: optional, array of dates
 */
const availabilityValidator = [
  body('timezone')
    .optional()
    .isString().withMessage('Timezone must be a string'),
  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
  body('schedule')
    .optional()
    .isArray().withMessage('Schedule must be an array'),
  body('schedule.*.day')
    .optional()
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Day must be a valid weekday'),
  body('schedule.*.timeSlots')
    .optional()
    .isArray().withMessage('timeSlots must be an array'),
  body('schedule.*.timeSlots.*.start')
    .optional()
    .matches(/^\d{2}:\d{2}$/).withMessage('Start time must be in HH:MM format'),
  body('schedule.*.timeSlots.*.end')
    .optional()
    .matches(/^\d{2}:\d{2}$/).withMessage('End time must be in HH:MM format'),
  body('schedule.*.timeSlots.*.isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean'),
  body('blockedDates')
    .optional()
    .isArray().withMessage('blockedDates must be an array'),
  body('blockedDates.*')
    .optional()
    .isISO8601().withMessage('Each blocked date must be a valid date')
];

module.exports = { updateProfileValidator, offeredSkillValidator, wantedSkillValidator, availabilityValidator }; 