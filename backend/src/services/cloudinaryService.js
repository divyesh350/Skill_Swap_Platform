// cloudinaryService.js - Cloudinary upload/delete utilities
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

/**
 * Upload a profile photo to Cloudinary
 * @param {Buffer} buffer
 * @returns {Promise<{ url: string, publicId: string }>}
 */
function uploadProfilePhoto(buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'skill-swap/profile-photos',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto', fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    ).end(buffer);
  });
}

/**
 * Delete a profile photo from Cloudinary
 * @param {string} publicId
 * @returns {Promise<void>}
 */
async function deleteProfilePhoto(publicId) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}

module.exports = {
  uploadProfilePhoto,
  deleteProfilePhoto
}; 