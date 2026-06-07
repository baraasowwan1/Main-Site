# Supabase Backend Implementation Guide

## ✅ Supabase Connected!

Your Supabase project is now connected. This guide will help you implement the complete backend to replace the demo localStorage system.

---

## 📁 Expected Supabase Files

After connection, these files should be available:

```
supabase/
└── functions/
    └── server/
        ├── kv_store.tsx      # Auto-generated KV store utilities
        └── index.tsx         # Server entry point (you'll edit this)

utils/
└── supabase/
    └── info.tsx             # Auto-generated: projectId and publicAnonKey
```

If these files aren't visible yet, they may be generated on first use or after a refresh.

---

## 🗄️ Database Setup

### Step 1: Create Database Tables

You'll use the existing `kv_store` table plus custom tables for your specific needs.

**Option A: Use KV Store (Simpler)**
The pre-configured KV store can handle all data as JSON:

```typescript
// Store orders
await kv.set('order_12345', {
  service: 'Social Media Management',
  amount: 299,
  date: '2026-06-06',
  status: 'completed'
});

// Store custom requests
await kv.set('request_67890', {
  name: 'John Doe',
  email: 'john@example.com',
  serviceType: 'website',
  status: 'pending'
});

// Get all orders
const orders = await kv.getByPrefix('order_');
```

**Option B: Create Custom Tables (Recommended for Production)**

You'll need to create tables in your Supabase dashboard or via SQL:

```sql
-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Custom requests table
CREATE TABLE custom_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  service_type TEXT NOT NULL,
  budget TEXT,
  timeline TEXT,
  description TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT REFERENCES orders(order_id),
  billing_cycle TEXT DEFAULT 'monthly',
  next_billing_date TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Website builder data
CREATE TABLE website_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id TEXT NOT NULL,
  client_id TEXT,
  page_name TEXT NOT NULL,
  page_path TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_requests_status ON custom_requests(status);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

## 🔧 Backend Server Implementation

### Edit `supabase/functions/server/index.tsx`

```typescript
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ============================================
// ORDERS ENDPOINTS
// ============================================

// Create order (called after PayPal payment)
app.post('/make-server-cb704a1c/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, service, serviceId, amount } = body;

    // Store in KV or database
    await kv.set(`order_${orderId}`, {
      orderId,
      service,
      serviceId,
      amount,
      date: new Date().toISOString(),
      status: 'completed'
    });

    // If subscription service, create subscription record
    if (serviceId === 'social-media' || serviceId === 'seo-google') {
      const nextBilling = new Date();
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      await kv.set(`subscription_${orderId}`, {
        orderId,
        billingCycle: 'monthly',
        nextBillingDate: nextBilling.toISOString(),
        status: 'active'
      });
    }

    return c.json({ success: true, orderId });
  } catch (error) {
    console.log('Error creating order:', error);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

// Get all orders (admin only)
app.get('/make-server-cb704a1c/orders', async (c) => {
  try {
    const orders = await kv.getByPrefix('order_');
    return c.json({ orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders' }, 500);
  }
});

// ============================================
// CUSTOM REQUESTS ENDPOINTS
// ============================================

// Submit custom request
app.post('/make-server-cb704a1c/custom-requests', async (c) => {
  try {
    const body = await c.req.json();
    const requestId = 'REQ_' + Date.now();

    const requestData = {
      id: requestId,
      ...body,
      date: new Date().toISOString(),
      status: 'pending'
    };

    await kv.set(`request_${requestId}`, requestData);

    // Send email notification
    await sendEmailNotification(requestData);

    return c.json({ success: true, requestId });
  } catch (error) {
    console.log('Error creating request:', error);
    return c.json({ error: 'Failed to create request' }, 500);
  }
});

// Get all custom requests (admin only)
app.get('/make-server-cb704a1c/custom-requests', async (c) => {
  try {
    const requests = await kv.getByPrefix('request_');
    return c.json({ requests });
  } catch (error) {
    console.log('Error fetching requests:', error);
    return c.json({ error: 'Failed to fetch requests' }, 500);
  }
});

// ============================================
// SUBSCRIPTIONS ENDPOINTS
// ============================================

// Get all subscriptions
app.get('/make-server-cb704a1c/subscriptions', async (c) => {
  try {
    const subscriptions = await kv.getByPrefix('subscription_');
    return c.json({ subscriptions });
  } catch (error) {
    console.log('Error fetching subscriptions:', error);
    return c.json({ error: 'Failed to fetch subscriptions' }, 500);
  }
});

// Update subscription status
app.patch('/make-server-cb704a1c/subscriptions/:id', async (c) => {
  try {
    const { id } = c.req.param();
    const { status } = await c.req.json();

    const subscription = await kv.get(`subscription_${id}`);
    if (!subscription) {
      return c.json({ error: 'Subscription not found' }, 404);
    }

    await kv.set(`subscription_${id}`, {
      ...subscription,
      status
    });

    return c.json({ success: true });
  } catch (error) {
    console.log('Error updating subscription:', error);
    return c.json({ error: 'Failed to update subscription' }, 500);
  }
});

// ============================================
// ADMIN AUTH
// ============================================

// Admin login
app.post('/make-server-cb704a1c/admin/login', async (c) => {
  try {
    const { username, password } = await c.req.json();

    // In production, use bcrypt to verify password
    if (username === 'admin' && password === 'admin123') {
      // Generate a simple token (in production, use JWT)
      const token = 'admin_token_' + Date.now();
      
      return c.json({ 
        success: true, 
        token,
        user: { username }
      });
    }

    return c.json({ error: 'Invalid credentials' }, 401);
  } catch (error) {
    console.log('Error during login:', error);
    return c.json({ error: 'Login failed' }, 500);
  }
});

// ============================================
// WEBSITE BUILDER ENDPOINTS
// ============================================

// Save website pages
app.post('/make-server-cb704a1c/website-builder/pages', async (c) => {
  try {
    const { pages, siteName, customDomain } = await c.req.json();
    const clientId = 'client_' + Date.now(); // In production, use authenticated user ID

    await kv.set(`website_${clientId}`, {
      pages,
      siteName,
      customDomain,
      updatedAt: new Date().toISOString()
    });

    return c.json({ success: true, clientId });
  } catch (error) {
    console.log('Error saving website:', error);
    return c.json({ error: 'Failed to save website' }, 500);
  }
});

// Get website pages
app.get('/make-server-cb704a1c/website-builder/pages/:clientId', async (c) => {
  try {
    const { clientId } = c.req.param();
    const website = await kv.get(`website_${clientId}`);

    if (!website) {
      return c.json({ error: 'Website not found' }, 404);
    }

    return c.json({ website });
  } catch (error) {
    console.log('Error fetching website:', error);
    return c.json({ error: 'Failed to fetch website' }, 500);
  }
});

// ============================================
// EMAIL NOTIFICATIONS
// ============================================

async function sendEmailNotification(requestData: any) {
  // In production, use SendGrid, AWS SES, or similar
  console.log('Email would be sent to: sowwanpay@gmail.com');
  console.log('Request data:', requestData);
  
  // Example with fetch to an email service:
  // await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{
  //       to: [{ email: 'sowwanpay@gmail.com' }]
  //     }],
  //     from: { email: 'noreply@sowwanpay.com' },
  //     subject: `New Custom Request from ${requestData.name}`,
  //     content: [{
  //       type: 'text/html',
  //       value: `<html>...</html>`
  //     }]
  //   })
  // });
}

// Start server
Deno.serve(app.fetch);
```

---

## 🔐 Environment Variables

Add these in your Supabase project dashboard:

```
SENDGRID_API_KEY=your_sendgrid_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

---

## 🎨 Frontend Updates

Update your frontend to use the API instead of localStorage:

### Example: PayPalButton.tsx

```typescript
import { projectId, publicAnonKey } from '/utils/supabase/info';

const handlePayment = async () => {
  setIsLoading(true);

  try {
    const orderData = {
      orderId: 'ORDER_' + Date.now(),
      service: serviceName,
      serviceId: serviceId,
      amount: amount
    };

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-cb704a1c/orders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      }
    );

    if (response.ok) {
      navigate('/payment-success');
    } else {
      console.error('Payment failed');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🚀 Deployment

Once your backend is implemented:

1. **Test locally** - Make sure all endpoints work
2. **Deploy the edge function** - From Make settings page
3. **Update frontend** - Replace all localStorage calls with API calls
4. **Test end-to-end** - Complete payment flow, admin panel, etc.

---

## ✅ Migration Checklist

- [ ] Backend server implemented in `supabase/functions/server/index.tsx`
- [ ] All API endpoints tested
- [ ] Frontend updated to use API calls
- [ ] Email service configured
- [ ] Admin authentication working
- [ ] PayPal webhooks set up
- [ ] Database tables created (if using custom tables)
- [ ] Error handling added
- [ ] Logging configured
- [ ] Edge function deployed

---

## 📊 API Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/make-server-cb704a1c/orders` | POST | Create new order |
| `/make-server-cb704a1c/orders` | GET | Get all orders (admin) |
| `/make-server-cb704a1c/custom-requests` | POST | Submit custom request |
| `/make-server-cb704a1c/custom-requests` | GET | Get all requests (admin) |
| `/make-server-cb704a1c/subscriptions` | GET | Get all subscriptions |
| `/make-server-cb704a1c/subscriptions/:id` | PATCH | Update subscription |
| `/make-server-cb704a1c/admin/login` | POST | Admin authentication |
| `/make-server-cb704a1c/website-builder/pages` | POST | Save website |
| `/make-server-cb704a1c/website-builder/pages/:id` | GET | Get website |

---

## 🆘 Need Help?

- Check Supabase dashboard for errors
- View edge function logs
- Test endpoints with Postman/curl
- Email: sowwanpay@gmail.com

---

**Next Step**: Implement the backend server code in `supabase/functions/server/index.tsx` and start migrating from localStorage to the API!
