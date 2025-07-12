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

### 8. User Profile Endpoints

**GET** `/api/users/profile`
- Get the current user's profile (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "user": {
    "_id": "...",
    "email": "user@example.com",
    "profile": {
      "fullName": "John Doe",
      "bio": "...",
      "location": { "city": "...", "country": "..." },
      "profilePhoto": { "url": "...", "publicId": "...", "uploadDate": "..." },
      ...
    },
    ...
  }
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**PUT** `/api/users/profile`
- Update the current user's profile (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "fullName": "New Name", // optional
  "bio": "New bio", // optional
  "location": { "city": "New City", "country": "New Country" }, // optional
  "timezone": "UTC+2", // optional
  "preferences": { ... } // optional
}
```
- **Response:**
```
{
  "user": { ...updated user object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**GET** `/api/users/:id`
- Get a public profile by user ID (public)
- **Response:**
```
{
  "user": {
    "_id": "...",
    "profile": {
      "fullName": "...",
      "bio": "...",
      "location": { ... },
      "profilePhoto": { ... },
      ...
    },
    // No sensitive fields
  }
}
```
- **Errors:**
  - `404 Not Found` if user not found

**Explanation:**
- These endpoints allow users to view and update their own profile, and allow anyone to view public profiles by user ID. Sensitive fields are excluded from public responses.

---

### 8. Profile Photo Upload & Delete

**POST** `/api/users/profile/photo`
- Upload a new profile photo for the current user.
- **Auth required:** Bearer JWT (access token)
- **Request:** `multipart/form-data` with a single file field named `photo` (JPEG, PNG, or WEBP, max 5MB)
- **Response:**
```
{
  "message": "Profile photo updated",
  "profilePhoto": {
    "url": "https://...",
    "publicId": "...",
    "uploadDate": "2024-05-01T12:34:56.789Z"
  }
}
```
- **Errors:**
  - `400 Bad Request` if no file is sent or invalid file type/size
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**DELETE** `/api/users/profile/photo`
- Delete the current user's profile photo (from Cloudinary and DB)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "message": "Profile photo deleted"
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**Explanation:**
- These endpoints allow authenticated users to upload or remove their profile photo. Uploads are validated and stored in Cloudinary. Deleting is idempotent (safe to call even if no photo exists).

---

### 9. Offered Skills Endpoints

**GET** `/api/users/skills/offered`
- Get all offered skills for the current user (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "skills": [
    {
      "_id": "...",
      "name": "Guitar",
      "category": "Music",
      "level": "Intermediate",
      "description": "Acoustic guitar lessons",
      ...
    },
    ...
  ]
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**POST** `/api/users/skills/offered`
- Add a new offered skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "name": "Guitar",
  "category": "Music",
  "level": "Intermediate",
  "description": "Acoustic guitar lessons"
}
```
- **Response:**
```
{
  "skill": { ...created skill object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**PUT** `/api/users/skills/offered/:skillId`
- Update an offered skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "name": "Guitar",
  "category": "Music",
  "level": "Advanced",
  "description": "Now advanced!"
}
```
- **Response:**
```
{
  "skill": { ...updated skill object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user or skill not found

**DELETE** `/api/users/skills/offered/:skillId`
- Delete an offered skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "message": "Skill deleted"
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user or skill not found

**Explanation:**
- These endpoints allow authenticated users to manage their offered skills. All operations are performed on the current user's skills array. Validation is enforced for all input fields.

---

### 10. Wanted Skills Endpoints

**GET** `/api/users/skills/wanted`
- Get all wanted skills for the current user (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "skills": [
    {
      "_id": "...",
      "name": "Piano",
      "category": "Music",
      "priority": "High",
      "description": "Learn piano basics",
      ...
    },
    ...
  ]
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**POST** `/api/users/skills/wanted`
- Add a new wanted skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "name": "Piano",
  "category": "Music",
  "priority": "High",
  "description": "Learn piano basics"
}
```
- **Response:**
```
{
  "skill": { ...created skill object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**PUT** `/api/users/skills/wanted/:skillId`
- Update a wanted skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "name": "Piano",
  "category": "Music",
  "priority": "Medium",
  "description": "Now intermediate!"
}
```
- **Response:**
```
{
  "skill": { ...updated skill object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user or skill not found

**DELETE** `/api/users/skills/wanted/:skillId`
- Delete a wanted skill (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "message": "Skill deleted"
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user or skill not found

**Explanation:**
- These endpoints allow authenticated users to manage their wanted skills. All operations are performed on the current user's skills array. Validation is enforced for all input fields.

---

### 11. Availability Endpoints

**GET** `/api/users/availability`
- Get the current user's availability (protected)
- **Auth required:** Bearer JWT (access token)
- **Response:**
```
{
  "availability": {
    "timezone": "UTC",
    "isAvailable": true,
    "schedule": [
      {
        "day": "Monday",
        "timeSlots": [
          { "start": "09:00", "end": "11:00", "isActive": true }
        ]
      }
    ],
    "blockedDates": ["2024-06-01"],
    "lastUpdated": "2024-06-01T12:00:00.000Z"
  }
}
```
- **Errors:**
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**PUT** `/api/users/availability`
- Update the current user's availability (protected)
- **Auth required:** Bearer JWT (access token)
- **Request Body:**
```
{
  "timezone": "UTC+2",
  "isAvailable": false,
  "schedule": [
    {
      "day": "Monday",
      "timeSlots": [
        { "start": "09:00", "end": "11:00", "isActive": true }
      ]
    }
  ],
  "blockedDates": ["2024-06-01"]
}
```
- **Response:**
```
{
  "availability": { ...updated availability object... }
}
```
- **Errors:**
  - `400 Bad Request` for validation errors
  - `401 Unauthorized` if not logged in
  - `404 Not Found` if user not found

**Explanation:**
- These endpoints allow authenticated users to view and update their availability, including timezone, weekly schedule, and blocked dates. Validation is enforced for all input fields.

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
