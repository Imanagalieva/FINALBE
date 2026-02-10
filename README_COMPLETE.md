# 🏥 MedApp - Medical Appointment System

**A comprehensive medical appointment management system** built with Node.js, Express, MongoDB, and vanilla JavaScript.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [API Documentation](#api-documentation)
7. [Authentication & Security](#authentication--security)
8. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
9. [Email Service Integration](#email-service-integration)
10. [Deployment](#deployment)
11. [Screenshots](#screenshots)
12. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- ✅ **User Authentication**: Secure registration and login with JWT tokens
- ✅ **Role-Based Access Control**: Patient, Premium Patient, Doctor, Moderator, Admin roles
- ✅ **Appointment Management**: Book, view, update, and cancel appointments
- ✅ **Medical Records**: Doctors can create and manage patient medical records
- ✅ **Doctor Profiles**: Browse doctors by specialization and manage profiles
- ✅ **Medical Services**: Manage various medical services and pricing
- ✅ **Email Notifications**: Automated emails for registrations and appointments
- ✅ **Secure Password Hashing**: bcryptjs for password security
- ✅ **Input Validation**: Request validation with express-validator
- ✅ **Error Handling**: Comprehensive error handling middleware

### User Roles & Permissions

| Role | Capabilities |
|------|--------------|
| **Patient** | View own profile, book appointments, view own appointments, cancel own appointments |
| **Premium Patient** | All patient features + view medical records + priority booking |
| **Doctor** | View patient appointments, manage appointments, create patient records, view patient data |
| **Moderator** | Moderate content, view all users, ban users, access reports |
| **Admin** | Full system access, delete users, manage all resources |

---

## 🎯 Project Overview

**MedApp** is a full-stack medical appointment system that connects patients with doctors for healthcare services. It provides:

- **For Patients**: Easy appointment booking, medical history tracking, and service browsing
- **For Doctors**: Schedule management, patient record creation, and appointment confirmation
- **For Administrators**: System management, user control, and analytics

The system ensures secure data handling through JWT authentication, role-based access control, and HTTPS connections in production.

---

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 16+
- **Framework**: Express.js 4.x
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Email Service**: Nodemailer (SendGrid/Mailgun/Postmark compatible)
- **Security**: Helmet.js, CORS
- **Environment**: dotenv

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

### Deployment
- Railway.app or Render
- MongoDB Atlas
- SendGrid/Mailgun/Postmark for emails

---

## 📁 Project Structure

```
medapp/
├── app/
│   ├── config/
│   │   ├── auth.config.js          # JWT configuration
│   │   └── db.config.js            # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js      # Authentication logic
│   │   ├── user.controller.js      # User management
│   │   ├── record.controller.js    # Appointments/Records
│   │   ├── doctor.controller.js    # Doctor endpoints
│   │   └── service.controller.js   # Medical services
│   ├── middlewares/
│   │   ├── authJwt.js              # JWT verification
│   │   ├── roleMiddleware.js       # RBAC middleware
│   │   ├── validateRequest.js      # Input validation
│   │   └── errorHandler.js         # Error handling
│   ├── models/
│   │   ├── user.model.js           # User schema
│   │   ├── record.model.js         # Appointment schema
│   │   └── service.model.js        # Service schema
│   ├── routes/
│   │   ├── index.js                # Route aggregator
│   │   ├── auth.routes.js          # Auth endpoints
│   │   ├── user.routes.js          # User endpoints
│   │   ├── record.routes.js        # Appointment endpoints
│   │   ├── doctor.routes.js        # Doctor endpoints
│   │   └── service.routes.js       # Service endpoints
│   └── services/
│       └── email.service.js        # Email sending service
├── public/                          # Frontend files
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── appointments.html
│   ├── book.html
│   ├── doctors.html
│   ├── records.html
│   ├── profile.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── auth.js
│       ├── dashboard.js
│       ├── doctor.js
│       ├── appointments.js
│       ├── utils.js
│       └── dashboard.js
├── deploy/
│   ├── railway.toml                # Railway deployment config
│   └── render.yaml                 # Render deployment config
├── scripts/
│   └── seed.js                     # Database seeding
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies
├── server.js                       # Main server file
├── DEPLOYMENT_GUIDE.md             # Deployment documentation
├── QUICK_START.md                  # Quick start guide
├── RBAC_EXAMPLES.js                # RBAC usage examples
└── README.md                       # This file
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js**: v16.0.0 or higher
- **npm**: v7 or higher
- **MongoDB**: v4.4 or higher (or MongoDB Atlas account)
- **Git**: For version control

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/medapp.git
cd medapp
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required environment variables:**

```env
# Node Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/medapp

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# SMTP Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
```

### Step 4: Start MongoDB

```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### Step 5: Run Development Server

```bash
# With auto-reload
npm run dev

# Or normal start
npm start
```

Server will run on `http://localhost:3000`

### Step 6: (Optional) Seed Database

```bash
# Seed with sample data
npm run seed

# Reset and re-seed
npm run seed:reset
```

---

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-deployed-url.com/api`

### Response Format

All endpoints return JSON responses with the following format:

```json
{
  "message": "Success message",
  "data": { /* Response data */ },
  "status": "ok"
}
```

Error responses:
```json
{
  "message": "Error message",
  "errors": [ /* Validation errors */ ],
  "status": "error"
}
```

---

## 🔐 Authentication Endpoints (Public)

### 1. Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "birthDate": "1990-01-15",
  "role": "patient"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "patient",
    "birthDate": "1990-01-15"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Validation Rules:**
- Email: Valid format required
- Password: Minimum 6 characters
- Username: 3-50 characters, unique
- Phone: Required
- Birth date: User must be 18+

---

### 2. Login User
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "patient",
    "phone": "+1234567890"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400`: Missing email or password
- `401`: Invalid email or password

---

### 3. Check Availability
**GET** `/auth/check-availability?username=john_doe&email=john@example.com`

Check if username or email is available.

**Response:**
```json
{
  "available": true,
  "message": "Available"
}
```

---

## 👤 User Management Endpoints (Protected)

### 4. Get User Profile
**GET** `/users/profile`

Retrieve the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "username": "john_doe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "phone": "+1234567890",
  "role": "patient",
  "specialization": "",
  "isVerified": true,
  "createdAt": "2024-02-10T10:00:00Z",
  "updatedAt": "2024-02-10T10:00:00Z"
}
```

---

### 5. Update User Profile
**PUT** `/users/profile`

Update the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "phone": "+1234567890",
  "email": "newemail@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Smith",
    "phone": "+1234567890",
    "email": "newemail@example.com",
    "updatedAt": "2024-02-10T11:00:00Z"
  }
}
```

---

### 6. Get All Users (Admin Only)
**GET** `/users`

Retrieve all users in the system.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "patient",
    "createdAt": "2024-02-10T10:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "dr_smith",
    "email": "smith@example.com",
    "fullName": "Dr. Smith",
    "role": "doctor",
    "specialization": "Cardiology",
    "createdAt": "2024-02-09T10:00:00Z"
  }
]
```

---

### 7. Update User Role (Admin Only)
**PUT** `/users/:userId/role`

Change a user's role.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "newRole": "premium_patient"
}
```

**Response (200 OK):**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "john_doe",
    "role": "premium_patient"
  }
}
```

---

## 📅 Appointment Management Endpoints (Protected)

### 8. Create Appointment
**POST** `/appointments`

Book a new appointment with a doctor.

**Headers:**
```
Authorization: Bearer <patient_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "doctorId": "507f1f77bcf86cd799439012",
  "appointmentDate": "2024-03-15T14:00:00Z",
  "reason": "Regular checkup and consultation",
  "symptoms": ["headache", "fatigue"],
  "duration": 30,
  "price": 50
}
```

**Response (201 Created):**
```json
{
  "message": "Appointment created successfully",
  "record": {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": "507f1f77bcf86cd799439011",
    "doctorId": "507f1f77bcf86cd799439012",
    "appointmentDate": "2024-03-15T14:00:00Z",
    "reason": "Regular checkup and consultation",
    "symptoms": ["headache", "fatigue"],
    "status": "scheduled",
    "duration": 30,
    "price": 50,
    "createdAt": "2024-02-10T10:00:00Z"
  }
}
```

**Validation:**
- appointmentDate: Valid ISO8601 date required
- reason: Minimum 10 characters
- duration: 15-120 minutes
- doctorId: Must be valid doctor ID

---

### 9. Get All Appointments
**GET** `/appointments`

Retrieve all appointments (filtered by role).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "patientId": {
      "_id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439012",
      "fullName": "Dr. Smith",
      "email": "smith@example.com",
      "phone": "+0987654321"
    },
    "appointmentDate": "2024-03-15T14:00:00Z",
    "reason": "Regular checkup and consultation",
    "status": "scheduled",
    "duration": 30,
    "price": 50
  }
]
```

**Note:** 
- Patients see only their own appointments
- Doctors see only their scheduled appointments
- Admins see all appointments

---

### 10. Get Single Appointment
**GET** `/appointments/:id`

Retrieve details of a specific appointment.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "patientId": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "birthDate": "1990-01-15"
  },
  "doctorId": {
    "_id": "507f1f77bcf86cd799439012",
    "fullName": "Dr. Smith",
    "email": "smith@example.com",
    "phone": "+0987654321"
  },
  "appointmentDate": "2024-03-15T14:00:00Z",
  "reason": "Regular checkup and consultation",
  "symptoms": ["headache", "fatigue"],
  "diagnosis": "Common migraine",
  "prescription": "Take paracetamol as needed",
  "notes": "Follow-up in 2 weeks",
  "status": "completed",
  "duration": 30,
  "price": 50,
  "createdAt": "2024-02-10T10:00:00Z"
}
```

---

### 11. Update Appointment
**PUT** `/appointments/:id`

Update an appointment (status, diagnosis, notes, etc.).

**Headers:**
```
Authorization: Bearer <doctor_or_admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "completed",
  "diagnosis": "Common migraine",
  "prescription": "Take paracetamol as needed",
  "notes": "Follow-up in 2 weeks",
  "price": 75
}
```

**Response (200 OK):**
```json
{
  "message": "Appointment updated successfully",
  "record": {
    "_id": "507f1f77bcf86cd799439013",
    "status": "completed",
    "diagnosis": "Common migraine",
    "prescription": "Take paracetamol as needed",
    "notes": "Follow-up in 2 weeks",
    "price": 75,
    "updatedAt": "2024-02-10T11:00:00Z"
  }
}
```

---

### 12. Delete Appointment
**DELETE** `/appointments/:id`

Cancel/delete an appointment.

**Headers:**
```
Authorization: Bearer <patient_or_admin_token>
```

**Response (200 OK):**
```json
{
  "message": "Appointment deleted successfully"
}
```

---

## 🏥 Doctor Endpoints (Protected)

### 13. Get All Doctors
**GET** `/doctors`

Retrieve all available doctors.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `specialization`: Filter by specialization (optional)

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "username": "dr_smith",
    "fullName": "Dr. Smith",
    "email": "smith@example.com",
    "phone": "+0987654321",
    "specialization": "Cardiology",
    "role": "doctor"
  },
  {
    "_id": "507f1f77bcf86cd799439014",
    "username": "dr_jones",
    "fullName": "Dr. Jones",
    "email": "jones@example.com",
    "phone": "+1122334455",
    "specialization": "Dermatology",
    "role": "doctor"
  }
]
```

---

### 14. Get Doctor Profile
**GET** `/doctors/:id`

Retrieve specific doctor's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "username": "dr_smith",
  "fullName": "Dr. Smith",
  "email": "smith@example.com",
  "phone": "+0987654321",
  "specialization": "Cardiology",
  "role": "doctor",
  "createdAt": "2024-02-01T10:00:00Z"
}
```

---

## 🔬 Medical Services Endpoints

### 15. Get All Services
**GET** `/services`

Retrieve all available medical services.

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "General Consultation",
    "description": "Standard consultation with a doctor",
    "price": 50,
    "duration": 30,
    "category": "consultation",
    "active": true
  },
  {
    "_id": "507f1f77bcf86cd799439016",
    "name": "Cardiac Checkup",
    "description": "Complete cardiac evaluation",
    "price": 150,
    "duration": 60,
    "category": "diagnostics",
    "active": true
  }
]
```

---

### 16. Create Service (Admin Only)
**POST** `/services`

Create a new medical service.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Blood Test",
  "description": "Complete blood panel",
  "price": 75,
  "duration": 15,
  "category": "diagnostics"
}
```

**Response (201 Created):**
```json
{
  "message": "Service created successfully",
  "service": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Blood Test",
    "description": "Complete blood panel",
    "price": 75,
    "duration": 15,
    "category": "diagnostics",
    "active": true,
    "createdAt": "2024-02-10T10:00:00Z"
  }
}
```

---

### 17. Update Service (Admin Only)
**PUT** `/services/:id`

Update a medical service.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "price": 85,
  "active": false
}
```

**Response (200 OK):**
```json
{
  "message": "Service updated successfully",
  "service": {
    "_id": "507f1f77bcf86cd799439017",
    "name": "Blood Test",
    "price": 85,
    "active": false,
    "updatedAt": "2024-02-10T11:00:00Z"
  }
}
```

---

### 18. Delete Service (Admin Only)
**DELETE** `/services/:id`

Delete a medical service.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "message": "Service deleted successfully"
}
```

---

## 🔐 Authentication & Security

### JWT Token Usage

**Include token in requests:**

```bash
# Option 1: Authorization header
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/users/profile

# Option 2: x-access-token header
curl -H "x-access-token: YOUR_TOKEN" http://localhost:3000/api/users/profile
```

### Token Format

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzA3NTI3MTAwLCJleHAiOjE3MDgxMzE5MDB9.
_signature_here_
```

### Security Features

✅ **Password Hashing**: bcryptjs with salt rounds 10  
✅ **JWT Expiration**: 7 days by default (configurable)  
✅ **HTTPS**: Enforced in production  
✅ **CORS**: Configured for frontend domain  
✅ **Helmet.js**: HTTP security headers  
✅ **Input Validation**: express-validator middleware  
✅ **SQL Injection Prevention**: Using Mongoose ORM  
✅ **Environment Variables**: Secrets never in code  

---

## 👥 Role-Based Access Control (RBAC)

### Permission Matrix

| Permission | Patient | Premium | Doctor | Moderator | Admin |
|-----------|---------|---------|--------|-----------|-------|
| View own profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| Update own profile | ✓ | ✓ | ✓ | ✓ | ✓ |
| View all users | ✗ | ✗ | ✗ | ✓ | ✓ |
| Create appointment | ✓ | ✓ | ✗ | ✗ | ✓ |
| View own appointments | ✓ | ✓ | ✓* | ✗ | ✓ |
| View medical records | ✗ | ✓ | ✓* | ✗ | ✓ |
| Create medical records | ✗ | ✗ | ✓ | ✗ | ✓ |
| Manage users | ✗ | ✗ | ✗ | ✗ | ✓ |
| Delete users | ✗ | ✗ | ✗ | ✗ | ✓ |
| Moderate content | ✗ | ✗ | ✗ | ✓ | ✓ |
| Ban users | ✗ | ✗ | ✗ | ✓ | ✓ |

*Doctors see only their own appointments and patients

### Using RBAC in Routes

```javascript
const { checkRole, ROLES } = require('./app/middlewares/roleMiddleware');

// Admin only
router.delete('/users/:id', checkRole(ROLES.ADMIN), deleteUser);

// Doctor or Admin
router.get('/records', checkRole(ROLES.DOCTOR, ROLES.ADMIN), getRecords);

// Any authenticated user
router.get('/profile', auth, getProfile);
```

---

## 📧 Email Service Integration

### Supported Providers

- **SendGrid** (Recommended - Free tier available)
- **Mailgun**
- **Postmark**
- **Gmail** (with app password)

### Configuration

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### Automated Emails Sent

1. **Registration**: Welcome email to new users
2. **Appointment Confirmation**: When appointment is booked
3. **Appointment Updates**: When status changes
4. **Medical Records**: When new records are created

### Email Templates

All emails use HTML templates with professional formatting and include:
- Appointment details
- Doctor/patient information
- Action buttons
- Contact information
- Terms and conditions

---

## 🚀 Deployment

### Deploying to Railway

**Step 1:** Push code to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2:** Create Railway project

1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "GitHub repo"
3. Select your repository

**Step 3:** Configure environment variables in Railway Dashboard

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/medapp
JWT_SECRET=your_production_secret_minimum_32_chars
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key
EMAIL_FROM=noreply@yourdomain.com
CORS_ORIGIN=https://your-frontend-url.com
```

**Step 4:** Deploy

Railway automatically deploys on push to main branch.

### Health Check

```bash
curl https://your-app.up.railway.app/api/health
```

---

## 📸 Screenshots

### 1. Home Page
Shows welcome screen with login/register options and featured services.

### 2. Registration Page
User registration form with validation for:
- Email format
- Password strength
- Age verification (18+)
- Username uniqueness

### 3. Login Page
Secure login with email and password authentication.

### 4. Dashboard
User dashboard showing:
- Quick stats (appointments, services)
- Upcoming appointments
- Recent activity
- Quick action buttons

### 5. Book Appointment
Appointment booking form with:
- Doctor selection
- Date/time picker
- Reason for visit
- Symptoms checklist
- Duration selection

### 6. Doctors List
Browse and filter doctors by:
- Specialization
- Availability
- Rating/Reviews
- Search functionality

### 7. Appointments
View all appointments with:
- Status indicators
- Action buttons
- Detailed information
- Cancel/reschedule options

### 8. Medical Records
For premium patients and doctors:
- View medical history
- Diagnosis information
- Prescription details
- Doctor notes

### 9. User Profile
Manage profile information:
- Personal details
- Contact information
- Change password
- Delete account

### 10. Admin Panel
Administrative dashboard with:
- User management
- Appointment oversight
- Service management
- System statistics

---

## 🐛 Troubleshooting

### Email Not Sending

**Problem:** Emails not being delivered

**Solutions:**
1. Check SMTP credentials in `.env`
2. Verify firewall allows port 587
3. Check email service API key validity
4. Review server logs: `npm run dev`
5. Test configuration: See `DEPLOYMENT_GUIDE.md`

### Database Connection Error

**Problem:** Cannot connect to MongoDB

**Solutions:**
1. Ensure MongoDB is running: `mongod`
2. Check `MONGODB_URI` in `.env`
3. Verify IP whitelisting (if using MongoDB Atlas)
4. Check database credentials
5. Test connection: `npm run test`

### Authentication Issues

**Problem:** Token not working or access denied

**Solutions:**
1. Verify token format in Authorization header
2. Check JWT expiration
3. Ensure JWT_SECRET matches between server and client
4. Verify user role has required permissions
5. Clear browser cache and try again

### CORS Errors

**Problem:** Cross-origin request blocked

**Solutions:**
1. Check `CORS_ORIGIN` in `.env`
2. Ensure frontend URL matches exactly (with protocol)
3. Verify `Access-Control-Allow-*` headers
4. Check browser console for detailed error

### Port Already in Use

**Problem:** Port 3000 already occupied

**Solutions:**
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm start
```

---

## 📚 Additional Documentation

- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete deployment and environment setup
- **[QUICK_START.md](./QUICK_START.md)** - Quick start in 5 minutes
- **[RBAC_EXAMPLES.js](./RBAC_EXAMPLES.js)** - RBAC usage examples
- **[.env.example](./.env.example)** - Environment variables template

---

## 📝 License

This project is licensed under the ISC License - see `package.json` for details.

---

## 👥 Contributing

This is a project for educational purposes. For questions or improvements, please open an issue or contact the development team.

---

## 📞 Support

For issues or questions:
1. Check this README and documentation files
2. Review `DEPLOYMENT_GUIDE.md` for deployment issues
3. Check `QUICK_START.md` for setup problems
4. Review error messages in server logs

---

**Last Updated:** February 10, 2026

**Project Version:** 1.0.0

**Status:** Production Ready ✅
