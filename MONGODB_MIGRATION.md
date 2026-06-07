# Frontend Migration: localStorage → MongoDB/Render API

Quick guide to migrate your frontend from localStorage demo to MongoDB + Render backend.

---

## ✅ Prerequisites

1. MongoDB cluster created (see MONGODB_RENDER_SETUP.md)
2. Backend server deployed to Render
3. Backend URL: `https://sowwanpay-api.onrender.com`

---

## 📝 Step 1: Add Environment Variable

### Main Site

Create `.env` file:
```bash
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

### Admin Site

Create `.env` file:
```bash
VITE_API_URL=https://sowwanpay-api.onrender.com/api
```

### In Vercel

Add environment variable:
- Key: `VITE_API_URL`
- Value: `https://sowwanpay-api.onrender.com/api`

---

## 🔧 Step 2: Use API Service Layer

The API service is already created at `src/app/services/api.ts`. Just import and use it!

### Example: Update PayPal Button

**Before (localStorage):**
```typescript
// src/app/components/PayPalButton.tsx
const handlePayment = () => {
  const orderData = { /* ... */ };
  const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
  existingOrders.push(orderData);
  localStorage.setItem('orders', JSON.stringify(existingOrders));
  navigate('/payment-success');
};
```

**After (API):**
```typescript
// src/app/components/PayPalButton.tsx
import { ordersApi } from '../services/api';

const handlePayment = async () => {
  try {
    const orderData = {
      orderId: 'DEMO_' + Date.now(),
      service: serviceName,
      serviceId: serviceId,
      amount: amount
    };

    await ordersApi.create(orderData);
    navigate('/payment-success');
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  }
};
```

---

## 📋 Step 3: Update Each Component

### Custom Request Form

**File**: `src/app/pages/CustomRequest.tsx`

```typescript
import { requestsApi } from '../services/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await requestsApi.create(formData);
    setIsSubmitted(true);
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit request. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};
```

### Admin Login

**File**: `src/app/pages/AdminLogin.tsx`

```typescript
import { adminApi } from '../services/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const result = await adminApi.login(username, password);
    
    if (result.success) {
      localStorage.setItem('adminAuth', result.token);
      navigate('/dashboard'); // or '/admin/dashboard' for main site
    }
  } catch (error: any) {
    setError(error.message || 'Invalid username or password');
  } finally {
    setIsLoading(false);
  }
};
```

### Admin Dashboard

**File**: `src/app/pages/AdminDashboard.tsx`

```typescript
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
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.amount), 0);
      const activeSubscriptions = orders.filter(o => 
        o.serviceId === 'social-media' || o.serviceId === 'seo-google'
      ).length;

      setStats({
        totalRevenue,
        totalClients: orders.length,
        activeSubscriptions,
        pendingRequests: requests.filter(r => r.status === 'pending').length
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentRequests(requests.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  loadData();
}, []);
```

### Client Management

**File**: `src/app/pages/ClientManagement.tsx`

```typescript
import { ordersApi, requestsApi } from '../services/api';

useEffect(() => {
  async function loadClients() {
    try {
      const [ordersData, requestsData] = await Promise.all([
        ordersApi.getAll(),
        requestsApi.getAll()
      ]);

      const orders = ordersData.orders || [];
      const requests = requestsData.requests || [];

      const allClients = [
        ...orders.map(order => ({
          id: order.orderId,
          service: order.service,
          amount: order.amount,
          date: order.createdAt,
          status: order.status,
          type: 'order' as const
        })),
        ...requests.map(request => ({
          id: request.requestId,
          name: request.name,
          email: request.email,
          phone: request.phone,
          service: request.serviceType,
          amount: request.budget,
          date: request.createdAt,
          status: request.status,
          type: 'request' as const
        }))
      ];

      allClients.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setClients(allClients);
      setFilteredClients(allClients);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  }

  loadClients();
}, []);
```

### Subscription Management

**File**: `src/app/pages/SubscriptionManagement.tsx`

```typescript
import { subscriptionsApi } from '../services/api';

useEffect(() => {
  async function loadSubscriptions() {
    try {
      const data = await subscriptionsApi.getAll();
      const subs = data.subscriptions || [];

      // Transform data
      const subscriptions = subs.map(sub => ({
        id: sub._id,
        orderId: sub.orderId,
        service: sub.order?.service || 'Unknown',
        serviceId: sub.order?.serviceId || '',
        amount: sub.order?.amount || '0',
        startDate: sub.createdAt,
        billingCycle: sub.billingCycle,
        nextBillingDate: sub.nextBillingDate,
        status: sub.status
      }));

      setSubscriptions(subscriptions);

      // Calculate stats
      const active = subscriptions.filter(s => s.status === 'active').length;
      const pending = subscriptions.filter(s => s.status === 'pending').length;
      const cancelled = subscriptions.filter(s => s.status === 'cancelled').length;
      const monthlyRevenue = subscriptions
        .filter(s => s.status === 'active')
        .reduce((sum, s) => sum + parseFloat(s.amount), 0);

      setStats({
        total: subscriptions.length,
        active,
        pending,
        cancelled,
        monthlyRevenue
      });
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  loadSubscriptions();
}, []);

// Update status function
const updateSubscriptionStatus = async (id: string, newStatus: string) => {
  try {
    await subscriptionsApi.update(id, newStatus);
    
    // Refresh data
    const data = await subscriptionsApi.getAll();
    // ... update state
  } catch (error) {
    console.error('Error updating subscription:', error);
    alert('Failed to update subscription');
  }
};
```

### Website Builder

**File**: `src/app/pages/WebsiteBuilder.tsx`

```typescript
import { websiteApi } from '../services/api';

// On component mount - load existing pages
useEffect(() => {
  async function loadPages() {
    try {
      const clientId = localStorage.getItem('builderClientId');
      if (clientId) {
        const data = await websiteApi.get(clientId);
        if (data.success && data.website) {
          setPages(data.website.pages);
          setSiteName(data.website.siteName);
          setCustomDomain(data.website.customDomain || '');
        }
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      // Start fresh if can't load
    }
  }

  loadPages();
}, []);

// Save pages function
const savePages = async (updatedPages: Page[]) => {
  try {
    const clientId = localStorage.getItem('builderClientId');
    
    const result = await websiteApi.save({
      clientId,
      pages: updatedPages,
      siteName,
      customDomain
    });

    if (result.success && result.clientId) {
      localStorage.setItem('builderClientId', result.clientId);
    }

    setPages(updatedPages);
  } catch (error) {
    console.error('Error saving pages:', error);
    alert('Failed to save changes');
  }
};
```

---

## 🧪 Step 4: Test the Integration

### Test Orders Flow

1. Go to `/services`
2. Click "Purchase Now"
3. Complete demo payment
4. Check admin dashboard
5. Verify order appears in MongoDB

### Test Custom Requests

1. Go to `/custom-request`
2. Fill and submit form
3. Check your email (sowwanpay@gmail.com)
4. Check admin → clients
5. Verify request appears

### Test Admin

1. Login at `/admin` (or `/login` for admin site)
2. View dashboard
3. Check clients page
4. Check subscriptions
5. Try updating subscription status

---

## 🔍 Debugging

### Check API Connection

```typescript
import { healthCheck } from './services/api';

// In any component
useEffect(() => {
  async function checkAPI() {
    try {
      const health = await healthCheck();
      console.log('API Status:', health);
    } catch (error) {
      console.error('API not reachable:', error);
    }
  }
  
  checkAPI();
}, []);
```

### Common Issues

**Issue**: "Failed to fetch"
- Check VITE_API_URL is set correctly
- Verify backend is running on Render
- Check CORS settings in backend

**Issue**: "Unauthorized" on admin routes
- Check admin credentials in backend `.env`
- Verify JWT_SECRET is set
- Check token is being sent in requests

**Issue**: Data not persisting
- Check MongoDB connection string
- Verify backend logs on Render
- Check database in MongoDB Atlas

---

## ✅ Migration Checklist

- [ ] Backend deployed to Render
- [ ] MongoDB cluster created
- [ ] Environment variables set
- [ ] `VITE_API_URL` added to frontend
- [ ] PayPal button updated
- [ ] Custom request form updated
- [ ] Admin login updated
- [ ] Admin dashboard updated
- [ ] Client management updated
- [ ] Subscription management updated
- [ ] Website builder updated
- [ ] All features tested
- [ ] Email notifications working

---

## 🎯 Benefits After Migration

✅ **Real Database**: Data persists across sessions and devices  
✅ **Centralized**: Both main site and admin use same data  
✅ **Scalable**: MongoDB can handle growth  
✅ **Secure**: Backend validates all requests  
✅ **Professional**: Industry-standard architecture  
✅ **Email Notifications**: Automatic emails via SendGrid  

---

**Your platform is now production-ready!** 🚀
