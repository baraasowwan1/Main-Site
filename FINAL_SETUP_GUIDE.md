# 🚀 Complete Setup Guide - SowwanPay Services

**Your complete digital services platform with MongoDB, Render, and separate admin deployment.**

---

## 📊 What You Have

✅ **Main Client Website** - Ready to deploy  
✅ **Admin Panel** - Separate deployment setup ready  
✅ **Backend Server** - Complete Node.js code ready  
✅ **Database** - MongoDB schemas ready  
✅ **Email** - SendGrid integration ready  
✅ **API Layer** - Frontend service layer created  

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────┐
│  Main Site (sowwanpay.com)     │
│  - Services showcase            │
│  - Website builder              │
│  - Custom requests              │
│  - Payment flow                 │
└─────────────┬───────────────────┘
              │
              ↓ API Calls
┌─────────────────────────────────┐
│  Backend API (Render)           │
│  Node.js + Express              │
│  - /api/orders                  │
│  - /api/custom-requests         │
│  - /api/subscriptions           │
│  - /api/admin                   │
│  - /api/website-builder         │
└─────────────┬───────────────────┘
              │
              ↓ Data Storage
┌─────────────────────────────────┐
│  MongoDB Atlas                  │
│  - orders                       │
│  - customrequests               │
│  - subscriptions                │
│  - websitepages                 │
└─────────────┬───────────────────┘
              │
              ↑ API Calls
┌─────────────────────────────────┐
│  Admin Panel (admin.domain.com) │
│  - Dashboard                    │
│  - Client management            │
│  - Subscriptions                │
└─────────────────────────────────┘
```

---

## 🚀 Quick Start (30 Minutes)

### Phase 1: Deploy Main Site (5 min)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Main site - SowwanPay Services"
git remote add origin https://github.com/YOU/sowwanpay-main.git
git push -u origin main

# 2. Deploy to Vercel
# - Import repository
# - Deploy
# - Done! Site live at sowwanpay.vercel.app
```

---

### Phase 2: Set Up MongoDB (5 min)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user
4. Allow access from anywhere (0.0.0.0/0)
5. Copy connection string
6. Save for later

**Detailed guide**: [MONGODB_RENDER_SETUP.md](MONGODB_RENDER_SETUP.md#-part-1-mongodb-setup)

---

### Phase 3: Create Backend Server (10 min)

```bash
# 1. Create new directory
mkdir sowwanpay-backend
cd sowwanpay-backend

# 2. Initialize project
npm init -y

# 3. Install dependencies
npm install express mongoose cors dotenv nodemailer @sendgrid/mail bcrypt jsonwebtoken

# 4. Copy all code from backend-server/BACKEND_CODE.md
# - Copy each file to correct location
# - Create .env with your credentials

# 5. Test locally
npm run dev
```

**All code here**: [backend-server/BACKEND_CODE.md](backend-server/BACKEND_CODE.md)

---

### Phase 4: Deploy Backend to Render (5 min)

```bash
# 1. Push backend to GitHub
git init
git add .
git commit -m "Backend server"
git remote add origin https://github.com/YOU/sowwanpay-backend.git
git push -u origin main

# 2. Deploy to Render
# - New Web Service
# - Connect repository
# - Add environment variables
# - Deploy
# - Get URL: sowwanpay-api.onrender.com
```

**Detailed guide**: [MONGODB_RENDER_SETUP.md](MONGODB_RENDER_SETUP.md#-part-3-deploy-to-render)

---

### Phase 5: Update Frontend (5 min)

```bash
# 1. Add environment variable
echo "VITE_API_URL=https://sowwanpay-api.onrender.com/api" > .env

# 2. Update in Vercel
# Settings → Environment Variables
# Key: VITE_API_URL
# Value: https://sowwanpay-api.onrender.com/api

# 3. Redeploy
git add .
git commit -m "Connected to backend"
git push
```

**Migration guide**: [MONGODB_MIGRATION.md](MONGODB_MIGRATION.md)

---

### Phase 6: Set Up Admin Panel (Optional - 15 min)

```bash
# Follow complete guide
```

**Setup guide**: [admin-project-setup/README.md](admin-project-setup/README.md)

---

## 📚 Complete Documentation

| Document | What It Covers | When To Read |
|----------|----------------|--------------|
| **[MONGODB_RENDER_SETUP.md](MONGODB_RENDER_SETUP.md)** | MongoDB + Render setup | Setting up backend |
| **[backend-server/BACKEND_CODE.md](backend-server/BACKEND_CODE.md)** | Complete server code | Creating backend |
| **[MONGODB_MIGRATION.md](MONGODB_MIGRATION.md)** | Frontend API integration | Connecting frontend to backend |
| **[admin-project-setup/README.md](admin-project-setup/README.md)** | Admin panel setup | Deploying admin separately |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System architecture | Understanding the system |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Main site deployment | Deploying to Vercel |
| **[ADMIN_GUIDE.md](ADMIN_GUIDE.md)** | Using admin panel | Admin usage |
| **[PROJECT_STATUS.md](PROJECT_STATUS.md)** | Current status | What's done/pending |

---

## 🔑 Required Accounts

1. **MongoDB Atlas** (Free tier)
   - Database storage
   - Sign up: [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Render** (Free tier)
   - Backend hosting
   - Sign up: [render.com](https://render.com)

3. **SendGrid** (Free tier)
   - Email notifications
   - Sign up: [sendgrid.com](https://sendgrid.com)

4. **Vercel** (Free tier)
   - Frontend hosting
   - Sign up: [vercel.com](https://vercel.com)

5. **GitHub** (Free)
   - Code repository
   - Sign up: [github.com](https://github.com)

---

## 💰 Cost Breakdown

### Development (Free)
- MongoDB Atlas M0: **$0/month**
- Render Free: **$0/month** (sleeps after 15 min)
- SendGrid Free: **$0/month** (100 emails/day)
- Vercel Hobby: **$0/month**

**Total**: $0/month

### Production (Recommended)
- MongoDB Atlas M10: **$57/month**
- Render Starter: **$7/month**
- SendGrid Essentials: **$15/month**
- Vercel Pro: **$20/month**

**Total**: ~$99/month

---

## 🎯 Deployment Checklist

### Main Site
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

### Backend
- [ ] MongoDB cluster created
- [ ] Database user created
- [ ] Connection string saved
- [ ] Backend code created
- [ ] Pushed to GitHub
- [ ] Deployed to Render
- [ ] Environment variables set
- [ ] API health check passes

### Email
- [ ] SendGrid account created
- [ ] Sender email verified
- [ ] API key generated
- [ ] Added to Render env vars
- [ ] Test email sent successfully

### Admin Panel (Optional)
- [ ] Admin project created
- [ ] Admin files copied
- [ ] Routes updated
- [ ] Deployed to Vercel
- [ ] Custom subdomain configured

### Testing
- [ ] Order creation works
- [ ] Custom requests submitted
- [ ] Emails received
- [ ] Admin login works
- [ ] Dashboard loads data
- [ ] Subscription management works

---

## 🔧 Environment Variables

### Backend (Render)
```env
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

### Frontend (Vercel)
```env
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

---

## 🧪 Testing Your Setup

### 1. Test Backend API

```bash
# Health check
curl https://sowwanpay-api.onrender.com/api/health

# Should return:
# {"status":"OK","message":"SowwanPay API is running","timestamp":"..."}
```

### 2. Test Frontend

1. Visit your Vercel URL
2. Browse services
3. Try payment flow
4. Submit custom request
5. Check email

### 3. Test Admin

1. Visit admin URL
2. Login with credentials
3. View dashboard
4. Check clients
5. Verify data from MongoDB

---

## 🔒 Security Checklist

- [ ] Changed admin password from default
- [ ] Generated strong JWT_SECRET
- [ ] MongoDB password is strong
- [ ] SendGrid API key is secret
- [ ] CORS restricted to your domains
- [ ] HTTPS enabled everywhere
- [ ] Environment variables not in git
- [ ] `.env` in `.gitignore`

---

## 🆘 Common Issues

### Backend won't start on Render

**Solution**:
- Check Render logs
- Verify MongoDB connection string
- Ensure all env vars are set
- Check `package.json` has `start` script

### MongoDB connection failed

**Solution**:
- Verify connection string
- Check username/password
- Ensure IP whitelist includes 0.0.0.0/0
- Test connection locally first

### Emails not sending

**Solution**:
- Verify SendGrid sender email
- Check API key is correct
- Ensure sender is verified
- Check spam folder

### Frontend can't reach API

**Solution**:
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is deployed and running
- Test API endpoint directly with curl

---

## 📞 Support

**Email**: sowwanpay@gmail.com

**Include in your message**:
- What you're trying to do
- Error messages (full text)
- Backend logs (if applicable)
- Steps you've already tried

---

## 🎉 Next Steps After Setup

Once everything is deployed:

1. **Test thoroughly** - Try all features
2. **Change passwords** - Use strong credentials
3. **Monitor usage** - Check MongoDB Atlas metrics
4. **Set up backups** - Enable MongoDB backups
5. **Add analytics** - Google Analytics integration
6. **Custom domain** - Configure your own domain
7. **SSL certificate** - Ensure HTTPS everywhere
8. **Security audit** - Review all endpoints

---

## ✅ You're Done!

You now have a complete, production-ready platform:

✅ Professional website for clients  
✅ Powerful admin panel for management  
✅ Robust backend with MongoDB  
✅ Email notifications via SendGrid  
✅ Secure authentication  
✅ Scalable architecture  

**Time to start serving clients!** 🚀

---

**Last Updated**: June 2026  
**Version**: 2.0 (MongoDB + Render)
