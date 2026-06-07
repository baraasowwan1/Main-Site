# Creating Separate Admin Deployment

## Overview

The admin panel will be deployed as a completely separate application from the main client-facing website.

---

## 🏗️ Architecture

```
Main Site (sowwanpay.com)
├── Home
├── Services  
├── Website Builder
├── Custom Request
└── Payment Success

Admin Site (admin.sowwanpay.com)
├── Admin Login
├── Dashboard
├── Client Management
└── Subscription Management

Backend API (api.sowwanpay.com)
└── Shared by both sites
```

---

## 📁 File Structure for Separate Deployment

### Create Admin Project Directory

You'll need to create a separate project for the admin panel:

```
sowwanpay-admin/
├── src/
│   └── app/
│       ├── App.tsx
│       ├── pages/
│       │   ├── AdminLogin.tsx
│       │   ├── AdminDashboard.tsx
│       │   ├── ClientManagement.tsx
│       │   └── SubscriptionManagement.tsx
│       └── components/
│           └── AdminNav.tsx
├── package.json
├── vite.config.ts
└── index.html
```

---

## 🚀 Step-by-Step Setup

### Step 1: Create Admin Project

```bash
# Create new directory for admin
mkdir ../sowwanpay-admin
cd ../sowwanpay-admin

# Initialize new project
npm init -y

# Install dependencies
pnpm add react react-dom react-router-dom lucide-react
pnpm add -D @vitejs/plugin-react vite typescript @types/react @types/react-dom
pnpm add tailwindcss @tailwindcss/vite
```

### Step 2: Copy Admin Files

From the current project, copy these files to the admin project:

**Pages:**
- `src/app/pages/AdminLogin.tsx`
- `src/app/pages/AdminDashboard.tsx`
- `src/app/pages/ClientManagement.tsx`
- `src/app/pages/SubscriptionManagement.tsx`

**Components:**
- `src/app/components/AdminNav.tsx`

**Styles:**
- `src/styles/globals.css`
- `src/styles/theme.css` (if exists)

### Step 3: Create Admin App.tsx

```typescript
// sowwanpay-admin/src/app/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ClientManagement from './pages/ClientManagement';
import SubscriptionManagement from './pages/SubscriptionManagement';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/clients" element={<ClientManagement />} />
        <Route path="/subscriptions" element={<SubscriptionManagement />} />
      </Routes>
    </Router>
  );
}
```

### Step 4: Update Admin Login Route

Update the admin login to navigate to admin routes without `/admin` prefix:

```typescript
// In AdminLogin.tsx, change:
navigate('/admin/dashboard');

// To:
navigate('/dashboard');
```

### Step 5: Update AdminNav Links

```typescript
// In AdminNav.tsx, update paths:
const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clients' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' }
];

const handleLogout = () => {
  localStorage.removeItem('adminAuth');
  navigate('/login');
};
```

### Step 6: Update Other Admin Pages

In all admin pages (Dashboard, ClientManagement, SubscriptionManagement):

```typescript
// Change from:
navigate('/admin');
// To:
navigate('/login');
```

---

## 📝 Admin Project Files

### package.json

```json
{
  "name": "sowwanpay-admin",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "lucide-react": "^0.487.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.7.0",
    "@tailwindcss/vite": "^4.1.12",
    "tailwindcss": "^4.1.12",
    "typescript": "^5.0.0",
    "vite": "^6.3.5",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1"
  }
}
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SowwanPay Admin Panel</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### src/main.tsx

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 🌐 Main Site Updates

Update the main site to remove all admin references:

### Update Main App.tsx

```typescript
// Remove admin routes, keep only client-facing:
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/services" element={<Services />} />
  <Route path="/website-builder" element={<WebsiteBuilder />} />
  <Route path="/custom-request" element={<CustomRequest />} />
  <Route path="/payment-success" element={<PaymentSuccess />} />
</Routes>
```

### Update Navbar

Remove admin login button:

```typescript
// In Navbar.tsx, remove:
<Link to="/admin" className="bg-blue-600...">
  Admin Login
</Link>
```

### Update Footer

Remove admin login link:

```typescript
// In Footer.tsx, remove:
<li><a href="/admin">Admin Login</a></li>
```

---

## 🚀 Deployment

### Deploy Main Site

```bash
# In main project directory
git init
git add .
git commit -m "SowwanPay Main Site"
git remote add origin https://github.com/YOU/sowwanpay-main.git
git push -u origin main

# Deploy to Vercel
# Domain: sowwanpay.com or www.sowwanpay.com
```

### Deploy Admin Site

```bash
# In admin project directory
cd ../sowwanpay-admin
git init
git add .
git commit -m "SowwanPay Admin Panel"
git remote add origin https://github.com/YOU/sowwanpay-admin.git
git push -u origin main

# Deploy to Vercel
# Domain: admin.sowwanpay.com
```

---

## 🔗 Connecting Both Sites to Same Backend

Both sites will connect to the same Supabase backend:

### Environment Variables

**Main Site (.env):**
```
VITE_API_URL=https://YOUR_PROJECT.supabase.co/functions/v1/make-server-cb704a1c
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

**Admin Site (.env):**
```
VITE_API_URL=https://YOUR_PROJECT.supabase.co/functions/v1/make-server-cb704a1c
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Both use the same backend!

---

## 🔐 Security

### Admin Site Protection

Add extra security for admin site:

1. **IP Whitelist** (Vercel Pro):
   - Restrict admin site to specific IPs
   
2. **Password Protection** (Vercel):
   - Add Vercel password protection
   
3. **Two-Factor Auth**:
   - Implement 2FA in admin login

4. **Different Subdomain**:
   - admin.sowwanpay.com is less discoverable
   - Don't link to it from main site

---

## 📊 Final Structure

```
Repository 1: sowwanpay-main
├── Client website
├── Services pages
├── Website builder
└── Custom requests
→ Deployed to: sowwanpay.com

Repository 2: sowwanpay-admin  
├── Admin login
├── Dashboard
├── Client management
└── Subscriptions
→ Deployed to: admin.sowwanpay.com

Repository 3: sowwanpay-backend (future)
├── API endpoints
├── Database
└── Email service
→ Deployed to: api.sowwanpay.com (or Supabase edge functions)
```

---

## ✅ Benefits of Separation

1. **Security**: Admin not discoverable from main site
2. **Performance**: Smaller bundles for each site
3. **Scalability**: Can scale independently
4. **Maintenance**: Easier to update separately
5. **Access Control**: Can restrict admin domain

---

## 🎯 Next Steps

1. Create `sowwanpay-admin` directory
2. Set up admin project structure
3. Copy admin files from main project
4. Update routes (remove `/admin` prefix)
5. Remove admin from main site
6. Deploy both separately
7. Configure domains

---

## 🆘 Quick Command Reference

```bash
# Main Site
cd sowwanpay-main
git push
# Deploy to Vercel → sowwanpay.com

# Admin Site  
cd sowwanpay-admin
git push
# Deploy to Vercel → admin.sowwanpay.com
```

---

This gives you **complete separation** between client-facing and admin functionality!
