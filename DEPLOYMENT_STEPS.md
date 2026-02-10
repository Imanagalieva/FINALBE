# MedApp - Deployment Step-by-Step

This guide covers deploying MedApp to **Railway** or **Render** with complete setup instructions.

---

## 🚀 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] MongoDB Atlas account (free tier available)
- [ ] Email service account (SendGrid, Mailgun, or Postmark)
- [ ] Railway or Render account
- [ ] Project pushed to GitHub
- [ ] `.env` file configured locally and tested
- [ ] `.env` NOT committed to Git (check `.gitignore`)

---

## 📊 Compare: Railway vs Render

| Feature | Railway | Render |
|---------|---------|--------|
| Free Tier | Yes ($5/month free credits) | Yes (but limited) |
| Ease of Setup | Very Easy | Easy |
| Auto-deploy from Git | Yes | Yes |
| Environment Variables | Dashboard UI | Dashboard UI |
| Database Support | Native PostgreSQL, MySQL | Via external services |
| Cold Starts | Rare | Can occur |
| **Recommended** | ⭐ **Best for this project** | Good alternative |

---

## 🚀 Deployment Option 1: Railway (Recommended)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Sign up"
3. Choose "Continue with GitHub"
4. Authorize Railway to access your GitHub

### Step 2: Create Project from Repository

1. In Railway Dashboard, click **"New Project"**
2. Select **"GitHub repo"**
3. Search for your MedApp repository
4. Click **"Import"**
5. Railway will auto-detect it's a Node.js project
6. Click **"Deploy"**

### Step 3: Set Environment Variables

⚠️ **CRITICAL: These variables must be set in Railway BEFORE first deploy**

1. In Railway Dashboard, go to your project
2. Click the **Node.js service**
3. Go to **"Variables"** tab
4. Click **"+ New Variable"** and add:

```
NODE_ENV = production
PORT = 3000
MONGODB_URI = mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/medapp
JWT_SECRET = [generate 32 random characters: openssl rand -hex 32]
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USER = apikey
SMTP_PASS = SG.[your_sendgrid_api_key]
EMAIL_FROM = noreply@yourdomain.com
APP_URL = https://[your-app-name].up.railway.app
CORS_ORIGIN = https://your-frontend-url.com
```

### Step 4: Monitor Deployment

1. Go to **"Deployments"** tab
2. Wait for status to show **"✅ Success"**
3. If failed, check **"View Logs"** for errors

### Step 5: Test Your Deployment

```bash
# Test health endpoint
curl https://[your-app-name].up.railway.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2024-02-10T..."}

# Test registration
curl -X POST https://[your-app-name].up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Test123!",
    "fullName":"Test User",
    "phone":"555-1234",
    "birthDate":"2000-01-15"
  }'
```

### Step 6: Set Up Custom Domain (Optional)

1. In Railway project settings, go to **"Domains"**
2. Click **"Generate Domain"** or **"Add Custom Domain"**
3. Follow DNS setup instructions

### Step 7: Auto-Deploy on Git Push

Railway automatically redeploys when you push to main:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Railway detects the push and auto-deploys (watch in Dashboard)
```

---

## 🚀 Deployment Option 2: Render

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Sign up"**
3. Choose **"Sign up with GitHub"**
4. Authorize Render

### Step 2: Create Web Service

1. In Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Search for your MedApp repository
4. Click **"Connect"**

### Step 3: Configure Service

In the deployment form:

```
Name: medapp
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free (or Starter)
```

### Step 4: Add Environment Variables

Click **"Advanced"** and add:

```
NODE_ENV = production
PORT = 3000
MONGODB_URI = mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/medapp
JWT_SECRET = [32 random characters]
SMTP_HOST = smtp.sendgrid.net
SMTP_PORT = 587
SMTP_USER = apikey
SMTP_PASS = SG.[your_api_key]
EMAIL_FROM = noreply@yourdomain.com
APP_URL = https://[your-app].onrender.com
CORS_ORIGIN = https://your-frontend-url.com
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (watch logs)
3. When complete, you'll see a success message

### Step 6: Test Your Deployment

```bash
curl https://[your-app].onrender.com/api/health
```

### Step 7: Auto-Deploy from GitHub

Render automatically redeploys on GitHub push (enabled by default).

---

## 🗄️ MongoDB Atlas Setup (Free Tier)

### Step 1: Create MongoDB Account

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Try Free"**
3. Create account with email

### Step 2: Create Cluster

1. Click **"Create a Deployment"**
2. Choose **"M0 Free"** tier
3. Choose provider (AWS, Azure, or GCP)
4. Choose region closest to you
5. Click **"Create Deployment"**
6. Wait 5-10 minutes for creation

### Step 3: Create Database User

1. Go to **"Database Access"**
2. Click **"Add New Database User"**
3. Set username (e.g., `medapp_user`)
4. Set strong password (copy it!)
5. Click **"Add User"**

### Step 4: Configure Network Access

1. Go to **"Network Access"**
2. Click **"Add IP Address"**
3. Choose **"Allow access from anywhere"** (for development)
4. Click **"Confirm"**

⚠️ **For production, whitelist specific IP addresses**

### Step 5: Get Connection String

1. Click **"Connect"** on your cluster
2. Choose **"Drivers"**
3. Copy the connection string
4. Replace `<PASSWORD>` with your database user password
5. Replace `<DATABASE_NAME>` with `medapp`

Example:
```
mongodb+srv://medapp_user:mypassword123@cluster0.mongodb.net/medapp
```

---

## 📧 Email Service Setup

### Option 1: SendGrid (Recommended - Most Reliable)

**Step 1: Create Account**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Click **"Sign Up Free"**
3. Create account and verify email

**Step 2: Create API Key**
1. Go to **Settings → API Keys**
2. Click **"Create API Key"**
3. Name it: `MedApp Production`
4. Select **"Full Access"**
5. Copy the key (only shown once!)

**Step 3: Add to Environment**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.your_api_key_here
EMAIL_FROM=noreply@yourdomain.com
```

**Verify Sender Email:**
1. Go to **Settings → Sender Authentication**
2. Add your sender email
3. Verify domain or single email

---

### Option 2: Mailgun

**Step 1: Create Account**
1. Go to [mailgun.com](https://mailgun.com)
2. Sign up for free tier

**Step 2: Get SMTP Credentials**
1. Go to **Sending → Domain Settings**
2. Copy SMTP credentials

**Step 3: Add to Environment**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
EMAIL_FROM=noreply@your-domain.mailgun.org
```

---

### Option 3: Postmark

**Step 1: Create Account**
1. Go to [postmarkapp.com](https://postmarkapp.com)
2. Sign up and create project

**Step 2: Get Server Token**
1. Go to **Server Settings**
2. Copy **Server Token**

**Step 3: Add to Environment**
```env
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=your_server_token
SMTP_PASS=your_server_token
EMAIL_FROM=your-verified-email@domain.com
```

---

## 🧪 Testing Your Deployment

### Test 1: Health Check
```bash
curl https://your-app.up.railway.app/api/health
# Should return: {"status":"ok"}
```

### Test 2: User Registration
```bash
curl -X POST https://your-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test User",
    "phone": "555-1234",
    "birthDate": "2000-01-15"
  }'
```

### Test 3: Email Service
Register a user and check your email for welcome message.

### Test 4: Authentication
```bash
# Get token from registration response, then:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-app.up.railway.app/api/users/profile
```

---

## 🔧 Troubleshooting

### Database Connection Failed
```
Error: connect ECONNREFUSED
```
- Check `MONGODB_URI` is correct
- Verify MongoDB Atlas cluster is running
- Ensure IP whitelist includes deployment server
- Test locally first with `node test-connection.js`

### Email Not Sending
```
Error: SMTP connection failed
```
- Verify SMTP credentials
- Check email service API key is active
- Ensure port 587 is accessible
- Try different email service if needed

### Deployment Stuck
```
Status: Building
```
- Wait 10+ minutes (first build is slower)
- Check **View Logs** for build errors
- Ensure `package.json` is valid
- Verify `npm install` completes locally

### Cannot Connect to Deployed App
```
Connection refused / Not found
```
- Wait 5 minutes after deployment completes
- Check status page in dashboard (Railway/Render)
- Verify correct URL: `https://your-app.up.railway.app`
- Check firewall/CORS settings

### CORS Error from Frontend
```
Access to XMLHttpRequest has been blocked by CORS policy
```
- Set `CORS_ORIGIN` to frontend URL
- Restart application after changing env var
- Verify frontend URL exactly (https vs http, domain)

---

## 🔐 Security Reminders

### Production Checklist
- [ ] `JWT_SECRET` is 32+ random characters
- [ ] `.env` file in `.gitignore`
- [ ] Database password is strong
- [ ] Email API key is restricted to IP (if possible)
- [ ] CORS_ORIGIN is set to your frontend only
- [ ] No debug logs in production
- [ ] Rate limiting enabled
- [ ] HTTPS enforced

### After Deployment
- [ ] Change default passwords
- [ ] Update security headers
- [ ] Enable two-factor authentication on accounts
- [ ] Set up monitoring/alerts
- [ ] Regular backups enabled

---

## 📞 Getting Help

**If deployment fails:**

1. Check the **Logs** in Railway/Render Dashboard
2. Review this guide for that specific error
3. Test locally: `npm run dev`
4. Verify all environment variables are set
5. Check GitHub repo is public (if using SSH)

**Common Resources:**
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Express.js: https://expressjs.com

---

**Last Updated:** February 10, 2026
**Status:** ✅ All systems ready for deployment
