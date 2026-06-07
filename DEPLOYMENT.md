# Deployment Guide - Three-Deployment Architecture

## Overview

Your request mentioned needing **3 files** (Front, Back, Admin). Here's how to structure this for deployment:

## Architecture Options

### Option 1: Single Deployment (Current Setup)
**Recommended for initial deployment**

The current codebase contains everything in one app with routing:
- Client pages: `/`, `/services`, `/website-builder`, `/custom-request`
- Admin pages: `/admin`, `/admin/dashboard`, `/admin/clients`, `/admin/subscriptions`

**Deploy to Vercel:**
1. Push to GitHub
2. Import to Vercel
3. Deploy once - all features included

**Pros:**
- Simpler deployment
- Single domain
- Shared resources
- Easier maintenance

**Cons:**
- All features bundled together
- Cannot deploy admin separately

---

### Option 2: Separate Deployments (Recommended for Production)

Split into 3 separate projects:

#### 1. **Frontend (Client-Facing)**
**Domain**: `sowwanpay.com` or `app.sowwanpay.com`

**Files to include:**
```
src/app/
├── pages/
│   ├── Home.tsx
│   ├── Services.tsx
│   ├── WebsiteBuilder.tsx
│   ├── CustomRequest.tsx
│   └── PaymentSuccess.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── PayPalButton.tsx
└── App.tsx (routes for client pages only)
```

**Deployment:**
```bash
# In Vercel
Project Name: sowwanpay-frontend
Build Command: pnpm build
Output Directory: dist
```

---

#### 2. **Backend (API Server)**
**Domain**: `api.sowwanpay.com`

**Create a new Node.js/Express project:**
```javascript
// server.js
const express = require('express');
const app = express();

// API endpoints needed:
app.post('/api/orders', ...);           // Create order
app.get('/api/orders', ...);            // Get orders (admin)
app.post('/api/custom-requests', ...);  // Submit custom request
app.get('/api/custom-requests', ...);   // Get requests (admin)
app.post('/api/paypal-webhook', ...);   // PayPal webhooks
app.post('/api/login', ...);            // Admin login
app.get('/api/subscriptions', ...);     // Get subscriptions
app.patch('/api/subscriptions/:id', ...); // Update subscription
app.post('/api/send-email', ...);       // Send emails
```

**Database Schema (PostgreSQL/MongoDB):**
```sql
-- orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  service_id VARCHAR,
  service_name VARCHAR,
  amount DECIMAL,
  status VARCHAR,
  created_at TIMESTAMP
);

-- custom_requests table
CREATE TABLE custom_requests (
  id UUID PRIMARY KEY,
  name VARCHAR,
  email VARCHAR,
  phone VARCHAR,
  company VARCHAR,
  service_type VARCHAR,
  budget VARCHAR,
  timeline VARCHAR,
  description TEXT,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP
);

-- subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  billing_cycle VARCHAR,
  next_billing_date TIMESTAMP,
  status VARCHAR,
  created_at TIMESTAMP
);

-- admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY,
  username VARCHAR UNIQUE,
  password_hash VARCHAR,
  created_at TIMESTAMP
);
```

**Deployment:**
```bash
# In Vercel (or Railway/Heroku)
Project Name: sowwanpay-backend
```

**Environment Variables:**
```
DATABASE_URL=postgresql://...
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
JWT_SECRET=...
SMTP_HOST=...
SMTP_USER=...
SMTP_PASSWORD=...
EMAIL_TO=sowwanpay@gmail.com
```

---

#### 3. **Admin Panel**
**Domain**: `admin.sowwanpay.com`

**Files to include:**
```
src/app/
├── pages/
│   ├── AdminLogin.tsx
│   ├── AdminDashboard.tsx
│   ├── ClientManagement.tsx
│   └── SubscriptionManagement.tsx
├── components/
│   └── AdminNav.tsx
└── App.tsx (routes for admin pages only)
```

**Deployment:**
```bash
# In Vercel
Project Name: sowwanpay-admin
Build Command: pnpm build
Output Directory: dist
```

**Environment Variables:**
```
VITE_API_URL=https://api.sowwanpay.com
```

---

## Separation Steps

### Step 1: Create Backend Project

```bash
mkdir sowwanpay-backend
cd sowwanpay-backend
npm init -y
npm install express cors dotenv pg bcrypt jsonwebtoken paypal-rest-sdk nodemailer
```

**Example Backend Structure:**
```
sowwanpay-backend/
├── server.js
├── routes/
│   ├── orders.js
│   ├── requests.js
│   ├── subscriptions.js
│   └── auth.js
├── controllers/
│   ├── orderController.js
│   ├── requestController.js
│   └── authController.js
├── models/
│   ├── Order.js
│   ├── Request.js
│   └── Subscription.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── config/
│   ├── database.js
│   └── paypal.js
└── package.json
```

### Step 2: Split Frontend

**Create separate repositories:**

1. **sowwanpay-frontend** (Client pages)
2. **sowwanpay-admin** (Admin pages)
3. **sowwanpay-backend** (API server)

### Step 3: Update API Calls

**In Frontend & Admin, replace localStorage with API calls:**

```typescript
// Old (current demo):
localStorage.setItem('orders', JSON.stringify(orders));

// New (production):
await fetch('https://api.sowwanpay.com/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

### Step 4: Deploy Each Project

```bash
# Frontend
cd sowwanpay-frontend
git init
git add .
git commit -m "Frontend"
git push origin main
# Deploy to Vercel → sowwanpay.com

# Backend
cd ../sowwanpay-backend
git init
git add .
git commit -m "Backend API"
git push origin main
# Deploy to Vercel/Railway → api.sowwanpay.com

# Admin
cd ../sowwanpay-admin
git init
git add .
git commit -m "Admin panel"
git push origin main
# Deploy to Vercel → admin.sowwanpay.com
```

---

## Quick Start (Single Deployment)

**For immediate deployment of current code:**

```bash
# 1. Create GitHub repo
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/sowwanpay.git
git push -u origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Deploy

# Done! You'll have:
# - Client pages at: yourapp.vercel.app/
# - Admin at: yourapp.vercel.app/admin
```

---

## Domain Configuration

**After deployment, configure custom domains in Vercel:**

### Single Domain:
- `sowwanpay.com` → Frontend + Admin

### Multiple Domains:
- `sowwanpay.com` → Frontend
- `admin.sowwanpay.com` → Admin panel
- `api.sowwanpay.com` → Backend API

**DNS Settings (in your domain registrar):**
```
Type    Name    Value
A       @       76.76.21.21 (Vercel IP)
CNAME   admin   cname.vercel-dns.com
CNAME   api     cname.vercel-dns.com
```

---

## Security Checklist for Production

- [ ] Move from localStorage to database
- [ ] Implement proper authentication (JWT)
- [ ] Add HTTPS everywhere
- [ ] Hash passwords with bcrypt
- [ ] Validate all inputs server-side
- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Set up PayPal webhooks
- [ ] Configure CORS properly
- [ ] Add request logging
- [ ] Set up error monitoring (Sentry)
- [ ] Implement email notifications
- [ ] Add backup system
- [ ] Set up SSL certificates

---

## Next Steps

1. **Immediate**: Deploy current code as-is to Vercel (single deployment)
2. **Week 1**: Set up backend API with database
3. **Week 2**: Implement real PayPal integration
4. **Week 3**: Add email notifications
5. **Week 4**: Split into 3 separate deployments
6. **Week 5**: Connect custom domains
7. **Week 6**: Security audit and testing

---

## Support

For implementation assistance:
- Email: sowwanpay@gmail.com
- Include: "Production Deployment" in subject line
