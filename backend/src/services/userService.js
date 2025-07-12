// userService.js - Business logic for user profile
const User = require('../models/User');
const { uploadProfilePhoto: uploadToCloudinary, deleteProfilePhoto: deleteFromCloudinary } = require('./cloudinaryService');

/**
 * Get the current user's complete profile.
 * @param {string} userId
 * @returns {Promise<User>}
 */
async function getCurrentUserProfile(userId) {
  return User.findById(userId).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');
}

/**
 * Update the current user's profile fields.
 * @param {string} userId
 * @param {Object} updates
 * @returns {Promise<User>}
 */
async function updateCurrentUserProfile(userId, updates) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (updates.fullName) user.profile.fullName = updates.fullName;
  if (updates.bio !== undefined) user.profile.bio = updates.bio;
  if (updates.location) {
    user.profile.location = {
      ...user.profile.location,
      ...updates.location
    };
  }
  if (updates.timezone) user.profile.timezone = updates.timezone;
  if (updates.preferences) user.preferences = { ...user.preferences, ...updates.preferences };
  await user.save();
  return user;
}

/**
 * Get a public profile by user ID (excludes sensitive fields).
 * @param {string} userId
 * @returns {Promise<User>}
 */
async function getPublicUserProfile(userId) {
  return User.findById(userId)
    .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires -accountStatus -loginAttempts -lockUntil');
}

/**
 * Set (upload) a new profile photo for the user.
 * @param {string} userId
 * @param {Buffer} buffer
 * @returns {Promise<User>}
 */
async function setProfilePhoto(userId, buffer) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  // Delete old photo if exists
  if (user.profile.profilePhoto && user.profile.profilePhoto.publicId) {
    await deleteFromCloudinary(user.profile.profilePhoto.publicId);
  }
  // Upload new photo
  const { url, publicId } = await uploadToCloudinary(buffer);
  user.profile.profilePhoto = {
    url,
    publicId,
    uploadDate: new Date()
  };
  await user.save();
  return user;
}

/**
 * Delete the user's profile photo from Cloudinary and DB.
 * @param {string} userId
 * @returns {Promise<User>}
 */
async function removeProfilePhoto(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.profile.profilePhoto && user.profile.profilePhoto.publicId) {
    await deleteFromCloudinary(user.profile.profilePhoto.publicId);
  }
  user.profile.profilePhoto = undefined;
  await user.save();
  return user;
}

/**
 * Get all offered skills for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getOfferedSkills(userId) {
  const user = await User.findById(userId).select('skills.offered');
  if (!user) throw new Error('User not found');
  return user.skills.offered;
}

/**
 * Add a new offered skill for a user.
 * @param {string} userId
 * @param {Object} skillData
 * @returns {Promise<Object>} The added skill
 */
async function addOfferedSkill(userId, skillData) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.skills.offered.push(skillData);
  await user.save();
  return user.skills.offered[user.skills.offered.length - 1];
}

/**
 * Update an offered skill for a user.
 * @param {string} userId
 * @param {string} skillId
 * @param {Object} updates
 * @returns {Promise<Object>} The updated skill
 */
async function updateOfferedSkill(userId, skillId, updates) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const skill = user.skills.offered.id(skillId);
  if (!skill) throw new Error('Skill not found');
  Object.assign(skill, updates);
  await user.save();
  return skill;
}

/**
 * Delete an offered skill for a user.
 * @param {string} userId
 * @param {string} skillId
 * @returns {Promise<void>}
 */
async function deleteOfferedSkill(userId, skillId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const skill = user.skills.offered.id(skillId);
  if (!skill) throw new Error('Skill not found');
  skill.remove();
  await user.save();
}

/**
 * Get all wanted skills for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getWantedSkills(userId) {
  const user = await User.findById(userId).select('skills.wanted');
  if (!user) throw new Error('User not found');
  return user.skills.wanted;
}

/**
 * Add a new wanted skill for a user.
 * @param {string} userId
 * @param {Object} skillData
 * @returns {Promise<Object>} The added skill
 */
async function addWantedSkill(userId, skillData) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.skills.wanted.push(skillData);
  await user.save();
  return user.skills.wanted[user.skills.wanted.length - 1];
}

/**
 * Update a wanted skill for a user.
 * @param {string} userId
 * @param {string} skillId
 * @param {Object} updates
 * @returns {Promise<Object>} The updated skill
 */
async function updateWantedSkill(userId, skillId, updates) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const skill = user.skills.wanted.id(skillId);
  if (!skill) throw new Error('Skill not found');
  Object.assign(skill, updates);
  await user.save();
  return skill;
}

/**
 * Delete a wanted skill for a user.
 * @param {string} userId
 * @param {string} skillId
 * @returns {Promise<void>}
 */
async function deleteWantedSkill(userId, skillId) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const skill = user.skills.wanted.id(skillId);
  if (!skill) throw new Error('Skill not found');
  skill.remove();
  await user.save();
}

/**
 * Get the current user's availability.
 * @param {string} userId
 * @returns {Promise<Object>}
 */
async function getAvailability(userId) {
  const user = await User.findById(userId).select('availability');
  if (!user) throw new Error('User not found');
  return user.availability;
}

/**
 * Update the current user's availability.
 * @param {string} userId
 * @param {Object} updates
 * @returns {Promise<Object>} The updated availability
 */
async function updateAvailability(userId, updates) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.availability = {
    ...user.availability.toObject(),
    ...updates,
    lastUpdated: new Date()
  };
  await user.save();
  return user.availability;
}

module.exports = {
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
}; 