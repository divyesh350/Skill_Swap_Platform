// userController.js - User profile request handlers
const { validationResult } = require('express-validator');
const {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getPublicUserProfile,
  setProfilePhoto,
  removeProfilePhoto,
  getOfferedSkills,
  addOfferedSkill,
  updateOfferedSkill,
  deleteOfferedSkill,
  getWantedSkills,
  addWantedSkill,
  updateWantedSkill,
  deleteWantedSkill,
  getAvailability,
  updateAvailability
} = require('../services/userService');

/**
 * Get current user's complete profile
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function getCurrentProfile(req, res, next) {
  try {
    const user = await getCurrentUserProfile(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * Update current user's profile
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function updateCurrentProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }
    const user = await updateCurrentUserProfile(req.user.id, req.body);
    res.json({ user });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Get public profile by user ID
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function getPublicProfile(req, res, next) {
  try {
    const user = await getPublicUserProfile(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

/**
 * Upload a new profile photo for the current user
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function uploadProfilePhoto(req, res, next) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const user = await setProfilePhoto(req.user.id, req.file.buffer);
    res.json({ message: 'Profile photo updated', profilePhoto: user.profile.profilePhoto });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Delete the current user's profile photo
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
async function deleteProfilePhoto(req, res, next) {
  try {
    const user = await removeProfilePhoto(req.user.id);
    res.json({ message: 'Profile photo deleted' });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Get all offered skills for the current user
 */
async function getOfferedSkillsController(req, res, next) {
  try {
    const skills = await getOfferedSkills(req.user.id);
    res.json({ skills });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Add a new offered skill for the current user
 */
async function addOfferedSkillController(req, res, next) {
  try {
    const skill = await addOfferedSkill(req.user.id, req.body);
    res.status(201).json({ skill });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Update an offered skill for the current user
 */
async function updateOfferedSkillController(req, res, next) {
  try {
    const skill = await updateOfferedSkill(req.user.id, req.params.skillId, req.body);
    res.json({ skill });
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Skill not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Delete an offered skill for the current user
 */
async function deleteOfferedSkillController(req, res, next) {
  try {
    await deleteOfferedSkill(req.user.id, req.params.skillId);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Skill not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Get all wanted skills for the current user
 */
async function getWantedSkillsController(req, res, next) {
  try {
    const skills = await getWantedSkills(req.user.id);
    res.json({ skills });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Add a new wanted skill for the current user
 */
async function addWantedSkillController(req, res, next) {
  try {
    const skill = await addWantedSkill(req.user.id, req.body);
    res.status(201).json({ skill });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Update a wanted skill for the current user
 */
async function updateWantedSkillController(req, res, next) {
  try {
    const skill = await updateWantedSkill(req.user.id, req.params.skillId, req.body);
    res.json({ skill });
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Skill not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Delete a wanted skill for the current user
 */
async function deleteWantedSkillController(req, res, next) {
  try {
    await deleteWantedSkill(req.user.id, req.params.skillId);
    res.json({ message: 'Skill deleted' });
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'Skill not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Get the current user's availability
 */
async function getAvailabilityController(req, res, next) {
  try {
    const availability = await getAvailability(req.user.id);
    res.json({ availability });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

/**
 * Update the current user's availability
 */
async function updateAvailabilityController(req, res, next) {
  try {
    const availability = await updateAvailability(req.user.id, req.body);
    res.json({ availability });
  } catch (err) {
    if (err.message === 'User not found') {
      return res.status(404).json({ error: err.message });
    }
    next(err);
  }
}

module.exports = {
  getCurrentProfile,
  updateCurrentProfile,
  getPublicProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  getOfferedSkillsController,
  addOfferedSkillController,
  updateOfferedSkillController,
  deleteOfferedSkillController,
  getWantedSkillsController,
  addWantedSkillController,
  updateWantedSkillController,
  deleteWantedSkillController,
  getAvailabilityController,
  updateAvailabilityController
}; 