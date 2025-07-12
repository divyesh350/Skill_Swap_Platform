# 📘 Skill Swap Platform – Backend PLANNING.md

## 🧠 Project Overview

The backend of the Skill Swap Platform is responsible for handling:

* User authentication and authorization
* Profile and skill data management
* Skill swap matchmaking and lifecycle
* Real-time communication (chat/messages)
* Notifications
* Admin and analytics services

This architecture enables secure, scalable, and real-time peer-to-peer skill exchange.

## ⚙️ Tech Stack

* **Node.js + Express.js** – Core backend framework
* **MongoDB** – Document-based database
* **Mongoose** – ODM for MongoDB
* **Redis** – Session and cache management
* **Socket.IO** – Real-time communication
* **JWT** – Authentication (15min access + 7d refresh)
* **bcrypt** – Password hashing
* **helmet, cors, dotenv** – Security and environment setup
* **winston** – Logging
* **express-validator** – Input validation
* **nodemailer** – Email communication
* **cloudinary** – Image uploads (optional)

## 🗂️ Folder Structure

```
/backend
  ├── docs
  │   ├── PLANNING.md
  │   └── TASK.md
  └── src
      ├── controllers       # Request handlers
      ├── models            # Mongoose schemas
      ├── routes            # Express route definitions
      ├── services          # Business logic modules
      ├── sockets           # Real-time messaging handlers
      ├── middlewares       # Authentication, errors, logging
      ├── validators        # Request input validation
      ├── config            # DB, Redis, env loaders
      ├── utils             # Helpers, constants
      ├── jobs              # Background workers
      └── tests             # Unit and integration tests
```

## 🔄 Key Flows

1. **User Registration** → Email Verification → Login → Token Management
2. **Profile Setup** → Skill Addition (offered/wanted) → Availability Setup
3. **Skill Search / Recommendations** → View Profiles → Send Swap Request
4. **Swap Request Lifecycle** → Accept / Reject → Chat → Complete → Feedback
5. **Messaging** → Real-time using Socket.IO rooms scoped to swapId
6. **Admin Panel** → Moderation, Analytics, Flagged Reports

## 🛡️ Design Principles

* Modular, layered architecture (controllers → services → DB)
* Separation of concerns: routes, validation, business logic
* Reusable services and schema validators
* Defensive coding: validation, sanitization, error handling
* Scalable: Redis caching, real-time architecture, queue workers

## 📊 Schema Anchors

* **User** – profile, skills, availability, reputation
* **SwapRequest** – offered/requested skills, schedule, status, feedback
* **Message** – threaded swap-specific chat
* **SkillCategory** – hierarchical filtering
* **Notification** – user alerts (in-app + email)

## 📌 API Guidelines

* RESTful endpoints with clear groupings
* Secure all protected routes with JWT middleware
* Validate input on every route
* Modularize large route files (e.g., `/users`, `/auth`, `/swaps`)
* Swagger/Postman doc to be maintained

## ✅ Testing Strategy

* Use `Jest` + `Supertest`
* Test types: unit, integration
* Tests must include:

  * Normal use case
  * Edge case
  * Failure case

## 📈 Deployment Notes

* Use Docker Compose for local, staging, and prod
* Use Redis & Mongo as service containers
* CI/CD via GitHub Actions with test + deploy
* Monitoring and logging using APM tools (optional)

---

This file must be reviewed and updated whenever new modules or features are added.
All logic must conform to this architecture.
