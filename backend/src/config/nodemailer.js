// nodemailer.js - Email sending utility
const nodemailer = require('nodemailer');
const config = require('./config');

/**
 * Create nodemailer transporter using environment variables
 */
const transporter = nodemailer.createTransport({
  service: config.email.provider || 'sendgrid',
  auth: {
    user: config.email.from,
    pass: config.email.apiKey
  }
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {string} [options.text] - Plain text body
 * @returns {Promise}
 */
async function sendMail({ to, subject, html, text }) {
  const mailOptions = {
    from: config.email.from,
    to,
    subject,
    html,
    text
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail }; 