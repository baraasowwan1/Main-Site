# SowwanPay Services - Complete Web Platform

**🎯 NEW? START HERE:** [START_HERE.md](START_HERE.md) - Your personalized quick setup guide!

**✅ MongoDB Connected!** Your database is ready to use.

---

A comprehensive web platform for digital marketing and web development services with client portal, website builder, and admin dashboard.

## 🚀 Features

### Client-Facing Features
- **Service Showcase**: Display of all available services (Social Media, SEO, Visual Identity, Website Development)
- **PayPal Integration**: Secure payment processing for service purchases
- **Website Builder**: Interactive drag-and-drop website builder for clients
  - Multiple page management
  - Custom sections (Hero, Text, Contact)
  - Custom domain connection settings
  - Real-time preview
- **Custom Request Form**: Detailed form for custom website requirements
  - Automatically sends requests to sowwanpay@gmail.com (in production)

### Admin Panel Features
- **Dashboard**: Complete overview with statistics and metrics
  - Total revenue tracking
  - Client count
  - Active subscriptions
  - Pending requests
- **Client Management**: View and manage all clients
  - Search and filter functionality
  - Detailed client information
  - Direct email contact
- **Subscription Management**: Track recurring subscriptions
  - Active/Pending/Cancelled status tracking
  - Monthly revenue calculations
  - Next billing date tracking
  - Subscription status updates

## 📁 Project Structure

### Main Client Website (This Codebase)

```
src/
├── app/
│   ├── App.tsx                    # Main routing component (client routes only)
│   ├── components/
│   │   ├── Navbar.tsx             # Client-facing navigation
│   │   ├── Footer.tsx             # Footer component
│   │   └── PayPalButton.tsx       # PayPal payment integration
│   └── pages/
│       ├── Home.tsx               # Landing page
│       ├── Services.tsx           # Services listing with payments
│       ├── WebsiteBuilder.tsx     # Interactive website builder
│       ├── CustomRequest.tsx      # Custom website request form
│       └── PaymentSuccess.tsx     # Payment confirmation page
└── styles/
    └── globals.css                # Global styles
```

### Admin Panel (Separate Deployment)

The admin panel is deployed separately. See **admin-project-setup/** directory for setup instructions.

Admin includes:
- Admin Login
- Dashboard with metrics
- Client Management
- Subscription Management

**Setup Guide**: [admin-project-setup/README.md](admin-project-setup/README.md)

## 🎯 Services Offered

1. **Social Media Management** - $299/month
   - Daily content posting
   - Community management
   - Ad campaigns
   - Analytics reports

2. **SEO & Google Services** - $399/month
   - SEO optimization
   - Google Ads management
   - Google My Business setup
   - Google Maps verification

3. **Visual Identity Design** - $599 one-time
   - Logo design
   - Brand style guide
   - Business card design
   - Social media graphics

4. **Custom Website Development** - Starting at $999
   - Custom design
   - Responsive development
   - SEO-friendly structure
   - 3 months support

## 🔐 Admin Access

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

**Admin Routes:**
- `/admin` - Login page
- `/admin/dashboard` - Overview dashboard
- `/admin/clients` - Client management
- `/admin/subscriptions` - Subscription tracking

## 💾 Data Storage

### ✅ Supabase Connected!

Your project is now connected to Supabase for backend functionality. You can:
- Use the KV store for data persistence
- Create custom database tables
- Implement API endpoints
- Add real authentication

**See SUPABASE_BACKEND.md** for complete implementation guide.

### Current Demo Mode

Currently uses **localStorage** for demo purposes. Data includes:
- `orders` - Service purchases
- `customRequests` - Custom website requests
- `websiteBuilderPages` - Website builder data
- `websiteName` - Site name setting
- `customDomain` - Domain configuration
- `adminAuth` - Admin authentication token

**To migrate to Supabase**: Follow the step-by-step guide in SUPABASE_BACKEND.md

## 🚀 Deployment Guide

### For Vercel Deployment:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sowwanpay-services.git
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Click "Deploy"

3. **Environment Variables (for production):**
   Add these in Vercel project settings:
   - `VITE_PAYPAL_CLIENT_ID` - Your PayPal Client ID
   - `VITE_ADMIN_USERNAME` - Admin username
   - `VITE_ADMIN_PASSWORD_HASH` - Hashed admin password

## ⚠️ Important Production Requirements

This is a **DEMONSTRATION** build. For production deployment, you MUST implement:

### 1. Backend Infrastructure
- Real database (PostgreSQL, MongoDB, etc.)
- Authentication system (JWT, OAuth)
- API endpoints for data management
- Server-side validation

### 2. PayPal Integration
Currently uses client-side demo. Production requires:
- PayPal Business account
- Server-side order creation
- Webhook verification
- Payment capture on server
- Subscription API integration

```javascript
// Example server-side PayPal integration needed:
// POST /api/orders
// POST /api/subscriptions
// POST /api/paypal-webhook
```

### 3. Email Integration
Currently simulated. Production requires:
- SMTP service (SendGrid, AWS SES, etc.)
- Email templates
- Automated notifications
- Custom request forwarding to sowwanpay@gmail.com

### 4. Security Requirements
- HTTPS only
- CSRF protection
- XSS prevention
- SQL injection prevention
- Rate limiting
- Password hashing (bcrypt)
- Session management
- PCI compliance for payments

### 5. Domain Connection
Website builder custom domain feature requires:
- DNS management API
- SSL certificate provisioning
- Subdomain routing
- CDN integration

## 🔧 Local Development

```bash
# Install dependencies
pnpm install

# Start development server
# Note: Dev server runs automatically in this environment

# Build for production
pnpm build
```

## 📝 Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## 🎨 Website Builder Features

The website builder allows clients to:
- Create unlimited pages
- Add/edit/delete content sections
- Live preview mode
- Custom site name
- Domain connection (production requires DNS setup)
- Responsive design

## 📊 Admin Dashboard Metrics

- **Total Revenue**: Sum of all completed orders
- **Total Clients**: Count of all orders and requests
- **Active Subscriptions**: Monthly recurring services
- **Pending Requests**: Unprocessed custom requests

## 🔄 Data Flow

```
Client Purchase Flow:
1. Browse services → 2. Select service → 3. Click PayPal → 4. Process payment → 5. Store order → 6. Success page

Custom Request Flow:
1. Fill form → 2. Submit → 3. Store in localStorage → 4. (Production: Email to sowwanpay@gmail.com)

Admin Flow:
1. Login → 2. View dashboard → 3. Manage clients → 4. Track subscriptions
```

## 📧 Contact

For production deployment assistance or custom development:
- Email: sowwanpay@gmail.com

## ⚖️ License

Private project - All rights reserved © 2026 SowwanPay Services

---

**Note**: This is a demonstration build. Do not use in production without implementing proper backend infrastructure, security measures, and payment processing as outlined above.
