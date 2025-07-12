# Skill Swap Platform – Backend API Documentation

## Authentication & User Management

### Base URL
```
http://localhost:3000/api/auth
```

---

## Environment Variables

| Variable                | Description                                 |
|-------------------------|---------------------------------------------|
| PORT                    | Server port (default: 3000)                 |
| MONGODB_URI             | MongoDB connection string                   |
| JWT_SECRET              | JWT access token secret                     |
| JWT_REFRESH_SECRET      | JWT refresh token secret                    |
| REDIS_URL               | Redis connection string                     |
| ALLOWED_ORIGINS         | CORS allowed origins (comma-separated)      |
| CLOUDINARY_CLOUD_NAME   | Cloudinary cloud name (optional)            |
| CLOUDINARY_API_KEY      | Cloudinary API key (optional)               |
| CLOUDINARY_API_SECRET   | Cloudinary API secret (optional)            |
| EMAIL_PROVIDER          | Email provider (e.g., sendgrid)             |
| SENDGRID_API_KEY        | SendGrid API key (if using SendGrid)        |
| EMAIL_FROM              | Email address to send emails from           |
| FRONTEND_URL            | Frontend base URL for links in emails       |

---

## Packages Used
- express
- mongoose
- redis
- socket.io
- jsonwebtoken
- bcrypt
- express-validator
- helmet
- cors
- dotenv
- winston
- nodemailer
- multer
- cloudinary
- axios
- jest (dev)
- supertest (dev)

---

## Endpoints & Flows

### 1. Register User
**POST** `/api/auth/register`

**Request Body:**
```
{
  "email": "user@example.com",
  "password": "StrongPass123!",
  "fullName": "John Doe"
}
```
**Response:**
- `201 Created` on success
```
{
  "message": "Registration successful. Please verify your email.",
  "user": { "id": "...", "email": "...", "fullName": "..." },
  "token": "<JWT access token>"
}
```
- `409 Conflict` if email already registered
- `400 Bad Request` for validation errors

**Flow:**
- Validates input.
- Hashes password, creates user, generates email verification token.
- Sends verification email with token link.

---

### 2. Verify Email
**POST** `/api/auth/verify-email`

**Request Body:**
```
{
  "token": "<verification_token>"
}
```
**Response:**
- `200 OK` on success
```
{
  "message": "Email verified successfully",
  "verified": true
}
```
- `400 Bad Request` if token invalid/expired
- `409 Conflict` if already verified

**Flow:**
- Finds user by token, verifies email, clears token.

---

### 3. Login & Token Issuance
**POST** `/api/auth/login`

**Request Body:**
```
{
  "email": "user@example.com",
  "password": "StrongPass123!"
}
```
**Response:**
- `200 OK` on success
```
{
  "token": "<JWT access token>",
  "refreshToken": "<JWT refresh token>",
  "user": {
    "id": "...",
    "email": "...",
    "fullName": "...",
    "profileComplete": true
  },
  "expiresIn": 900
}
```
- `401 Unauthorized` for invalid credentials
- `403 Forbidden` if email not verified
- `423 Locked` if account is locked

**Flow:**
- Validates input.
- Checks user, password, lockout, and email verification.
- Issues access and refresh tokens.

---

### 4. Forgot Password
**POST** `/api/auth/forgot-password`

**Request Body:**
```
{
  "email": "user@example.com"
}
```
**Response:**
- `200 OK` (always, for security)
```
{
  "message": "If the email exists, a reset link will be sent."
}
```

**Flow:**
- Generates reset token and expiry if user exists.
- Sends reset email with link.

---

### 5. Reset Password
**POST** `/api/auth/reset-password`

**Request Body:**
```
{
  "token": "<reset_token>",
  "newPassword": "NewStrongPass123!"
}
```
**Response:**
- `200 OK` on success
```
{
  "message": "Password reset successful."
}
```
- `400 Bad Request` if token invalid/expired

**Flow:**
- Validates token and new password.
- Hashes and updates password, clears token/expiry.

---

### 6. JWT Middleware (Protected Route Example)
**Usage:**
```js
const { authenticateToken } = require('./middlewares/authMiddleware');
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});
```

---

### 7. Role-based Access Control (Protected Route Example)
**Usage:**
```js
const { requireRole } = require('./middlewares/roleMiddleware');
router.get('/admin', authenticateToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Admin access granted' });
});
```

---

## Error Handling
- All endpoints return JSON error objects with `error` and (optionally) `details` fields.
- Validation errors return `400 Bad Request` with details.
- Auth errors return `401`, `403`, or `423` as appropriate.

---

## Notes
- All request/response bodies are JSON.
- All time values are in UTC.
- Passwords are never returned in responses.
- All tokens are JWTs, signed with secrets from env variables.
