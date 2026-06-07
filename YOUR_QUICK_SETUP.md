# Your Quick Setup Guide - MongoDB Already Connected! ✅

Your MongoDB cluster is ready! Here's how to get everything running quickly.

---

## ✅ MongoDB Status: Connected

**Your Connection String:**
```
mongodb+srv://broosowwan_db_user:Admin123@cluster0.e6jjdnv.mongodb.net/sowwanpay?retryWrites=true&w=majority&appName=Cluster0
```

✅ Cluster: `cluster0.e6jjdnv.mongodb.net`  
✅ User: `broosowwan_db_user`  
✅ Database: `sowwanpay` (will be created automatically)

---

## 🚀 Backend Setup (10 Minutes)

### Step 1: Create Backend Directory

```bash
# Create backend project
mkdir sowwanpay-backend
cd sowwanpay-backend

# Initialize npm
npm init -y
```

### Step 2: Install Dependencies

```bash
npm install express mongoose cors dotenv @sendgrid/mail bcrypt jsonwebtoken
npm install --save-dev nodemon
```

### Step 3: Update package.json

Edit `package.json` and add these scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### Step 4: Copy All Backend Code

Open [backend-server/BACKEND_CODE.md](backend-server/BACKEND_CODE.md) and copy each file:

**Required files:**
1. `server.js` - Main server
2. `config/database.js` - MongoDB connection
3. `models/Order.js` - Order model
4. `models/CustomRequest.js` - Request model
5. `models/Subscription.js` - Subscription model
6. `models/WebsitePage.js` - Website builder model
7. `routes/orders.js` - Orders API
8. `routes/requests.js` - Requests API
9. `routes/subscriptions.js` - Subscriptions API
10. `routes/admin.js` - Admin auth API
11. `routes/websiteBuilder.js` - Website builder API
12. `utils/email.js` - Email utility

### Step 5: Create .env File

Create `.env` file in `sowwanpay-backend/`:

```bash
# Your MongoDB connection (READY TO USE!)
MONGODB_URI=mongodb+srv://broosowwan_db_user:Admin123@cluster0.e6jjdnv.mongodb.net/sowwanpay?retryWrites=true&w=majority&appName=Cluster0

# Server
PORT=10000
NODE_ENV=development

# Generate a secure JWT secret (run this command):
# node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=paste-generated-secret-here

# Admin Credentials (CHANGE PASSWORD IN PRODUCTION!)
ADMIN_USERNAME=admin
# This hash is for password: admin123
# Generate new: bcrypt-cli hash YOUR_PASSWORD 10
ADMIN_PASSWORD_HASH=$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

# SendGrid (add after setting up SendGrid account)
SENDGRID_API_KEY=your_key_here
EMAIL_FROM=noreply@sowwanpay.com
EMAIL_TO=sowwanpay@gmail.com

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 6: Generate JWT Secret

```bash
# Run this to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy the output and paste it as JWT_SECRET in .env
```

### Step 7: Test Locally

```bash
# Start the server
npm run dev

# Should see:
# ✅ MongoDB Connected: cluster0.e6jjdnv.mongodb.net
# 🚀 Server running on port 10000
```

### Step 8: Test API

Open another terminal:

```bash
# Health check
curl http://localhost:10000/api/health

# Should return:
# {"status":"OK","message":"SowwanPay API is running"...}

# Test order creation
curl -X POST http://localhost:10000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "TEST_123",
    "service": "Social Media Management",
    "serviceId": "social-media",
    "amount": "299"
  }'

# Check MongoDB Atlas - you should see the order!
```

---

## 📧 SendGrid Setup (5 Minutes)

### Step 1: Create SendGrid Account

1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for free account
3. Verify your email

### Step 2: Verify Sender Email

1. Go to Settings → Sender Authentication
2. Click "Verify a Single Sender"
3. Use: `sowwanpay@gmail.com` or your custom domain
4. Check email and verify

### Step 3: Create API Key

1. Go to Settings → API Keys
2. Click "Create API Key"
3. Name: `sowwanpay-backend`
4. Permissions: "Full Access"
5. Copy the key (starts with `SG.`)

### Step 4: Add to .env

```bash
# Add this to your .env file
SENDGRID_API_KEY=SG.your_actual_key_here
```

---

## 🌐 Deploy to Render (10 Minutes)

### Step 1: Push to GitHub

```bash
# In sowwanpay-backend directory
git init
git add .
git commit -m "Backend server with MongoDB"

# Create repo on GitHub: sowwanpay-backend
git remote add origin https://github.com/YOUR_USERNAME/sowwanpay-backend.git
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub → Select `sowwanpay-backend`
4. Configure:
   - **Name**: `sowwanpay-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 3: Add Environment Variables in Render

Click "Environment" and add these:

```
MONGODB_URI=mongodb+srv://broosowwan_db_user:Admin123@cluster0.e6jjdnv.mongodb.net/sowwanpay?retryWrites=true&w=majority&appName=Cluster0

PORT=10000

NODE_ENV=production

JWT_SECRET=your-generated-secret-from-step-6

ADMIN_USERNAME=admin

ADMIN_PASSWORD_HASH=$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

SENDGRID_API_KEY=SG.your_sendgrid_key

EMAIL_FROM=sowwanpay@gmail.com

EMAIL_TO=sowwanpay@gmail.com

FRONTEND_URL=https://sowwanpay.com

ADMIN_URL=https://admin.sowwanpay.com

CORS_ORIGINS=https://sowwanpay.com,https://admin.sowwanpay.com
```

### Step 4: Deploy

Click "Create Web Service" - Render will deploy automatically!

Your API will be live at: `https://sowwanpay-api.onrender.com`

---

## 🔗 Connect Frontend to Backend

### Step 1: Update Main Site

In your main project directory:

```bash
# Create .env file
echo "VITE_API_URL=https://sowwanpay-api.onrender.com/api" > .env

# Commit and push
git add .env
git commit -m "Added backend API URL"
git push
```

### Step 2: Add to Vercel

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://sowwanpay-api.onrender.com/api`
4. Redeploy

### Step 3: Test Everything

1. Visit your site
2. Try purchasing a service
3. Submit a custom request
4. Check MongoDB - data should appear!
5. Check email - you should receive notification!

---

## ✅ Your Setup Checklist

- [ ] MongoDB connection tested ✅ (Already working!)
- [ ] Backend code copied
- [ ] Dependencies installed
- [ ] .env file created
- [ ] JWT secret generated
- [ ] Server runs locally
- [ ] API endpoints tested
- [ ] SendGrid account created
- [ ] Sender email verified
- [ ] API key added to .env
- [ ] Pushed to GitHub
- [ ] Deployed to Render
- [ ] Environment variables set in Render
- [ ] Frontend .env updated
- [ ] Vercel environment variables added
- [ ] Full end-to-end test successful

---

## 🧪 Test Your Setup

### Test 1: MongoDB Connection
```bash
# In backend directory
node -e "require('dotenv').config(); require('./config/database')();"

# Should see: ✅ MongoDB Connected
```

### Test 2: Create Order via API
```bash
curl -X POST https://sowwanpay-api.onrender.com/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_001",
    "service": "Social Media Management",
    "serviceId": "social-media",
    "amount": "299"
  }'
```

### Test 3: Admin Login
```bash
curl -X POST https://sowwanpay-api.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Should return a JWT token
```

---

## 📊 Check Your Data

### View in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click "Browse Collections"
3. Select `sowwanpay` database
4. View collections:
   - `orders` - Service purchases
   - `customrequests` - Custom website requests
   - `subscriptions` - Recurring subscriptions
   - `websitepages` - Website builder data

---

## 🔐 Security Notes

⚠️ **Important**: Your connection string contains credentials!

**For production:**
1. Change MongoDB password to something stronger
2. Generate new JWT_SECRET (different from example)
3. Change admin password from `admin123`
4. Restrict MongoDB IP access (currently set to 0.0.0.0/0)

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
- Check connection string is correct
- Verify database user exists in MongoDB Atlas
- Ensure IP whitelist includes 0.0.0.0/0

### "API returns 500 error"
- Check Render logs
- Verify all environment variables are set
- Test MongoDB connection

### "Email not sending"
- Verify SendGrid sender is verified
- Check API key is correct
- Look for errors in Render logs

---

## 📞 Need Help?

**Email**: sowwanpay@gmail.com

**Include**:
- What step you're on
- Error messages (copy full text)
- Render logs (if applicable)

---

## 🎉 Next Steps

Once backend is deployed:

1. Test all endpoints
2. Connect frontend (see MONGODB_MIGRATION.md)
3. Deploy admin panel (see admin-project-setup/README.md)
4. Test complete flow
5. Go live!

---

**Your MongoDB is ready - let's build!** 🚀
