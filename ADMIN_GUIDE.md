# Admin Guide - SowwanPay Services Platform

## Quick Start

### Accessing the Admin Panel

1. Navigate to `/admin` on your deployed site
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. Click "Sign In"

**⚠️ Important**: Change these credentials in production!

---

## Dashboard Overview

After logging in, you'll see the main dashboard with:

### Key Metrics
- **Total Revenue**: Sum of all completed orders
- **Total Clients**: Number of clients who purchased services
- **Active Subscriptions**: Recurring monthly services
- **Pending Requests**: Custom website requests waiting for review

### Recent Activity
- **Recent Orders**: Last 5 service purchases
- **Recent Custom Requests**: Last 5 custom website requests

---

## Managing Clients

**Location**: Admin Panel → Clients

### Features:
1. **Search**: Find clients by name, email, service, or order ID
2. **Filter**: View all clients, orders only, or requests only
3. **View Details**: Click "View" to see complete client information
4. **Contact**: Click email to send message directly

### Client Information Includes:
- Name and contact details
- Service purchased or requested
- Date of transaction
- Current status
- Amount paid (for orders) or budget (for requests)

### Actions:
- Send email to client
- View full order/request details
- Track client history

---

## Managing Subscriptions

**Location**: Admin Panel → Subscriptions

### Subscription Types:
Only these services are subscription-based:
- Social Media Management ($299/month)
- SEO & Google Services ($399/month)

**One-time purchases** (not subscriptions):
- Visual Identity Design
- Website Creation

### Features:

#### View Subscriptions
- Filter by: All, Active, Pending, Cancelled
- See next billing date
- Track monthly recurring revenue

#### Manage Status
- **Activate**: Restart a pending/cancelled subscription
- **Cancel**: Stop a subscription (won't be charged)

### Subscription Information:
- Subscription ID
- Service name
- Monthly amount
- Billing cycle
- Next billing date
- Current status

---

## Understanding Data

### Order Status:
- **Completed**: Payment received, order active
- **Pending**: Awaiting confirmation
- **Cancelled**: Order cancelled

### Request Status:
- **Pending**: Needs review
- **In Progress**: Being worked on
- **Completed**: Project delivered

---

## Common Tasks

### Task 1: Review New Custom Requests

1. Go to **Admin → Clients**
2. Click **Requests** filter
3. Review pending requests
4. Click **View** to see full details
5. Click client's email to discuss project
6. Update status as needed

**In Production**: Requests automatically email to sowwanpay@gmail.com

---

### Task 2: Track Monthly Revenue

1. Go to **Admin → Subscriptions**
2. View **Monthly Revenue** card (top right)
3. Check number of **Active** subscriptions
4. Review next billing dates

---

### Task 3: Contact a Client

**Method 1 - From Client Management:**
1. Go to **Admin → Clients**
2. Find the client
3. Click **View**
4. Click the email address
5. Your email client will open

**Method 2 - Direct:**
All requests in demo mode are stored locally. In production, you'll receive emails at `sowwanpay@gmail.com`

---

### Task 4: Manage Subscription Status

1. Go to **Admin → Subscriptions**
2. Find the subscription
3. Click **Cancel** to stop billing
4. Click **Activate** to restart billing

---

## Website Builder - Client Feature

Clients can build websites using the Website Builder:

### What Clients Can Do:
- Create multiple pages
- Add different sections:
  - Hero sections with custom colors
  - Text blocks
  - Contact forms
- Preview their site
- Configure custom domain (requires DNS setup)

### Admin Access to Client Websites:
Currently stored in browser localStorage. In production:
1. Store in database with client ID
2. Admin can view all client websites
3. Admin can help with domain connection

---

## Payment Tracking

### Current Setup (Demo):
- Payments stored in browser
- Orders tracked automatically
- Revenue calculated in real-time

### Production Setup Needed:
- PayPal webhook integration
- Database storage
- Email receipts
- Automated invoicing

---

## Email Notifications

### Current Behavior (Demo):
Custom website requests show confirmation but don't actually send email.

### Production Behavior:
When a client submits a custom request, you'll receive an email at `sowwanpay@gmail.com` with:
- Client name and contact info
- Project type
- Budget range
- Timeline
- Detailed description
- Additional notes

---

## Data Management

### Current Storage:
All data stored in browser's localStorage:
- `orders` - Service purchases
- `customRequests` - Website requests
- `adminAuth` - Admin session

### Production Requirements:
- PostgreSQL or MongoDB database
- Secure authentication
- Encrypted sensitive data
- Regular backups

---

## Security Best Practices

### Required for Production:

1. **Change Admin Password**
   - Use strong, unique password
   - Store securely
   - Consider 2FA

2. **Secure the Admin Panel**
   - HTTPS only
   - IP whitelist (optional)
   - Session timeout
   - Activity logging

3. **Protect Client Data**
   - Encrypt sensitive information
   - Secure database
   - Regular backups
   - GDPR compliance

---

## Troubleshooting

### Can't Login to Admin
- Check credentials: `admin` / `admin123`
- Clear browser cache
- Try incognito/private mode

### Can't See Orders/Clients
- Data stored in browser localStorage
- Clearing browser data will delete everything
- In production, use database

### Subscription Not Showing
- Only Social Media and SEO services are subscriptions
- One-time services (Visual Identity, Website) don't appear

---

## Quick Reference

### Admin Credentials (Demo)
```
Username: admin
Password: admin123
```

### Admin URLs
```
Login:         /admin
Dashboard:     /admin/dashboard
Clients:       /admin/clients
Subscriptions: /admin/subscriptions
```

### Client-Facing URLs
```
Home:           /
Services:       /services
Builder:        /website-builder
Custom Request: /custom-request
```

---

## Next Steps for Production

1. ✅ **Deploy to Vercel** - Follow DEPLOYMENT.md
2. ⏳ **Set up Backend** - Database + API
3. ⏳ **PayPal Integration** - Real payment processing
4. ⏳ **Email Service** - Automated notifications
5. ⏳ **Security Audit** - Protect client data
6. ⏳ **Custom Domain** - Connect your domain

---

## Support & Questions

**Email**: sowwanpay@gmail.com

**Common Questions**:
- "How do I deploy?" → See DEPLOYMENT.md
- "How do I get real payments?" → Set up PayPal webhooks (see README.md)
- "Where's the data stored?" → Currently localStorage, need database for production
- "How do I change admin password?" → Update in backend authentication system

---

**Last Updated**: June 2026  
**Version**: 1.0 (Demo)
