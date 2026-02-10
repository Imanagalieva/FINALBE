# MedApp - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Development Server
```bash
npm run dev
```

Server runs on `http://localhost:3000`

---

## 📧 Email Service Quick Setup

### SendGrid (Recommended - Free tier available)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Add to `.env`:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### Test Email
```bash
node -e "
const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: 'test@example.com',
  subject: 'Test',
  html: 'Test email'
}, (err) => err ? console.error(err) : console.log('✅ Sent'));
"
```

---

## 🔐 User Roles & Permissions

### Available Roles
```
- patient (default)
- premium_patient (with medical records access)
- doctor
- moderator
- admin
```

### Using in Routes
```javascript
const { checkRole, ROLES } = require('./app/middlewares/roleMiddleware');

// Admin only
router.delete('/users/:id', checkRole(ROLES.ADMIN), deleteUser);

// Doctor or Admin
router.get('/appointments', checkRole(ROLES.DOCTOR, ROLES.ADMIN), getAppointments);
```

---

## 🗄️ Database

### MongoDB Local
```bash
# Ensure MongoDB is running
mongod
```

### MongoDB Atlas (Production)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/medapp
```

---

## 📤 Deploy to Railway

```bash
# 1. Push to GitHub
git push origin main

# 2. Set env variables in Railway Dashboard:
#    - MONGODB_URI
#    - JWT_SECRET
#    - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM

# 3. Railway auto-deploys on push
```

Check deployment: `https://your-app.up.railway.app/api/health`

---

## 🔑 Available Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `DELETE /api/users/:id` - Delete account (admin/own account)

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - View appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details

### Medical Records
- `GET /api/records` - View own records
- `POST /api/records` - Create record (doctor only)

---

## 🛡️ Security Checklist

- [ ] `.env` file in `.gitignore`
- [ ] JWT_SECRET >= 32 characters (use: `openssl rand -hex 32`)
- [ ] Using API keys (not personal emails) for SMTP
- [ ] CORS_ORIGIN set to your frontend URL
- [ ] MongoDB password protected
- [ ] Email credentials in env variables
- [ ] No hardcoded secrets in code

---

## 📝 Common Tasks

### Reset Database & Seed Data
```bash
npm run seed:reset
```

### Run with Nodemon (Auto-reload)
```bash
npm run dev
```

### Test Email Configuration
```bash
npm run test
```

---

## ❓ Troubleshooting

**Email not sending?**
- Check SMTP credentials in `.env`
- Verify port 587 access
- Check email service API key is valid
- Review logs: `npm run dev`

**Can't connect to MongoDB?**
- Ensure MongoDB is running locally: `mongod`
- Check MONGODB_URI in `.env`
- Verify firewall settings

**Role-based access denied?**
- Check user role in database
- Verify correct role enum used
- Ensure JWT token is valid

---

## 📚 Full Documentation

See `DEPLOYMENT_GUIDE.md` for comprehensive documentation on:
- Environment variables
- RBAC details
- Email service setup
- Railway deployment
- Security best practices

---

**Next Step:** Set up `.env` file and run `npm run dev`
