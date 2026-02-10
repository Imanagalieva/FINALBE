# MedApp Deployment & Configuration Guide

## 📋 Table of Contents
1. [Environment Variables Setup](#environment-variables-setup)
2. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
3. [Email Service Integration](#email-service-integration)
4. [Deployment to Railway](#deployment-to-railway)
5. [Security Best Practices](#security-best-practices)

---

## Environment Variables Setup

### 1. Local Development Setup

**Step 1: Create `.env` file from template**
```bash
cp .env.example .env
```

**Step 2: Configure your `.env` file with your values:**

```env
# Node Environment
NODE_ENV=development
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017/medapp
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medapp

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_recommended
JWT_EXPIRE=7d

# SMTP Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
EMAIL_FROM=noreply@medapp.com

# Application
APP_NAME=MedApp Clinic
APP_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

### 2. Environment Variable Security

⚠️ **CRITICAL: Never commit `.env` file to Git!**

The `.gitignore` file already excludes:
- `.env`
- `.env.local`
- `.env.*.local`
- `.env.production`

### 3. Available Email Service Providers

#### SendGrid (Recommended)
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

#### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
EMAIL_FROM=noreply@your-domain.mailgun.org
```

#### Postmark
```env
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=your_postmark_server_token
SMTP_PASS=your_postmark_server_token
EMAIL_FROM=your-verified-sender@yourdomain.com
```

#### Gmail (Less Secure)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # Use App Password, not regular password
EMAIL_FROM=your-email@gmail.com
```

---

## Role-Based Access Control (RBAC)

### User Roles

The system supports 5 different user roles with specific permissions:

#### 1. **PATIENT** (Default)
- View own profile
- Update own profile
- Book appointments
- View own appointments
- Cancel own appointments
- ❌ Cannot view medical records
- ❌ Cannot delete appointments

#### 2. **PREMIUM_PATIENT**
- All PATIENT permissions
- ✅ View medical records
- ✅ Access to premium features
- Priority appointment booking
- Enhanced support

#### 3. **DOCTOR**
- View own profile
- Update own profile
- View all appointments
- Manage appointments (confirm, cancel)
- View patient medical records
- Create patient records
- ❌ Cannot delete users

#### 4. **MODERATOR**
- View all users
- Moderate content
- Ban users
- Access reports
- View platform analytics
- ❌ Cannot delete users

#### 5. **ADMIN** (Full Access)
- All permissions
- Delete users
- Delete appointments
- Manage all users
- Full system access
- View all reports

### Using RBAC Middleware

**Basic Role Check:**
```javascript
const { checkRole, ROLES } = require('../middlewares/roleMiddleware');

// Only admins can access
router.delete('/users/:id', checkRole(ROLES.ADMIN), deleteUser);

// Only doctors and admins
router.get('/appointments', checkRole(ROLES.DOCTOR, ROLES.ADMIN), getAppointments);

// Any authenticated user
router.get('/profile', auth, getProfile);
```

**Permission-Based Check:**
```javascript
const { checkPermission } = require('../middlewares/roleMiddleware');

// User must have permission to view medical records
router.get('/records', checkPermission('canViewMedicalRecords'), getRecords);
```

**Ownership Check:**
```javascript
const { checkOwnershipOrAdmin } = require('../middlewares/roleMiddleware');

// User can only update their own profile or admins can update anyone
router.put('/users/:id', checkOwnershipOrAdmin(req.params.id), updateUser);
```

### User Registration with Roles

```javascript
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "fullName": "John Doe",
  "phone": "555-1234",
  "birthDate": "1990-01-15",
  "role": "patient"  // Optional: defaults to 'patient'
}
```

---

## Email Service Integration

### How Email Service Works

The system uses **Nodemailer** with SMTP to send emails automatically for:
- User registration (welcome email)
- Appointment confirmations
- Appointment cancellations
- Password reset notifications

### Email Configuration Files

1. **`app/services/email.service.js`** - Email service module
2. **`server.js`** - Email functions and transporter setup

### Sending Emails in Your Code

**Example 1: Welcome Email**
```javascript
const { sendWelcomeEmail } = require('../services/email.service');

const newUser = {
  email: 'user@example.com',
  fullName: 'John Doe',
  username: 'john_doe',
  role: 'patient'
};

await sendWelcomeEmail(newUser);
```

**Example 2: Appointment Confirmation**
```javascript
const { sendAppointmentConfirmation } = require('../services/email.service');

await sendAppointmentConfirmation(
  'patient@example.com',
  'John Doe',
  'Dr. Smith',
  '2024-03-15 14:00'
);
```

### Testing Email Configuration Locally

Create a test file `test-email.js`:
```javascript
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function testEmail() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'test@example.com',
      subject: 'Test Email',
      html: '<h1>Test Email Success!</h1>'
    });
    console.log('✅ Email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testEmail();
```

Run with: `node test-email.js`

---

## Deployment to Railway

### Railway Deployment Setup

**Step 1: Sign Up on Railway**
- Visit [railway.app](https://railway.app)
- Sign up with GitHub

**Step 2: Prepare Repository**
```bash
# Initialize Git if not already done
git init

# Add and commit files (but NOT .env!)
git add .
git commit -m "Initial commit"

# Connect to GitHub and push
git remote add origin https://github.com/yourusername/yourrepo.git
git branch -M main
git push -u origin main
```

**Step 3: Create Railway Project**
1. Log in to Railway Dashboard
2. Click "New Project"
3. Select "GitHub repo"
4. Choose your repository
5. Click "Create"

**Step 4: Configure Environment Variables in Railway Dashboard**

Go to: **Project → Variables**

Add all required environment variables:

```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medapp
JWT_SECRET=your_production_jwt_secret_minimum_32_chars
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_sendgrid_api_key
EMAIL_FROM=noreply@yourdomain.com
APP_URL=https://your-railway-app.up.railway.app
CORS_ORIGIN=https://your-frontend-url.com
```

**Step 5: Deploy**
1. Railway automatically deploys when you push to main
2. Monitor deployment in Railway Dashboard
3. View logs: **Deployments → View Logs**

### Health Check

Your application includes a health check endpoint at `/api/health`:

```bash
curl https://your-railway-app.up.railway.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-02-10T10:00:00Z"
}
```

### Database Setup on Railway

**Option 1: MongoDB Atlas (Recommended)**
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Add to Railway variables as `MONGODB_URI`

**Option 2: Railway MySQL (Alternative)**
1. In Railway Dashboard, add MySQL plugin
2. Use provided connection string

---

## Security Best Practices

### 1. Environment Variables
- ✅ Always use `.env.example` for template
- ✅ Keep `.env` in `.gitignore`
- ✅ Use strong, random values (min 32 characters for JWT_SECRET)
- ❌ Never commit real `.env` files
- ❌ Never use default values in production

### 2. JWT Secret
Generate a strong secret:
```bash
# Linux/macOS
openssl rand -hex 32

# Online tool: https://1password.com/password-generator/
```

### 3. Email Credentials
- ✅ Use API keys instead of passwords
- ✅ Use SendGrid, Mailgun, or Postmark (not personal emails)
- ✅ Keep SMTP credentials in environment variables
- ❌ Never hardcode credentials
- ❌ Don't use personal Gmail in production

### 4. Database Security
- ✅ Use MongoDB Atlas with IP whitelisting
- ✅ Enable authentication
- ✅ Use strong database passwords
- ✅ Enable encryption at rest
- ❌ Never expose MongoDB connection strings

### 5. CORS Configuration
```javascript
// Whitelist only your frontend domain
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 6. Password Security
- Minimum 6 characters (configurable in code)
- Hashed with bcryptjs (salt rounds: 10)
- Never stored in plaintext

### 7. API Keys & Secrets
- Rotate API keys regularly
- Use different keys for different environments
- Monitor API key usage
- Revoke compromised keys immediately

### 8. Helmet.js (Already Included)
Provides HTTP header security:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### 9. Rate Limiting (Recommended Addition)
Add to your project:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 10. Input Validation (Already Included)
Using `express-validator` for request validation:
```javascript
const { body, validationResult } = require('express-validator');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('username').trim().isLength({ min: 3 })
], validateRequest);
```

---

## Troubleshooting

### Email Not Sending
1. Check SMTP credentials in `.env`
2. Verify firewall/port access (usually port 587)
3. Check email service API key validity
4. Review server logs: `npm run dev`

### Railway Deployment Failed
1. Check Node version: `node --version` (should be >= 16)
2. Verify all required env variables are set
3. Check Railway logs for errors
4. Ensure MongoDB connection string is correct

### RBAC Permission Denied
1. Verify user role in database
2. Check middleware usage: `checkRole(ROLES.ADMIN)`
3. Ensure user is authenticated (JWT token valid)
4. Check role names match exactly

### JWT Token Expired
1. User needs to log in again
2. Check `JWT_EXPIRE` value in `.env`
3. Implement refresh token mechanism (advanced)

---

## Support & Resources

- [Railway Documentation](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Nodemailer Guide](https://nodemailer.com/about)
- [SendGrid Docs](https://sendgrid.com/docs)
- [Express.js Documentation](https://expressjs.com)

---

**Last Updated:** February 10, 2026
