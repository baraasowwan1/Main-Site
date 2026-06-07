# System Architecture

## 🏗️ Three-Tier Deployment Architecture

Your SowwanPay Services platform uses a **three-tier architecture** with separate deployments for enhanced security and scalability.

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│   Main Website (sowwanpay.com)         │
│   - Landing page                        │
│   - Service showcase                    │
│   - Website builder                     │
│   - Custom requests                     │
│   - Payment flow                        │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  ↓
┌─────────────────────────────────────────┐
│   Backend API (Supabase)                │
│   - Order management                    │
│   - Client data                         │
│   - Subscriptions                       │
│   - Authentication                      │
│   - Email notifications                 │
└─────────────────┬───────────────────────┘
                  │
                  │ API Calls
                  ↑
┌─────────────────────────────────────────┐
│   Admin Panel (admin.sowwanpay.com)    │
│   - Secure login                        │
│   - Dashboard & metrics                 │
│   - Client management                   │
│   - Subscription tracking               │
└─────────────────────────────────────────┘
```

---

## 🌐 Deployment Structure

### 1. Main Website

**Repository**: `sowwanpay-main` (this codebase)  
**Domain**: `sowwanpay.com` or `www.sowwanpay.com`  
**Purpose**: Client-facing public website

**Pages**:
- `/` - Home/Landing page
- `/services` - Service packages with payments
- `/website-builder` - Interactive website builder
- `/custom-request` - Custom website request form
- `/payment-success` - Payment confirmation

**Technology Stack**:
- React 18 + TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

**Security**:
- Public access
- No admin links or references
- Client-side only
- PayPal integration (demo/production)

---

### 2. Admin Panel

**Repository**: `sowwanpay-admin` (separate project)  
**Domain**: `admin.sowwanpay.com`  
**Purpose**: Private management dashboard

**Pages**:
- `/login` - Admin authentication
- `/dashboard` - Metrics and overview
- `/clients` - Client management
- `/subscriptions` - Subscription tracking

**Technology Stack**:
- React 18 + TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Vite for build tooling

**Security**:
- Not linked from main site
- Separate domain/subdomain
- Authentication required
- Can add IP whitelist
- Optional Vercel password protection

**Setup**: See [admin-project-setup/README.md](admin-project-setup/README.md)

---

### 3. Backend API

**Platform**: Supabase (connected)  
**Domain**: `YOUR_PROJECT.supabase.co` or `api.sowwanpay.com`  
**Purpose**: Shared backend for both sites

**Features**:
- Database (PostgreSQL)
- Edge Functions (API endpoints)
- Authentication
- Storage (if needed)
- Real-time subscriptions

**API Endpoints** (when implemented):
- `/make-server-cb704a1c/orders` - Order management
- `/make-server-cb704a1c/custom-requests` - Custom requests
- `/make-server-cb704a1c/subscriptions` - Subscription tracking
- `/make-server-cb704a1c/admin/login` - Admin authentication
- `/make-server-cb704a1c/website-builder/pages` - Website data

**Implementation**: See [SUPABASE_BACKEND.md](SUPABASE_BACKEND.md)

---

## 🔄 Data Flow

### Client Purchase Flow

```
1. Client visits sowwanpay.com
   ↓
2. Browse services
   ↓
3. Click "Purchase"
   ↓
4. PayPal payment (client-side)
   ↓
5. API call to create order → Supabase
   ↓
6. Order stored in database
   ↓
7. Redirect to /payment-success
```

### Admin Management Flow

```
1. Admin visits admin.sowwanpay.com
   ↓
2. Login with credentials
   ↓
3. API call to verify → Supabase
   ↓
4. View dashboard (fetch data from Supabase)
   ↓
5. Manage clients/subscriptions
   ↓
6. API calls to update data → Supabase
```

### Custom Request Flow

```
1. Client fills form on sowwanpay.com/custom-request
   ↓
2. Submit form
   ↓
3. API call to create request → Supabase
   ↓
4. Request stored in database
   ↓
5. Email notification sent to sowwanpay@gmail.com
   ↓
6. Admin sees request in admin.sowwanpay.com/clients
```

---

## 🔐 Security Architecture

### Main Site (Public)
- ✅ Public access allowed
- ✅ HTTPS required
- ✅ No admin routes
- ✅ No sensitive data exposed
- ✅ CSRF protection
- ✅ Input validation

### Admin Site (Private)
- ✅ Separate subdomain
- ✅ Authentication required
- ✅ No public links to admin
- ✅ HTTPS required
- ✅ Optional IP whitelist
- ✅ Optional password protection
- ✅ Session management
- ✅ Logout functionality

### Backend (Protected)
- ✅ API authentication
- ✅ Row Level Security (RLS)
- ✅ Service role key (server-side only)
- ✅ Anon key (client-side)
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention

---

## 📦 Shared Resources

Both sites share:

1. **Backend API** - Same Supabase project
2. **Database** - Same PostgreSQL database
3. **Storage** - Same Supabase storage buckets
4. **Authentication** - Shared auth system
5. **Email Service** - Same SMTP configuration

This ensures:
- Data consistency
- Single source of truth
- Easier maintenance
- Cost efficiency

---

## 🚀 Deployment Strategy

### Current Status

✅ **Main Site**: Ready to deploy  
⏳ **Admin Site**: Setup guide provided  
⏳ **Backend**: Implementation guide provided

### Deployment Order

1. **Deploy Main Site First**
   ```bash
   git push origin main
   # Deploy to Vercel → sowwanpay.com
   ```

2. **Set Up Admin Site**
   ```bash
   # Follow admin-project-setup/README.md
   # Deploy to Vercel → admin.sowwanpay.com
   ```

3. **Implement Backend**
   ```bash
   # Follow SUPABASE_BACKEND.md
   # Deploy edge functions to Supabase
   ```

4. **Migrate to API**
   ```bash
   # Follow MIGRATION_GUIDE.md
   # Update both sites to use backend API
   ```

---

## 🌍 Domain Configuration

### DNS Setup

```
Type    Name    Value                           TTL
A       @       76.76.21.21                     Auto
CNAME   www     cname.vercel-dns.com            Auto
CNAME   admin   cname.vercel-dns.com            Auto
CNAME   api     YOUR_PROJECT.supabase.co        Auto
```

### SSL Certificates

Both Vercel and Supabase provide automatic SSL certificates:
- ✅ Main site: Auto SSL
- ✅ Admin site: Auto SSL
- ✅ Backend API: Auto SSL

---

## 📊 Scalability

### Horizontal Scaling

Each tier can scale independently:

**Main Site**:
- Vercel auto-scales
- CDN distribution
- Edge caching

**Admin Site**:
- Vercel auto-scales
- Lower traffic expected
- Can be smaller instance

**Backend**:
- Supabase auto-scales
- Connection pooling
- Read replicas (production)

---

## 💰 Cost Structure

### Development (Current)

- Main Site: **Free** (Vercel Hobby)
- Admin Site: **Free** (Vercel Hobby)
- Backend: **Free** (Supabase Free Tier)

**Total**: $0/month

### Production (Recommended)

- Main Site: **$20/month** (Vercel Pro)
- Admin Site: **$0** (Vercel Hobby - low traffic)
- Backend: **$25/month** (Supabase Pro)
- Email Service: **$15/month** (SendGrid Essentials)

**Total**: ~$60/month

### Enterprise (High Traffic)

- Main Site: **$150/month** (Vercel Enterprise)
- Admin Site: **$20/month** (Vercel Pro)
- Backend: **$599/month** (Supabase Team)
- Email Service: **$90/month** (SendGrid Pro)

**Total**: ~$859/month

---

## 🎯 Benefits of This Architecture

### Security
- ✅ Admin completely separate
- ✅ Admin not discoverable from main site
- ✅ Different authentication domains
- ✅ Can IP-restrict admin

### Performance
- ✅ Smaller bundle sizes (split apps)
- ✅ Faster load times
- ✅ Independent caching
- ✅ Optimized for each use case

### Maintenance
- ✅ Update each independently
- ✅ Deploy without affecting other
- ✅ Easier to debug
- ✅ Clear separation of concerns

### Scalability
- ✅ Scale each tier independently
- ✅ Different resource allocation
- ✅ Optimized for traffic patterns
- ✅ Cost-effective scaling

---

## 📝 Summary

Your platform uses a **modern three-tier architecture**:

1. **Main Site** (Public) - Client-facing features
2. **Admin Panel** (Private) - Management dashboard
3. **Backend API** (Shared) - Data and business logic

This separation provides:
- Enhanced security
- Better performance
- Easier maintenance
- Independent scalability

---

**Next Steps**:
1. Deploy main site: [DEPLOYMENT.md](DEPLOYMENT.md)
2. Set up admin: [admin-project-setup/README.md](admin-project-setup/README.md)
3. Implement backend: [SUPABASE_BACKEND.md](SUPABASE_BACKEND.md)
