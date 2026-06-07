# Migration Guide: localStorage → Supabase

## Overview

This guide walks you through migrating from the demo localStorage system to the production Supabase backend.

---

## 🎯 Migration Strategy

**Option 1: Gradual Migration** (Recommended)
- Migrate one feature at a time
- Test thoroughly between each step
- Keep localStorage as fallback initially

**Option 2: Complete Migration**
- Replace all localStorage at once
- Higher risk but faster deployment

---

## 📋 Step-by-Step Migration

### Step 1: Verify Supabase Connection

```bash
# Check if Supabase files exist
ls supabase/functions/server/
ls utils/supabase/

# Files you should see:
# - supabase/functions/server/kv_store.tsx
# - supabase/functions/server/index.tsx
# - utils/supabase/info.tsx
```

If files don't exist yet, they'll be created when you first use the Supabase integration.

---

### Step 2: Implement Backend API

Follow **SUPABASE_BACKEND.md** to:
1. Create API endpoints in `supabase/functions/server/index.tsx`
2. Test endpoints locally
3. Deploy the edge function

---

### Step 3: Create API Service Layer

Create a new file to centralize API calls:

**Create `/src/app/services/api.ts`:**

```typescript
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-cb704a1c`;

async function apiCall(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// Orders API
export const ordersApi = {
  create: async (orderData: any) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },
  
  getAll: async () => {
    return apiCall('/orders');
  }
};

// Custom Requests API
export const requestsApi = {
  create: async (requestData: any) => {
    return apiCall('/custom-requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },
  
  getAll: async () => {
    return apiCall('/custom-requests');
  }
};

// Subscriptions API
export const subscriptionsApi = {
  getAll: async () => {
    return apiCall('/subscriptions');
  },
  
  update: async (id: string, status: string) => {
    return apiCall(`/subscriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// Admin API
export const adminApi = {
  login: async (username: string, password: string) => {
    return apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  }
};

// Website Builder API
export const websiteApi = {
  save: async (data: any) => {
    return apiCall('/website-builder/pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  get: async (clientId: string) => {
    return apiCall(`/website-builder/pages/${clientId}`);
  }
};
```

---

### Step 4: Migrate PayPal Button

**Before (localStorage):**

```typescript
// src/app/components/PayPalButton.tsx
const handlePayment = () => {
  const orderData = { /* ... */ };
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  existingOrders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(existingOrders));
};
```

**After (Supabase API):**

```typescript
// src/app/components/PayPalButton.tsx
import { ordersApi } from '../services/api';

const handlePayment = async () => {
  try {
    const orderData = {
      orderId: 'DEMO_' + Date.now(),
      service: serviceName,
      serviceId: serviceId,
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed'
    };

    const result = await ordersApi.create(orderData);
    navigate('/payment-success');
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};
```

---

### Step 5: Migrate Custom Request Form

**Before:**

```typescript
// src/app/pages/CustomRequest.tsx
const handleSubmit = async (e: React.FormEvent) => {
  const request = { /* ... */ };
  const existingRequests = JSON.parse(localStorage.getItem('customRequests') || '[]');
  existingRequests.push(request);
  localStorage.setItem('customRequests', JSON.stringify(existingRequests));
};
```

**After:**

```typescript
// src/app/pages/CustomRequest.tsx
import { requestsApi } from '../services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const result = await requestsApi.create(formData);
    setIsSubmitted(true);
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit request. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

### Step 6: Migrate Admin Dashboard

**Before:**

```typescript
// src/app/pages/AdminDashboard.tsx
useEffect(() => {
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');
  const requests = JSON.parse(localStorage.getItem('customRequests') || '[]');
  // ...
}, []);
```

**After:**

```typescript
// src/app/pages/AdminDashboard.tsx
import { ordersApi, requestsApi } from '../services/api';

useEffect(() => {
  async function loadData() {
    try {
      const [ordersData, requestsData] = await Promise.all([
        ordersApi.getAll(),
        requestsApi.getAll()
      ]);

      const orders = ordersData.orders || [];
      const requests = requestsData.requests || [];
      
      // Calculate stats...
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  loadData();
}, []);
```

---

### Step 7: Migrate Admin Login

**Before:**

```typescript
// src/app/pages/AdminLogin.tsx
const handleLogin = async (e: React.FormEvent) => {
  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('adminAuth', 'demo_token_' + Date.now());
    navigate('/admin/dashboard');
  }
};
```

**After:**

```typescript
// src/app/pages/AdminLogin.tsx
import { adminApi } from '../services/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const result = await adminApi.login(username, password);
    
    if (result.success) {
      localStorage.setItem('adminAuth', result.token);
      navigate('/admin/dashboard');
    }
  } catch (error) {
    setError('Invalid username or password');
  } finally {
    setIsLoading(false);
  }
};
```

---

### Step 8: Migrate Website Builder

**Before:**

```typescript
// src/app/pages/WebsiteBuilder.tsx
const savePages = (updatedPages: Page[]) => {
  localStorage.setItem('websiteBuilderPages', JSON.stringify(updatedPages));
};
```

**After:**

```typescript
// src/app/pages/WebsiteBuilder.tsx
import { websiteApi } from '../services/api';

const savePages = async (updatedPages: Page[]) => {
  try {
    await websiteApi.save({
      pages: updatedPages,
      siteName,
      customDomain
    });
    setPages(updatedPages);
  } catch (error) {
    console.error('Error saving pages:', error);
    alert('Failed to save changes');
  }
};

// Load pages on mount
useEffect(() => {
  async function loadPages() {
    try {
      const clientId = localStorage.getItem('clientId'); // Or from auth
      if (clientId) {
        const data = await websiteApi.get(clientId);
        setPages(data.website.pages);
        setSiteName(data.website.siteName);
        setCustomDomain(data.website.customDomain);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
    }
  }

  loadPages();
}, []);
```

---

### Step 9: Migrate Subscription Management

**Before:**

```typescript
// src/app/pages/SubscriptionManagement.tsx
const updateSubscriptionStatus = (id: string, newStatus: string) => {
  const updatedSubs = subscriptions.map(sub =>
    sub.id === id ? { ...sub, status: newStatus } : sub
  );
  setSubscriptions(updatedSubs);
};
```

**After:**

```typescript
// src/app/pages/SubscriptionManagement.tsx
import { subscriptionsApi } from '../services/api';

const updateSubscriptionStatus = async (id: string, newStatus: string) => {
  try {
    await subscriptionsApi.update(id, newStatus);
    
    // Refresh data
    const data = await subscriptionsApi.getAll();
    setSubscriptions(data.subscriptions || []);
  } catch (error) {
    console.error('Error updating subscription:', error);
    alert('Failed to update subscription');
  }
};
```

---

## 🧪 Testing Your Migration

### Test Checklist

1. **Test Orders Flow:**
   ```bash
   # 1. Go to /services
   # 2. Click "Purchase Now"
   # 3. Complete payment
   # 4. Check admin dashboard
   # 5. Verify order appears
   ```

2. **Test Custom Requests:**
   ```bash
   # 1. Go to /custom-request
   # 2. Fill and submit form
   # 3. Check admin clients page
   # 4. Verify request appears
   # 5. Check email was sent (production)
   ```

3. **Test Admin:**
   ```bash
   # 1. Login to /admin
   # 2. View dashboard stats
   # 3. Check clients page
   # 4. Verify subscriptions page
   ```

4. **Test Website Builder:**
   ```bash
   # 1. Create new pages
   # 2. Add sections
   # 3. Save changes
   # 4. Refresh page
   # 5. Verify data persists
   ```

---

## 🔄 Rollback Plan

If something goes wrong, you can rollback:

**Option 1: Keep localStorage fallback**

```typescript
async function getData() {
  try {
    const apiData = await ordersApi.getAll();
    return apiData.orders;
  } catch (error) {
    // Fallback to localStorage
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
}
```

**Option 2: Feature flags**

```typescript
const USE_API = true; // Set to false to use localStorage

if (USE_API) {
  await ordersApi.create(orderData);
} else {
  localStorage.setItem('orders', ...);
}
```

---

## 📊 Migration Progress Tracker

- [ ] Backend API implemented
- [ ] API service layer created
- [ ] PayPal button migrated
- [ ] Custom request form migrated
- [ ] Admin login migrated
- [ ] Admin dashboard migrated
- [ ] Client management migrated
- [ ] Subscription management migrated
- [ ] Website builder migrated
- [ ] All features tested
- [ ] Edge function deployed
- [ ] Production testing complete

---

## 🚨 Common Issues

### Issue: "Failed to fetch"

**Solution:**
- Check if edge function is deployed
- Verify API_BASE URL is correct
- Check CORS settings in backend

### Issue: "Unauthorized"

**Solution:**
- Verify `publicAnonKey` is correct
- Check Authorization header
- For admin routes, verify auth token

### Issue: Data not persisting

**Solution:**
- Check edge function logs
- Verify KV store is working
- Check for errors in console

---

## ✅ Post-Migration

After successful migration:

1. **Remove localStorage code** - Clean up old code
2. **Update documentation** - Remove demo notices
3. **Monitor errors** - Set up error tracking
4. **Optimize queries** - Add caching if needed
5. **Set up backups** - Regular database backups

---

## 🆘 Need Help?

Email: sowwanpay@gmail.com

Include:
- Error messages
- Edge function logs
- Steps to reproduce issue

---

**Good luck with your migration!** 🚀
