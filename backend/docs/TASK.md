# ✅ TASK.md – Skill Swap Backend

## 📌 Authentication & User Management

* [x] **Register User** – Create user with email, password, full name
* [x] **Email Verification** – Token-based verification
* [x] **Login & Token Issuance** – Access and refresh tokens
* [x] **Forgot/Reset Password Flow** – Token and expiry-based reset
* [x] **JWT Middleware** – Secure routes
* [ ] **Role-based Access Control** – Admin and user roles

## 👤 User Profile & Skill Management

* [ ] **Get/Update User Profile** – Full editable profile fields
* [ ] **Upload/Delete Profile Photo** – Cloudinary integration
* [ ] **Manage Offered Skills** – CRUD for offered skills
* [ ] **Manage Wanted Skills** – CRUD for wanted skills
* [ ] **Set Availability** – Timezone, days, time slots, blocked dates

## 🔄 Swap Request Lifecycle

* [ ] **Create Swap Request** – With skillOffered/skillRequested and message
* [ ] **Accept/Reject/Cancel/Counter Offer** – Swap states
* [ ] **Track Status History** – Status log with timestamp and user
* [ ] **Swap Completion & Feedback** – Completion trigger + ratings

## 💬 Messaging System

* [ ] **Socket.IO Room Setup** – Join by swapRequestId
* [ ] **Send/Receive Messages** – REST + real-time sockets
* [ ] **Message Read/Delivery Status** – Seen + delivered tracking
* [ ] **File Uploads in Messages** – Attachment support

## 🔔 Notifications

* [ ] **Notification Model & Types** – Swap, message, system
* [ ] **In-App Delivery & Read** – Display, read tracking
* [ ] **Email Notification Jobs** – Nodemailer + templates
* [ ] **Notification Preferences** – Enable/disable settings

## 🔎 Discovery & Recommendations

* [ ] **Search Users by Skill/Location** – Mongo geo queries
* [ ] **Skill Autocomplete** – Typeahead support
* [ ] **Trending Skills & Skill Categories** – Popularity data
* [ ] **User Recommendations** – Based on skills, availability, distance

## 🛠️ Admin & Reports

* [ ] **Admin Dashboard Stats** – Users, swaps, growth
* [ ] **User Moderation** – Suspend/reactivate users
* [ ] **Flag/Resolve Reports** – For content or abuse
* [ ] **Analytics Endpoints** – Usage, engagement metrics

## 🧪 Testing & Reliability

* [ ] **Unit Tests (Jest)** – Services, utilities, validators
* [ ] **Integration Tests (Supertest)** – Routes, auth flows
* [ ] **Performance/Load Tests** – Optional (Artillery)

## ⚙️ Utilities & Middleware

* [ ] **Error Handling Middleware** – Global handler
* [ ] **Input Validation Middleware** – Using express-validator
* [ ] **Logger (Winston)** – Console + file logging
* [ ] **Rate Limiting & Helmet** – API protection
* [ ] **Env Loader** – dotenv setup and validations

## 🔁 Background Jobs

* [ ] **Email Queue (Bull)** – Retryable async tasks
* [ ] **Notification Queue** – Scheduled and retry logic
* [ ] **Swap Cleanup Jobs** – Expiry + daily sweep

## 🌐 Third-Party Integrations

* [ ] **Cloudinary Setup** – Upload presets and delete flow
* [ ] **SendGrid or SES** – Email templates
* [ ] **Google Maps API** – Geo lookup, distance calc

---

## 🧠 Discovered During Work

* [ ] (Add any new TODOs discovered while implementing above features)

All items must follow backend structure in PLANNING.md and reflect schema/API as per `skill-swap-backend-plan.md`.
