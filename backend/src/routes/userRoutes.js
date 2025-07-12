// userRoutes.js - User profile and public profile routes
const express = require('express');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { updateProfileValidator, offeredSkillValidator, wantedSkillValidator, availabilityValidator } = require('../validators/userValidator');
const { uploadProfilePhoto: uploadPhotoMulter } = require('../middlewares/uploadMiddleware');
const {
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
} = require('../controllers/userController');

const router = express.Router();

// Get current user's profile (protected)
router.get('/profile', authenticateToken, getCurrentProfile);

// Update current user's profile (protected)
router.put('/profile', authenticateToken, updateProfileValidator, updateCurrentProfile);

// Upload profile photo (protected)
router.post('/profile/photo', authenticateToken, uploadPhotoMulter.single('photo'), uploadProfilePhoto);

// Delete profile photo (protected)
router.delete('/profile/photo', authenticateToken, deleteProfilePhoto);

// Offered Skills CRUD (protected)
router.get('/skills/offered', authenticateToken, getOfferedSkillsController);
router.post('/skills/offered', authenticateToken, offeredSkillValidator, addOfferedSkillController);
router.put('/skills/offered/:skillId', authenticateToken, offeredSkillValidator, updateOfferedSkillController);
router.delete('/skills/offered/:skillId', authenticateToken, deleteOfferedSkillController);

// Wanted Skills CRUD (protected)
router.get('/skills/wanted', authenticateToken, getWantedSkillsController);
router.post('/skills/wanted', authenticateToken, wantedSkillValidator, addWantedSkillController);
router.put('/skills/wanted/:skillId', authenticateToken, wantedSkillValidator, updateWantedSkillController);
router.delete('/skills/wanted/:skillId', authenticateToken, deleteWantedSkillController);

// Availability (protected)
router.get('/availability', authenticateToken, getAvailabilityController);
router.put('/availability', authenticateToken, availabilityValidator, updateAvailabilityController);

// Get public profile by user ID (public)
router.get('/:id', getPublicProfile);

module.exports = router; 