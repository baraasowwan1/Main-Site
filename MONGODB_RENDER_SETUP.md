# MongoDB + Render Backend Setup

Complete guide to set up your backend using **MongoDB** for database and **Render** for server hosting.

---

## 🎯 Architecture Overview

```
Main Site (sowwanpay.com)
     ↓
Backend API (Render)
     ↓
MongoDB Database
     ↑
Admin Site (admin.sowwanpay.com)
```

---

## 📋 Prerequisites

1. **MongoDB Atlas Account** (Free tier available)
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Render Account** (Free tier available)
   - Sign up at [render.com](https://render.com)

3. **SendGrid Account** (Free tier for email)
   - Sign up at [sendgrid.com](https://sendgrid.com)

---

## 🗄️ Part 1: MongoDB Setup

### Step 1: Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Create" → "Build a Database"
3. Choose **M0 FREE** tier
4. Select a cloud provider and region (closest to you)
5. Name your cluster: `sowwanpay-cluster`
6. Click "Create Cluster"

### Step 2: Create Database User

1. In Atlas, go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `sowwanpay-admin`
5. Generate a strong password (save it!)
6. Built-in Role: "Read and write to any database"
7. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

⚠️ **Production Note**: In production, restrict to Render's IP addresses

### Step 4: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Driver: Node.js
4. Version: 5.5 or later
5. Copy the connection string, looks like:
   ```
   mongodb+srv://sowwanpay-admin:<password>@sowwanpay-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name before `?`:
   ```
   mongodb+srv://sowwanpay-admin:YOUR_PASSWORD@sowwanpay-cluster.xxxxx.mongodb.net/sowwanpay?retryWrites=true&w=majority
   ```

**Save this connection string!** You'll need it for environment variables.

---

## 🔧 Part 2: Backend Server Setup

### Step 1: Create Backend Project

```bash
# Create new directory
mkdir sowwanpay-backend
cd sowwanpay-backend

# Initialize project
npm init -y

# Install dependencies
npm install express mongoose cors dotenv nodemailer @sendgrid/mail
npm install --save-dev nodemon
```

### Step 2: Project Structure

Create this file structure:

```
sowwanpay-backend/
├── server.js              # Main entry point
├── .env                   # Environment variables
├── .gitignore            # Git ignore file
├── package.json          # Dependencies
├── models/
│   ├── Order.js
│   ├── CustomRequest.js
│   ├── Subscription.js
│   └── WebsitePage.js
├── routes/
│   ├── orders.js
│   ├── requests.js
│   ├── subscriptions.js
│   ├── admin.js
│   └── websiteBuilder.js
├── config/
│   └── database.js
└── utils/
    └── email.js
```

### Step 3: Create Files

I'll provide all the code in the `backend-server/` directory...

---

## 📦 Part 3: Deploy to Render

### Step 1: Push to GitHub

```bash
# In sowwanpay-backend directory
git init
git add .
git commit -m "Backend server with MongoDB"
git remote add origin https://github.com/YOUR_USERNAME/sowwanpay-backend.git
git push -u origin main
```

### Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `sowwanpay-backend`
4. Configure:
   - **Name**: `sowwanpay-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables

In Render, go to "Environment" tab and add:

```
MONGODB_URI=mongodb+srv://sowwanpay-admin:YOUR_PASSWORD@sowwanpay-cluster.xxxxx.mongodb.net/sowwanpay?retryWrites=true&w=majority

PORT=10000

NODE_ENV=production

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$... (bcrypt hash - see below)

SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxx
EMAIL_FROM=noreply@sowwanpay.com
EMAIL_TO=sowwanpay@gmail.com

FRONTEND_URL=https://sowwanpay.com
ADMIN_URL=https://admin.sowwanpay.com

CORS_ORIGINS=https://sowwanpay.com,https://admin.sowwanpay.com
```

### Step 4: Generate Password Hash

To generate bcrypt hash for admin password:

```bash
# Install bcrypt globally
npm install -g bcrypt-cli

# Generate hash for password "admin123"
bcrypt-cli hash admin123 10

# Copy the output to ADMIN_PASSWORD_HASH
```

Or use Node.js:
```javascript
const bcrypt = require('bcrypt');
bcrypt.hash('admin123', 10, (err, hash) => {
  console.log(hash);
});
```

### Step 5: Deploy

Click "Create Web Service" - Render will automatically:
1. Clone your repository
2. Install dependencies
3. Start the server
4. Provide a URL like: `https://sowwanpay-api.onrender.com`

---

## 🔗 Part 4: Update Frontend

### Update API URLs

**Main Site - Create `.env`:**
```bash
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

**Admin Site - Create `.env`:**
```bash
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

### Update in Vercel

For both deployments, add environment variable:
- Key: `VITE_API_URL`
- Value: `https://sowwanpay-api.onrender.com/api`

---

## 📧 Part 5: Email Setup (SendGrid)

### Step 1: Create SendGrid Account

1. Sign up at [SendGrid](https://sendgrid.com)
2. Verify your email
3. Complete Single Sender Verification:
   - From Email: `noreply@sowwanpay.com` (or your domain)
   - From Name: `SowwanPay Services`

### Step 2: Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: `sowwanpay-backend`
4. Permissions: "Full Access"
5. Copy the API key (starts with `SG.`)
6. Add to Render environment variables as `SENDGRID_API_KEY`

### Step 3: Verify Sender (Important!)

Before SendGrid allows sending emails:
1. Settings → Sender Authentication
2. Verify a Single Sender
3. Use the email you want to send FROM
4. Check your email and click verification link

---

## 🧪 Part 6: Test Your Setup

### Test MongoDB Connection

```bash
# In backend directory
node -e "require('./config/database').connect().then(() => console.log('Connected!'))"
```

### Test API Endpoints

```bash
# Health check
curl https://sowwanpay-api.onrender.com/api/health

# Create test order
curl -X POST https://sowwanpay-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST_123",
    "service": "Test Service",
    "serviceId": "test",
    "amount": "299"
  }'

# Get all orders
curl https://sowwanpay-api.onrender.com/api/orders

# Test admin login
curl -X POST https://sowwanpay-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

---

## 🔒 Security Checklist

- [ ] Changed admin password from default
- [ ] Generated strong JWT_SECRET
- [ ] MongoDB user has strong password
- [ ] SendGrid API key is secret
- [ ] CORS configured for your domains only
- [ ] MongoDB network access restricted (production)
- [ ] Environment variables set in Render
- [ ] `.env` added to `.gitignore`
- [ ] HTTPS enabled (automatic on Render)

---

## 💰 Costs

### Free Tier (Development)

- **MongoDB Atlas M0**: Free forever
  - 512 MB storage
  - Shared RAM
  - Perfect for development

- **Render Free**: $0/month
  - Spins down after 15 min inactivity
  - Slower cold starts
  - 750 hours/month

- **SendGrid Free**: $0/month
  - 100 emails/day
  - Good for testing

**Total**: $0/month

### Paid Tier (Production)

- **MongoDB Atlas M10**: $57/month
  - 10 GB storage
  - Dedicated cluster
  - Backups included

- **Render Starter**: $7/month
  - Always on
  - Fast response times
  - 512 MB RAM

- **SendGrid Essentials**: $15/month
  - 50,000 emails/month
  - Email validation

**Total**: ~$79/month

---

## 🚀 Deployment URLs

After setup, you'll have:

```
Main Site:    https://sowwanpay.com
Admin Site:   https://admin.sowwanpay.com
Backend API:  https://sowwanpay-api.onrender.com
MongoDB:      mongodb+srv://...
```

---

## 📊 MongoDB Collections

Your database will have these collections:

- `orders` - Service purchases
- `customrequests` - Custom website requests
- `subscriptions` - Recurring subscriptions
- `websitepages` - Website builder data
- `adminusers` - Admin accounts

Collections are created automatically when first document is inserted.

---

## 🔄 Environment Variables Reference

**Backend (Render):**
```
MONGODB_URI=mongodb+srv://...
PORT=10000
NODE_ENV=production
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$...
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@sowwanpay.com
EMAIL_TO=sowwanpay@gmail.com
FRONTEND_URL=https://sowwanpay.com
ADMIN_URL=https://admin.sowwanpay.com
CORS_ORIGINS=https://sowwanpay.com,https://admin.sowwanpay.com
```

**Frontend (Vercel):**
```
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

---

## 🆘 Troubleshooting

### MongoDB Connection Issues

**Error**: "Authentication failed"
- Check username/password in connection string
- Verify user has correct permissions

**Error**: "Network timeout"
- Check IP whitelist in Network Access
- Ensure 0.0.0.0/0 is allowed

### Render Deployment Issues

**Service won't start**
- Check Render logs
- Verify `package.json` has `start` script
- Check environment variables are set

**API returns 500**
- Check Render logs
- Verify MongoDB connection string
- Test MongoDB connection locally

### Email Not Sending

**Error**: "Invalid API key"
- Verify SendGrid API key in environment
- Check key has Full Access permissions

**Emails not received**
- Verify sender email in SendGrid
- Check spam folder
- Ensure EMAIL_TO is correct

---

## 📝 Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Create backend server (see `backend-server/` directory)
3. ✅ Deploy to Render
4. ✅ Configure SendGrid
5. ✅ Update frontend API URLs
6. ✅ Test all endpoints
7. ✅ Deploy frontend with new API URL

---

**See `backend-server/` directory for complete backend code!**
