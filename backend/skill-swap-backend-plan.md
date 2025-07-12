# Skill Swap Platform - Backend Architecture Plan

## 1. Backend Overview

The backend serves as the central nervous system of the Skill Swap Platform, orchestrating all the complex interactions between users, skills, and swap requests. Think of it as the invisible conductor of an orchestra, ensuring every component works in harmony while maintaining security, performance, and reliability.

The backend is responsible for managing user authentication and authorization, storing and retrieving user profiles and skills, implementing the intelligent matching algorithm that connects users with complementary skills, handling the entire lifecycle of swap requests from creation to completion, facilitating real-time communication between users, and providing comprehensive analytics and monitoring capabilities.

This system must handle the unique challenges of a peer-to-peer marketplace where trust, timing, and skill verification are crucial. Unlike traditional e-commerce platforms that deal with products and payments, our backend manages relationships, availability, and the intangible exchange of knowledge and expertise.

## 2. Tech Stack Recommendations

### 2.1 Core Backend Framework
**Node.js with Express.js** forms the foundation of our backend architecture. This choice provides excellent performance for I/O-heavy operations, seamless JavaScript ecosystem integration, and robust middleware support. Express.js offers the flexibility to build RESTful APIs while maintaining clean, maintainable code structure.

### 2.2 Database Layer
**MongoDB** serves as our primary database, chosen for its document-oriented structure that naturally fits our user profile and skill data model. The flexible schema allows for easy iteration as we refine our data structures, while MongoDB's powerful aggregation framework supports complex queries for our matching algorithm.

**Redis** complements MongoDB as our caching layer and session store, providing lightning-fast access to frequently requested data and managing user sessions efficiently.

### 2.3 Authentication and Security
**JSON Web Tokens (JWT)** handle authentication, providing stateless, secure token-based authentication that scales well across multiple services. **bcrypt** ensures secure password hashing with configurable salt rounds for optimal security.

### 2.4 Real-time Communication
**Socket.IO** enables real-time messaging capabilities, allowing users to communicate instantly during swap negotiations and coordination. This WebSocket-based solution provides automatic fallback mechanisms and robust connection management.

### 2.5 Additional Tools
**Mongoose** serves as our MongoDB ODM, providing schema validation, middleware hooks, and query building capabilities. **Express-validator** handles input validation and sanitization, while **Helmet.js** adds essential security headers. **Winston** provides comprehensive logging capabilities, and **Nodemailer** handles email notifications.

## 3. Database Schema Design

### 3.1 Users Collection
The Users collection represents the heart of our platform, storing comprehensive user information that enables effective matching and interaction.

```javascript
// Users Collection Schema
{
  _id: ObjectId,
  // Authentication fields
  email: String (unique, required, lowercase, trim),
  password: String (required, hashed with bcrypt),
  emailVerified: Boolean (default: false),
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Profile information
  profile: {
    fullName: String (required, trim),
    bio: String (maxLength: 500, trim),
    location: {
      city: String,
      country: String,
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere' // Geospatial index for location-based queries
      }
    },
    profilePhoto: {
      url: String,
      publicId: String, // For cloud storage management
      uploadDate: Date
    },
    isPublic: Boolean (default: true),
    timezone: String (default: 'UTC'),
    languages: [String] // For future internationalization
  },
  
  // Skills management
  skills: {
    offered: [{
      _id: ObjectId,
      name: String (required, trim),
      category: String (required),
      level: String (enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']),
      description: String (maxLength: 200, trim),
      endorsements: Number (default: 0),
      averageRating: Number (default: 0, min: 0, max: 5),
      ratingCount: Number (default: 0),
      createdAt: Date (default: Date.now),
      isActive: Boolean (default: true)
    }],
    wanted: [{
      _id: ObjectId,
      name: String (required, trim),
      category: String (required),
      priority: String (enum: ['Low', 'Medium', 'High'], default: 'Medium'),
      description: String (maxLength: 200, trim),
      createdAt: Date (default: Date.now),
      isActive: Boolean (default: true)
    }]
  },
  
  // Availability configuration
  availability: {
    timezone: String (required),
    isAvailable: Boolean (default: true),
    schedule: [{
      day: String (enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
      timeSlots: [{
        start: String, // HH:MM format
        end: String,   // HH:MM format
        isActive: Boolean (default: true)
      }]
    }],
    blockedDates: [Date], // Specific dates when user is unavailable
    lastUpdated: Date (default: Date.now)
  },
  
  // Reputation system
  reputation: {
    overallRating: Number (default: 0, min: 0, max: 5),
    totalRatings: Number (default: 0),
    completedSwaps: Number (default: 0),
    cancelledSwaps: Number (default: 0),
    responseTime: Number (default: 24), // Average response time in hours
    reliabilityScore: Number (default: 100, min: 0, max: 100)
  },
  
  // User preferences
  preferences: {
    emailNotifications: {
      newRequests: Boolean (default: true),
      messages: Boolean (default: true),
      reminders: Boolean (default: true),
      marketing: Boolean (default: false)
    },
    inAppNotifications: Boolean (default: true),
    maxDistance: Number (default: 50), // kilometers
    preferredLanguages: [String],
    autoAcceptSimilarSkills: Boolean (default: false)
  },
  
  // Account management
  accountStatus: String (enum: ['active', 'suspended', 'deactivated'], default: 'active'),
  lastLoginAt: Date,
  lastActiveAt: Date,
  loginAttempts: Number (default: 0),
  lockUntil: Date,
  
  // Audit fields
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 3.2 Swap Requests Collection
The Swap Requests collection manages the entire lifecycle of skill exchange requests, from initial creation through completion and feedback.

```javascript
// Swap Requests Collection Schema
{
  _id: ObjectId,
  
  // Participants
  requester: ObjectId (ref: 'User', required),
  requestee: ObjectId (ref: 'User', required),
  
  // Skill details
  skillOffered: {
    name: String (required),
    category: String (required),
    level: String (required),
    description: String (maxLength: 500)
  },
  skillRequested: {
    name: String (required),
    category: String (required),
    description: String (maxLength: 500)
  },
  
  // Request details
  initialMessage: String (maxLength: 1000),
  proposedSchedule: {
    startDate: Date,
    endDate: Date,
    estimatedDuration: Number, // Total hours
    sessionsCount: Number (default: 1),
    timeSlots: [{
      date: Date,
      startTime: String, // HH:MM format
      endTime: String,   // HH:MM format
      status: String (enum: ['proposed', 'confirmed', 'completed'], default: 'proposed')
    }]
  },
  
  // Status management
  status: String (enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'], default: 'pending'),
  statusHistory: [{
    status: String,
    timestamp: Date,
    changedBy: ObjectId (ref: 'User'),
    reason: String
  }],
  
  // Communication thread
  responses: [{
    _id: ObjectId,
    sender: ObjectId (ref: 'User'),
    message: String (required, maxLength: 1000),
    timestamp: Date (default: Date.now),
    isCounterOffer: Boolean (default: false),
    counterOfferDetails: {
      modifiedSchedule: Mixed, // Can contain schedule modifications
      additionalTerms: String
    }
  }],
  
  // Completion and feedback
  completionDetails: {
    completedAt: Date,
    completedBy: ObjectId (ref: 'User'),
    actualDuration: Number, // Actual hours spent
    requesterFeedback: {
      skillRating: Number (min: 1, max: 5),
      teachingQuality: Number (min: 1, max: 5),
      communication: Number (min: 1, max: 5),
      reliability: Number (min: 1, max: 5),
      overallRating: Number (min: 1, max: 5),
      writtenFeedback: String (maxLength: 500),
      wouldRecommend: Boolean,
      submittedAt: Date
    },
    requesteeFeedback: {
      skillRating: Number (min: 1, max: 5),
      learningEngagement: Number (min: 1, max: 5),
      communication: Number (min: 1, max: 5),
      reliability: Number (min: 1, max: 5),
      overallRating: Number (min: 1, max: 5),
      writtenFeedback: String (maxLength: 500),
      wouldRecommend: Boolean,
      submittedAt: Date
    }
  },
  
  // Administrative fields
  priority: String (enum: ['low', 'normal', 'high'], default: 'normal'),
  tags: [String], // For categorization and filtering
  expiresAt: Date (default: +7 days from creation),
  
  // Audit fields
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 3.3 Messages Collection
The Messages collection handles all communication between users, organized by swap request context.

```javascript
// Messages Collection Schema
{
  _id: ObjectId,
  
  // Message context
  swapRequest: ObjectId (ref: 'SwapRequest', required),
  sender: ObjectId (ref: 'User', required),
  recipient: ObjectId (ref: 'User', required),
  
  // Message content
  content: String (required, maxLength: 2000),
  messageType: String (enum: ['text', 'system', 'attachment'], default: 'text'),
  
  // Attachments
  attachments: [{
    filename: String,
    originalName: String,
    url: String,
    fileType: String,
    size: Number,
    uploadedAt: Date
  }],
  
  // Message status
  isRead: Boolean (default: false),
  readAt: Date,
  isDelivered: Boolean (default: false),
  deliveredAt: Date,
  
  // Message metadata
  isSystem: Boolean (default: false), // System-generated messages
  replyTo: ObjectId (ref: 'Message'), // For threaded conversations
  
  // Audit fields
  createdAt: Date (default: Date.now),
  editedAt: Date,
  deletedAt: Date
}
```

### 3.4 Skill Categories Collection
The Skill Categories collection provides organized categorization for skills, enabling better discovery and filtering.

```javascript
// Skill Categories Collection Schema
{
  _id: ObjectId,
  name: String (required, unique, trim),
  description: String (maxLength: 200),
  
  // Hierarchical structure
  parentCategory: ObjectId (ref: 'SkillCategory'),
  subcategories: [ObjectId] (ref: 'SkillCategory'),
  level: Number (default: 0), // 0 = root, 1 = category, 2 = subcategory
  
  // Category metadata
  icon: String, // Icon identifier for UI
  color: String, // Color code for UI theming
  keywords: [String], // For search optimization
  
  // Usage statistics
  skillCount: Number (default: 0),
  popularityScore: Number (default: 0),
  
  // Category management
  isActive: Boolean (default: true),
  isPopular: Boolean (default: false),
  displayOrder: Number (default: 0),
  
  // Audit fields
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### 3.5 Notifications Collection
The Notifications collection manages all user notifications, both in-app and email-based.

```javascript
// Notifications Collection Schema
{
  _id: ObjectId,
  
  // Notification target
  user: ObjectId (ref: 'User', required),
  
  // Notification content
  type: String (enum: ['swap_request', 'message', 'swap_accepted', 'swap_completed', 'rating_received', 'system'], required),
  title: String (required, maxLength: 100),
  message: String (required, maxLength: 500),
  
  // Notification context
  relatedEntity: {
    entityType: String (enum: ['SwapRequest', 'Message', 'User']),
    entityId: ObjectId
  },
  
  // Notification status
  isRead: Boolean (default: false),
  readAt: Date,
  isDelivered: Boolean (default: false),
  deliveredAt: Date,
  
  // Delivery channels
  channels: {
    inApp: Boolean (default: true),
    email: Boolean (default: false),
    push: Boolean (default: false)
  },
  
  // Scheduling
  scheduledFor: Date (default: Date.now),
  expiresAt: Date,
  
  // Audit fields
  createdAt: Date (default: Date.now)
}
```

## 4. API Endpoints Structure

### 4.1 Authentication Endpoints
These endpoints handle user authentication, registration, and account recovery processes.

```javascript
// Authentication Routes
POST /api/auth/register
// Purpose: Register new user account
// Request: { email, password, fullName }
// Response: { message, user: { id, email, fullName }, token }
// Validation: Email format, password strength, name requirements

POST /api/auth/verify-email
// Purpose: Verify user email with token
// Request: { token }
// Response: { message, verified: true }

POST /api/auth/login
// Purpose: Authenticate user and return JWT token
// Request: { email, password }
// Response: { token, user: { id, email, fullName, profileComplete }, expiresIn }

POST /api/auth/logout
// Purpose: Invalidate current session
// Request: Authorization header with JWT
// Response: { message }

POST /api/auth/refresh
// Purpose: Refresh JWT token
// Request: { refreshToken }
// Response: { token, expiresIn }

POST /api/auth/forgot-password
// Purpose: Initiate password reset process
// Request: { email }
// Response: { message }

POST /api/auth/reset-password
// Purpose: Complete password reset with token
// Request: { token, newPassword }
// Response: { message }
```

### 4.2 User Profile Endpoints
These endpoints manage user profile information, including skills and availability.

```javascript
// User Profile Routes
GET /api/users/profile
// Purpose: Get current user's complete profile
// Request: Authorization header
// Response: { user: { profile, skills, availability, reputation, preferences } }

PUT /api/users/profile
// Purpose: Update user profile information
// Request: { fullName?, bio?, location?, timezone?, preferences? }
// Response: { user: updatedProfile }

GET /api/users/:id
// Purpose: Get public profile of specific user
// Request: User ID parameter
// Response: { user: { publicProfile, skills, reputation, availability } }

POST /api/users/profile/photo
// Purpose: Upload profile photo
// Request: Multipart form data with image file
// Response: { profilePhoto: { url, publicId } }

DELETE /api/users/profile/photo
// Purpose: Remove profile photo
// Request: Authorization header
// Response: { message }

// Skill Management
POST /api/users/skills/offered
// Purpose: Add new offered skill
// Request: { name, category, level, description }
// Response: { skill: createdSkill }

PUT /api/users/skills/offered/:skillId
// Purpose: Update existing offered skill
// Request: { name?, category?, level?, description? }
// Response: { skill: updatedSkill }

DELETE /api/users/skills/offered/:skillId
// Purpose: Remove offered skill
// Request: Skill ID parameter
// Response: { message }

POST /api/users/skills/wanted
// Purpose: Add new wanted skill
// Request: { name, category, priority, description }
// Response: { skill: createdSkill }

PUT /api/users/skills/wanted/:skillId
// Purpose: Update wanted skill
// Request: { name?, category?, priority?, description? }
// Response: { skill: updatedSkill }

DELETE /api/users/skills/wanted/:skillId
// Purpose: Remove wanted skill
// Request: Skill ID parameter
// Response: { message }

// Availability Management
PUT /api/users/availability
// Purpose: Update user availability schedule
// Request: { timezone, schedule: [{ day, timeSlots }], isAvailable }
// Response: { availability: updatedAvailability }

POST /api/users/availability/block-dates
// Purpose: Block specific dates
// Request: { dates: [Date] }
// Response: { blockedDates: updatedBlockedDates }
```

### 4.3 Search and Discovery Endpoints
These endpoints enable users to find potential skill swap partners through various search and recommendation mechanisms.

```javascript
// Search and Discovery Routes
GET /api/search/users
// Purpose: Search users by skills, location, availability
// Query Parameters: { skill?, category?, location?, radius?, availability?, level?, rating? }
// Response: { users: [userProfiles], totalCount, page, limit }

GET /api/search/skills
// Purpose: Search and autocomplete skills
// Query Parameters: { query, category?, limit? }
// Response: { skills: [{ name, category, userCount }] }

GET /api/recommendations
// Purpose: Get personalized user recommendations
// Request: Authorization header
// Response: { recommendations: [{ user, matchScore, matchedSkills }] }

GET /api/recommendations/skills
// Purpose: Get recommended skills to learn
// Request: Authorization header
// Response: { recommendedSkills: [{ skill, reason, userCount }] }

GET /api/skills/trending
// Purpose: Get trending skills on platform
// Query Parameters: { category?, timeframe?, limit? }
// Response: { trendingSkills: [{ skill, category, growth, userCount }] }

GET /api/skills/categories
// Purpose: Get skill categories hierarchy
// Response: { categories: [{ name, subcategories, skillCount }] }

GET /api/users/nearby
// Purpose: Get users within specified radius
// Query Parameters: { lat, lng, radius?, skills? }
// Response: { nearbyUsers: [{ user, distance, matchedSkills }] }
```

### 4.4 Swap Request Management Endpoints
These endpoints handle the complete lifecycle of swap requests, from creation through completion.

```javascript
// Swap Request Routes
POST /api/swaps/request
// Purpose: Create new swap request
// Request: { 
//   requestee, 
//   skillOffered: { name, category, level, description },
//   skillRequested: { name, category, description },
//   initialMessage,
//   proposedSchedule: { startDate, endDate, timeSlots }
// }
// Response: { swapRequest: createdRequest }

GET /api/swaps/incoming
// Purpose: Get incoming swap requests
// Query Parameters: { status?, page?, limit? }
// Response: { requests: [swapRequests], totalCount, unreadCount }

GET /api/swaps/outgoing
// Purpose: Get outgoing swap requests
// Query Parameters: { status?, page?, limit? }
// Response: { requests: [swapRequests], totalCount }

GET /api/swaps/active
// Purpose: Get active (accepted) swap requests
// Response: { activeSwaps: [swapRequests] }

GET /api/swaps/:id
// Purpose: Get specific swap request details
// Request: Swap request ID parameter
// Response: { swapRequest: fullRequestDetails }

PUT /api/swaps/:id/accept
// Purpose: Accept incoming swap request
// Request: { message?, scheduleConfirmation? }
// Response: { swapRequest: updatedRequest }

PUT /api/swaps/:id/reject
// Purpose: Reject incoming swap request
// Request: { reason? }
// Response: { swapRequest: updatedRequest }

PUT /api/swaps/:id/cancel
// Purpose: Cancel swap request (before acceptance)
// Request: { reason? }
// Response: { swapRequest: updatedRequest }

POST /api/swaps/:id/counter-offer
// Purpose: Make counter-offer on swap request
// Request: { message, modifiedSchedule?, additionalTerms? }
// Response: { swapRequest: updatedRequest }

PUT /api/swaps/:id/complete
// Purpose: Mark swap as completed
// Request: { actualDuration?, completionNotes? }
// Response: { swapRequest: updatedRequest }

POST /api/swaps/:id/feedback
// Purpose: Submit feedback and rating for completed swap
// Request: { 
//   skillRating, 
//   teachingQuality, 
//   communication, 
//   reliability, 
//   overallRating,
//   writtenFeedback,
//   wouldRecommend 
// }
// Response: { feedback: submittedFeedback }
```

### 4.5 Messaging Endpoints
These endpoints handle real-time and asynchronous communication between users.

```javascript
// Messaging Routes
GET /api/messages/conversations
// Purpose: Get all conversation threads for user
// Response: { conversations: [{ swapRequest, participants, lastMessage, unreadCount }] }

GET /api/messages/conversations/:swapId
// Purpose: Get messages for specific swap request
// Query Parameters: { page?, limit? }
// Response: { messages: [messageObjects], totalCount, hasMore }

POST /api/messages
// Purpose: Send new message
// Request: { swapRequest, content, attachments? }
// Response: { message: createdMessage }

PUT /api/messages/:id/read
// Purpose: Mark message as read
// Request: Message ID parameter
// Response: { message: updatedMessage }

GET /api/messages/unread-count
// Purpose: Get total unread message count
// Response: { unreadCount: number }

// File Upload for Messages
POST /api/messages/upload
// Purpose: Upload file for message attachment
// Request: Multipart form data with file
// Response: { attachment: { filename, url, fileType, size } }
```

### 4.6 Notification Endpoints
These endpoints manage user notifications and preferences.

```javascript
// Notification Routes
GET /api/notifications
// Purpose: Get user notifications
// Query Parameters: { type?, isRead?, page?, limit? }
// Response: { notifications: [notificationObjects], totalCount, unreadCount }

PUT /api/notifications/:id/read
// Purpose: Mark notification as read
// Request: Notification ID parameter
// Response: { notification: updatedNotification }

PUT /api/notifications/read-all
// Purpose: Mark all notifications as read
// Response: { updatedCount: number }

PUT /api/notifications/preferences
// Purpose: Update notification preferences
// Request: { emailNotifications: { newRequests, messages, reminders }, inAppNotifications }
// Response: { preferences: updatedPreferences }

DELETE /api/notifications/:id
// Purpose: Delete specific notification
// Request: Notification ID parameter
// Response: { message }
```

### 4.7 Administrative Endpoints
These endpoints provide administrative functionality for platform management.

```javascript
// Admin Routes (Protected by admin role)
GET /api/admin/dashboard
// Purpose: Get admin dashboard statistics
// Response: { 
//   userStats: { total, active, newThisMonth },
//   swapStats: { total, completed, pending },
//   platformHealth: { uptime, responseTime, errorRate }
// }

GET /api/admin/users
// Purpose: Get user management interface data
// Query Parameters: { status?, search?, page?, limit? }
// Response: { users: [userProfiles], totalCount, filters }

PUT /api/admin/users/:id/status
// Purpose: Update user account status
// Request: { status: 'active' | 'suspended' | 'deactivated', reason? }
// Response: { user: updatedUser }

GET /api/admin/reports
// Purpose: Get user reports and flagged content
// Query Parameters: { type?, status?, page?, limit? }
// Response: { reports: [reportObjects], totalCount }

PUT /api/admin/reports/:id/resolve
// Purpose: Resolve user report
// Request: { resolution, action?, notes? }
// Response: { report: updatedReport }

GET /api/admin/analytics
// Purpose: Get platform analytics data
// Query Parameters: { timeframe?, metrics? }
// Response: { analytics: { userGrowth, swapSuccess, popularSkills, engagement } }
```

## 5. Authentication and Authorization

### 5.1 JWT Token Strategy
Our authentication system uses JSON Web Tokens to provide secure, stateless authentication. The JWT payload contains essential user information including user ID, email, role, and token expiration time. This approach allows for horizontal scaling since tokens are self-contained and don't require server-side session storage.

The token structure includes a 15-minute access token for API requests and a 7-day refresh token for seamless user experience. When the access token expires, the frontend automatically requests a new one using the refresh token, maintaining security while providing smooth user experience.

### 5.2 Password Security
Passwords are hashed using bcrypt with 12 salt rounds, providing strong protection against rainbow table attacks. The system enforces password complexity requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.

Account lockout mechanisms prevent brute force attacks by temporarily locking accounts after 5 failed login attempts within a 15-minute window. The lockout duration increases exponentially with repeated attempts.

### 5.3 Role-Based Access Control
The platform implements a simple but effective role-based access control system with two primary roles: 'user' for regular skill swappers and 'admin' for platform administrators. Middleware functions verify user roles before granting access to protected endpoints.

### 5.4 Email Verification
New user accounts require email verification before full platform access. The system generates secure verification tokens and sends them via email. Users must click the verification link to activate their accounts, ensuring email address validity and reducing spam accounts.

## 6. Core Business Logic

### 6.1 Skill Matching Algorithm
The heart of our platform lies in intelligently matching users with complementary skills. The matching algorithm considers multiple factors to calculate compatibility scores between users.

The algorithm evaluates bidirectional skill compatibility, where User A offers what User B wants and vice versa. It assigns higher scores to exact skill matches and lower scores to related skills within the same category. Geographic proximity receives weighting, with nearby users receiving bonus points in the matching score.

Availability overlap analysis compares user schedules to identify potential meeting times. Users with overlapping availability windows receive higher matching scores. The algorithm also considers user reputation and rating history, giving preference to users with higher ratings and successful swap completion rates.

### 6.2 Recommendation Engine
The recommendation system analyzes user behavior, skill interactions, and successful swap patterns to suggest potential partners. It tracks which skill combinations result in successful swaps and recommends similar pairings to other users.

The system maintains a skills similarity matrix, identifying related skills and suggesting users who might be interested in skill exchanges. For example, users interested in "JavaScript" might also be interested in "React" or "Node.js" developers.

### 6.3 Availability Filtering
Users can set complex availability schedules including recurring weekly patterns, timezone specifications, and blocked dates. The system converts all times to UTC for consistent storage and comparison, then converts back to user timezones for display.

The availability filtering algorithm identifies potential meeting times by comparing user schedules, accounting for different timezones and finding overlapping free time slots. It suggests optimal meeting times based on both users' preferences and availability patterns.

### 6.4 Reputation System
The reputation system calculates user trustworthiness based on multiple factors including swap completion rate, rating averages, response time, and cancellation history. Users who consistently complete swaps and receive positive feedback earn higher reputation scores.

The system implements weighted averages for ratings, giving more weight to recent feedback and feedback from users with higher reputation scores. This approach prevents manipulation while ensuring that reputation accurately reflects current user behavior.

### 6.5 Request Lifecycle Management
Swap requests progress through a defined lifecycle with automatic state transitions and expiration handling. Pending requests automatically expire after 7 days unless accepted or rejected. The system sends reminder notifications to users with pending requests.

Accepted requests transition to "in progress" status and include completion tracking. Users can mark swaps as completed, triggering the feedback collection process. The system handles edge cases like user inactivity, request cancellations, and dispute resolution.

## 7. Middleware and Utilities

### 7.1 Authentication Middleware
The authentication middleware validates JWT tokens on protected routes, extracting user information and attaching it to the request object. It handles token expiration gracefully, returning appropriate error responses that allow the frontend to trigger token refresh.

```javascript
// Authentication middleware implementation
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    req.user = user;
    next();
  });
};
```

### 7.2 Input Validation Middleware
Comprehensive input validation prevents malicious data from entering the system. The middleware uses express-validator to validate and sanitize all incoming data, checking data types, formats, and constraints.

```javascript
// Example validation middleware for user profile
const validateProfile = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name must contain only letters and spaces'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  
  handleValidationErrors
];
```

### 7.3 Error Handling Middleware
Centralized error handling provides consistent error responses and logging. The middleware catches all errors, logs them appropriately, and returns user-friendly error messages without exposing sensitive system information.

```javascript
// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized access'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error'
  });
};
```

### 7.4 Rate Limiting Middleware
Rate limiting protects the API from abuse and ensures fair usage across all users. Different endpoints have different rate limits based on their resource intensity and security requirements.

```javascript
// Rate limiting configuration
const rateLimitConfig = {
  // Authentication endpoints - stricter limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts'
  },
  
  // General API endpoints
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests'
  },
  
  // Search endpoints - moderate limits
  search: {
    windowMs: 60 * 1000, // 1 minute
    max: 30, // 30 searches per minute
    message: 'Search rate limit exceeded'
  },
  
  // File upload endpoints - strict limits
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: 'Upload limit exceeded'
  }
};
```

### 7.5 Logging Middleware
Comprehensive logging captures all API requests, responses, and system events. The logging system uses structured logging with Winston, providing different log levels and output formats for development and production environments.

```javascript
// Request logging middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('API Request', {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id
    });
  });
  
  next();
};
```

### 7.6 File Upload Middleware
File upload middleware handles profile photos and message attachments securely. It validates file types, sizes, and implements virus scanning for uploaded files.

```javascript
// File upload configuration
const uploadConfig = {
  profilePhotos: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    destination: 'uploads/profile-photos/'
  },
  
  messageAttachments: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/*', 'application/pdf', 'text/*'],
    destination: 'uploads/attachments/'
  }
};
```

### 7.7 Cache Middleware
Caching middleware improves API performance by storing frequently accessed data in Redis. It implements intelligent cache invalidation and warming strategies.

```javascript
// Cache middleware for frequently accessed data
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original json method
      const originalJson = res.json;
      res.json = function(data) {
        // Cache the response
        redis.setex(key, duration, JSON.stringify(data));
        return originalJson.call(this, data);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};
```

## 8. Third-Party Services Integration

### 8.1 Cloud Storage Service (AWS S3 / Cloudinary)
Profile photos and message attachments require reliable cloud storage with CDN capabilities. Cloudinary provides image optimization, transformation, and delivery optimization.

```javascript
// Cloudinary configuration
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  
  // Upload presets
  profilePhotos: {
    folder: 'skill-swap/profile-photos',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' }
    ]
  },
  
  attachments: {
    folder: 'skill-swap/attachments',
    resource_type: 'auto'
  }
};
```

### 8.2 Email Service (SendGrid / AWS SES)
Email notifications for verification, password reset, and important platform updates require a reliable email service. SendGrid provides templates, tracking, and delivery optimization.

```javascript
// Email service configuration
const emailConfig = {
  provider: 'sendgrid',
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: 'noreply@skillswap.com',
  
  templates: {
    emailVerification: 'd-xxx-verification-template',
    passwordReset: 'd-xxx-password-reset-template',
    swapRequest: 'd-xxx-swap-request-template',
    swapAccepted: 'd-xxx-swap-accepted-template',
    swapCompleted: 'd-xxx-swap-completed-template'
  }
};
```

### 8.3 Geocoding Service (Google Maps API)
Location-based matching requires geocoding services to convert addresses to coordinates and calculate distances between users.

```javascript
// Geocoding service integration
const geocodingService = {
  provider: 'google',
  apiKey: process.env.GOOGLE_MAPS_API_KEY,
  
  geocodeAddress: async (address) => {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    );
    
    return response.data.results[0]?.geometry?.location;
  },
  
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    // Haversine formula implementation
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
};
```

### 8.4 Background Job Processing (Bull Queue)
Background job processing handles time-consuming tasks like email sending, notification delivery, and data cleanup without blocking API responses.

```javascript
// Background job configuration
const queueConfig = {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  },
  
  queues: {
    email: {
      concurrency: 5,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    },
    
    notifications: {
      concurrency: 10,
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 }
    },
    
    cleanup: {
      concurrency: 1,
      attempts: 1,
      repeat: { cron: '0 2 * * *' } // Daily at 2 AM
    }
  }
};
```

### 8.5 Analytics Service (Google Analytics / Mixpanel)
User behavior analytics help understand platform usage patterns and optimize user experience. Integration with analytics services provides insights into user engagement and feature adoption.

```javascript
// Analytics service integration
const analyticsService = {
  track: async (event, properties, userId) => {
    try {
      await mixpanel.track(event, {
        ...properties,
        distinct_id: userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Analytics tracking error:', error);
    }
  },
  
  events: {
    USER_REGISTERED: 'User Registered',
    SKILL_ADDED: 'Skill Added',
    SWAP_REQUEST_SENT: 'Swap Request Sent',
    SWAP_REQUEST_ACCEPTED: 'Swap Request Accepted',
    SWAP_COMPLETED: 'Swap Completed',
    PROFILE_UPDATED: 'Profile Updated'
  }
};
```

## 9. Deployment Plan

### 9.1 Environment Configuration
The deployment strategy uses multiple environments to ensure stability and enable proper testing before production releases.

**Development Environment:**
- Local development with hot reloading
- SQLite or local MongoDB for rapid development
- Mock external services for offline development
- Comprehensive logging and debugging tools

**Staging Environment:**
- Production-like environment for testing
- Real database with anonymized production data
- All external services connected
- Performance monitoring and load testing

**Production Environment:**
- Highly available, scalable infrastructure
- Database clustering and replication
- CDN integration for static assets
- Comprehensive monitoring and alerting

### 9.2 Infrastructure Architecture
The production infrastructure uses cloud-native services for scalability and reliability.

```yaml
# Docker Compose for Production
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - mongodb
      - redis
    restart: unless-stopped
    
  mongodb:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped
    
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongodb_data:
  redis_data:
```

### 9.3 CI/CD Pipeline
Automated deployment pipeline ensures consistent, reliable deployments with proper testing and rollback capabilities.

```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
      - name: Security audit
        run: npm audit --audit-level high
        
  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          # Build and deploy application
          docker build -t skill-swap-api .
          docker tag skill-swap-api:latest registry.com/skill-swap-api:latest
          docker push registry.com/skill-swap-api:latest
          
          # Update production deployment
          kubectl set image deployment/skill-swap-api app=registry.com/skill-swap-api:latest
          kubectl rollout status deployment/skill-swap-api
```

### 9.4 Database Migration Strategy
Database schema changes require careful migration planning to avoid downtime and data loss.

```javascript
// Migration framework implementation
const migrations = {
  // Migration versioning
  getCurrentVersion: async () => {
    const versionDoc = await db.collection('migrations').findOne({ _id: 'version' });
    return versionDoc?.version || 0;
  },
  
  // Migration execution
  runMigrations: async () => {
    const currentVersion = await getCurrentVersion();
    const availableMigrations = getMigrations();
    
    for (const migration of availableMigrations) {
      if (migration.version > currentVersion) {
        await migration.up();
        await updateVersion(migration.version);
      }
    }
  },
  
  // Example migration
  migrations: [
    {
      version: 1,
      description: 'Add skill categories',
      up: async () => {
        await db.collection('skillCategories').insertMany([
          { name: 'Technology', description: 'Programming and tech skills' },
          { name: 'Design', description: 'Creative and design skills' },
          { name: 'Business', description: 'Business and management skills' }
        ]);
      },
      down: async () => {
        await db.collection('skillCategories').deleteMany({});
      }
    }
  ]
};
```

### 9.5 Monitoring and Observability
Comprehensive monitoring ensures platform health and enables proactive issue resolution.

```javascript
// Monitoring configuration
const monitoringConfig = {
  // Application Performance Monitoring
  apm: {
    serviceName: 'skill-swap-api',
    environment: process.env.NODE_ENV,
    captureBody: 'errors',
    captureHeaders: true
  },
  
  // Health check endpoints
  healthChecks: {
    '/health': () => ({ status: 'healthy', timestamp: new Date() }),
    '/health/db': async () => {
      const isConnected = await mongoose.connection.db.admin().ping();
      return { status: isConnected ? 'healthy' : 'unhealthy' };
    },
    '/health/redis': async () => {
      const pong = await redis.ping();
      return { status: pong === 'PONG' ? 'healthy' : 'unhealthy' };
    }
  },
  
  // Metrics collection
  metrics: {
    requestDuration: new prometheus.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code']
    }),
    
    activeConnections: new prometheus.Gauge({
      name: 'websocket_active_connections',
      help: 'Number of active WebSocket connections'
    })
  }
};
```

## 10. Security Measures

### 10.1 Data Protection
Comprehensive data protection measures ensure user privacy and platform security.

**Encryption at Rest:**
- Database encryption using MongoDB's native encryption
- File encryption for stored attachments
- Environment variable encryption for sensitive configuration

**Encryption in Transit:**
- TLS 1.3 for all client-server communication
- Certificate pinning for mobile applications
- Secure WebSocket connections for real-time messaging

**Data Privacy:**
- Personal data anonymization in logs
- GDPR compliance with data export and deletion
- Consent management for data processing
- Regular data retention policy enforcement

### 10.2 Input Validation and Sanitization
Robust input validation prevents injection attacks and ensures data integrity.

```javascript
// Comprehensive input validation
const securityValidation = {
  // SQL/NoSQL injection prevention
  sanitizeInput: (input) => {
    if (typeof input === 'string') {
      return input.replace(/[<>\"'%;()&+]/g, '');
    }
    return input;
  },
  
  // XSS prevention
  escapeHtml: (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  },
  
  // File upload security
  validateFileUpload: (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    
    if (file.size > maxSize) {
      throw new Error('File too large');
    }
    
    return true;
  }
};
```

### 10.3 API Security
API security measures protect against common attacks and ensure authorized access.

```javascript
// Security middleware stack
const securityMiddleware = [
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "wss:"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }),
  
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }),
  
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP'
  })
];
```

### 10.4 Authentication Security
Enhanced authentication security prevents unauthorized access and protects user accounts.

```javascript
// Authentication security measures
const authSecurity = {
  // Account lockout after failed attempts
  handleLoginAttempt: async (email, password) => {
    const user = await User.findOne({ email });
    
    if (!user) {
      // Prevent email enumeration
      await new Promise(resolve => setTimeout(resolve, 100));
      throw new Error('Invalid credentials');
    }
    
    if (user.lockUntil && user.lockUntil > Date.now()) {
      throw new Error('Account temporarily locked');
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      await user.updateOne({
        $inc: { loginAttempts: 1 },
        $set: { 
          lockUntil: user.loginAttempts >= 4 ? Date.now() + 30 * 60 * 1000 : undefined
        }
      });
      throw new Error('Invalid credentials');
    }
    
    // Reset login attempts on successful login
    await user.updateOne({
      $unset: { loginAttempts: 1, lockUntil: 1 },
      $set: { lastLoginAt: new Date() }
    });
    
    return user;
  },
  
  // Session management
  generateTokens: (user) => {
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { id: user._id, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
};
```

### 10.5 Content Security
Content security measures prevent malicious content and maintain platform quality.

```javascript
// Content moderation and security
const contentSecurity = {
  // Automated content filtering
  filterContent: (content) => {
    const profanityFilter = require('profanity-filter');
    const filteredContent = profanityFilter.filter(content);
    
    // Check for spam patterns
    const spamPatterns = [
      /\b(?:http|https):\/\/[^\s]+/gi, // URLs
      /\b\d{3}-\d{3}-\d{4}\b/g, // Phone numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g // Email addresses
    ];
    
    for (const pattern of spamPatterns) {
      if (pattern.test(content)) {
        throw new Error('Content contains prohibited information');
      }
    }
    
    return filteredContent;
  },
  
  // Image content validation
  validateImageContent: async (imageBuffer) => {
    // Use image recognition service to detect inappropriate content
    const analysis = await cloudVision.analyze(imageBuffer);
    
    if (analysis.adult > 0.5 || analysis.violence > 0.3) {
      throw new Error('Image contains inappropriate content');
    }
    
    return true;
  }
};
```

## 11. Testing Strategy

### 11.1 Unit Testing
Comprehensive unit testing ensures individual components work correctly in isolation.

```javascript
// Example unit test for skill matching algorithm
describe('Skill Matching Algorithm', () => {
  let mockUsers;
  
  beforeEach(() => {
    mockUsers = [
      {
        _id: 'user1',
        skills: {
          offered: [{ name: 'JavaScript', level: 'Advanced' }],
          wanted: [{ name: 'Python', level: 'Intermediate' }]
        },
        location: { coordinates: [0, 0] }
      },
      {
        _id: 'user2',
        skills: {
          offered: [{ name: 'Python', level: 'Expert' }],
          wanted: [{ name: 'JavaScript', level: 'Advanced' }]
        },
        location: { coordinates: [0.01, 0.01] }
      }
    ];
  });
  
  test('should calculate correct match score for complementary skills', () => {
    const matchScore = calculateMatchScore(mockUsers[0], mockUsers[1]);
    expect(matchScore).toBeGreaterThan(0.8);
    expect(matchScore).toBeLessThanOrEqual(1.0);
  });
  
  test('should consider geographic proximity in matching', () => {
    const nearbyScore = calculateMatchScore(mockUsers[0], mockUsers[1]);
    
    // Create distant user
    const distantUser = {
      ...mockUsers[1],
      location: { coordinates: [180, 0] }
    };
    
    const distantScore = calculateMatchScore(mockUsers[0], distantUser);
    expect(nearbyScore).toBeGreaterThan(distantScore);
  });
  
  test('should handle users with no matching skills', () => {
    const noMatchUser = {
      ...mockUsers[1],
      skills: {
        offered: [{ name: 'Cooking', level: 'Beginner' }],
        wanted: [{ name: 'Dancing', level: 'Intermediate' }]
      }
    };
    
    const matchScore = calculateMatchScore(mockUsers[0], noMatchUser);
    expect(matchScore).toBe(0);
  });
});
```

### 11.2 Integration Testing
Integration tests verify that different components work together correctly.

```javascript
// Example integration test for swap request flow
describe('Swap Request Integration', () => {
  let requester, requestee, authToken;
  
  beforeEach(async () => {
    // Setup test users
    requester = await User.create({
      email: 'requester@test.com',
      password: await bcrypt.hash('password123', 12),
      profile: { fullName: 'Test Requester' },
      skills: {
        offered: [{ name: 'JavaScript', level: 'Advanced' }],
        wanted: [{ name: 'Python', level: 'Intermediate' }]
      }
    });
    
    requestee = await User.create({
      email: 'requestee@test.com',
      password: await bcrypt.hash('password123', 12),
      profile: { fullName: 'Test Requestee' },
      skills: {
        offered: [{ name: 'Python', level: 'Expert' }],
        wanted: [{ name: 'JavaScript', level: 'Advanced' }]
      }
    });
    
    // Generate auth token
    authToken = jwt.sign(
      { id: requester._id, email: requester.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  });
  
  test('complete swap request flow', async () => {
    // Create swap request
    const createResponse = await request(app)
      .post('/api/swaps/request')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        requestee: requestee._id,
        skillOffered: {
          name: 'JavaScript',
          level: 'Advanced',
          description: 'Web development with React'
        },
        skillRequested: {
          name: 'Python',
          description: 'Data science basics'
        },
        initialMessage: 'Let\'s swap skills!'
      });
    
    expect(createResponse.status).toBe(201);
    const swapRequestId = createResponse.body.swapRequest._id;
    
    // Accept swap request
    const requesteeToken = jwt.sign(
      { id: requestee._id, email: requestee.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const acceptResponse = await request(app)
      .put(`/api/swaps/${swapRequestId}/accept`)
      .set('Authorization', `Bearer ${requesteeToken}`)
      .send({ message: 'Accepted!' });
    
    expect(acceptResponse.status).toBe(200);
    expect(acceptResponse.body.swapRequest.status).toBe('accepted');
    
    // Complete swap
    const completeResponse = await request(app)
      .put(`/api/swaps/${swapRequestId}/complete`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ actualDuration: 2 });
    
    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.swapRequest.status).toBe('completed');
  });
});
```

### 11.3 End-to-End Testing
End-to-end tests validate complete user workflows from frontend to backend.

```javascript
// Example E2E test using Cypress
describe('User Registration and Profile Setup', () => {
  it('should allow new user to register and complete profile', () => {
    cy.visit('/register');
    
    // Fill registration form
    cy.get('[data-cy=email]').type('newuser@test.com');
    cy.get('[data-cy=password]').type('SecurePass123!');
    cy.get('[data-cy=confirm-password]').type('SecurePass123!');
    cy.get('[data-cy=full-name]').type('Test User');
    cy.get('[data-cy=register-button]').click();
    
    // Verify registration success
    cy.get('[data-cy=verification-message]').should('contain', 'Please check your email');
    
    // Simulate email verification (in real test, would check test email)
    cy.request('POST', '/api/auth/verify-email', {
      token: 'test-verification-token'
    });
    
    // Login after verification
    cy.visit('/login');
    cy.get('[data-cy=email]').type('newuser@test.com');
    cy.get('[data-cy=password]').type('SecurePass123!');
    cy.get('[data-cy=login-button]').click();
    
    // Complete profile setup
    cy.get('[data-cy=profile-setup-wizard]').should('be.visible');
    
    // Add skills
    cy.get('[data-cy=add-skill-button]').click();
    cy.get('[data-cy=skill-name]').type('JavaScript');
    cy.get('[data-cy=skill-level]').select('Advanced');
    cy.get('[data-cy=save-skill]').click();
    
    // Set availability
    cy.get('[data-cy=availability-tab]').click();
    cy.get('[data-cy=monday-checkbox]').check();
    cy.get('[data-cy=time-start]').type('09:00');
    cy.get('[data-cy=time-end]').type('17:00');
    
    // Complete setup
    cy.get('[data-cy=complete-setup]').click();
    
    // Verify dashboard access
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=welcome-message]').should('contain', 'Welcome, Test User');
  });
});
```

### 11.4 Performance Testing
Performance tests ensure the API can handle expected load and response times.

```javascript
// Load testing with Artillery
const loadTestConfig = {
  config: {
    target: 'https://api.skillswap.com',
    phases: [
      { duration: 60, arrivalRate: 10 }, // Warm up
      { duration: 120, arrivalRate: 50 }, // Sustained load
      { duration: 60, arrivalRate: 100 } // Peak load
    ],
    defaults: {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  },
  scenarios: [
    {
      name: 'User Search Flow',
      weight: 70,
      flow: [
        { post: { url: '/api/auth/login', json: { email: 'test@example.com', password: 'password' } } },
        { get: { url: '/api/search/users?skill=JavaScript' } },
        { get: { url: '/api/users/{{ userId }}' } }
      ]
    },
    {
      name: 'Swap Request Creation',
      weight: 30,
      flow: [
        { post: { url: '/api/auth/login', json: { email: 'test@example.com', password: 'password' } } },
        { post: { url: '/api/swaps/request', json: { requestee: '{{ userId }}', skillOffered: { name: 'JavaScript' } } } }
      ]
    }
  ]
};
```

### 11.5 Security Testing
Security tests identify vulnerabilities and ensure proper protection mechanisms.

```javascript
// Security testing examples
describe('Security Tests', () => {
  test('should prevent SQL injection attempts', async () => {
    const maliciousInput = "'; DROP TABLE users; --";
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: maliciousInput,
        password: 'irrelevant',
      });
      expect(response.status).not.toBe(500);
      expect(response.body.error).not.toMatch(/sql|drop|table/i);
    });

    test('should reject XSS payloads in user input', async () => {
      const xssInput = '<script>alert(1)</script>';
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `xss${Date.now()}@test.com`,
          password: 'SecurePass123!',
          fullName: xssInput
        });
      expect(response.status).not.toBe(500);
      expect(response.body.error || '').not.toMatch(/<script>/i);
    });
  });
});

---

## 12. Documentation & Maintenance Best Practices

- **Comprehensive API Documentation:**
  - Use OpenAPI/Swagger for all endpoints, request/response schemas, and error codes.
  - Keep docs versioned and updated with code changes.
- **Code Comments & Style:**
  - Follow consistent code style (e.g., Airbnb/Google for JS) and PEP8 for Python scripts.
  - Comment complex logic, business rules, and edge cases.
- **Change Management:**
  - Use semantic versioning for releases.
  - Maintain a clear changelog and migration notes for DB changes.
- **Monitoring & Alerts:**
  - Set up automated alerts for downtime, error spikes, and performance regressions.
  - Regularly review logs and metrics for anomalies.
- **Regular Security Audits:**
  - Schedule periodic code and dependency scans (e.g., Snyk, npm audit).
  - Review access controls and secrets management quarterly.
- **Backup & Disaster Recovery:**
  - Automate daily DB backups and test restore procedures monthly.
  - Document recovery steps for major failure scenarios.

---

## 13. Conclusion

This backend plan provides a robust, scalable, and secure foundation for the Skill Swap Platform. By adhering to these guidelines and best practices, the engineering team can ensure high-quality delivery, maintainability, and adaptability as the platform evolves. Regular reviews and updates to this plan are recommended as new requirements and technologies emerge.