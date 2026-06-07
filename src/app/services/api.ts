// API Service for MongoDB + Render Backend
// Replace all localStorage calls with these API functions

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function apiCall<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// ORDERS API
// ============================================

export const ordersApi = {
  /**
   * Create a new order
   */
  create: async (orderData: {
    orderId: string;
    service: string;
    serviceId: string;
    amount: string;
  }) => {
    return apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  /**
   * Get all orders (admin)
   */
  getAll: async () => {
    return apiCall('/orders');
  },

  /**
   * Get specific order by ID
   */
  getById: async (orderId: string) => {
    return apiCall(`/orders/${orderId}`);
  }
};

// ============================================
// CUSTOM REQUESTS API
// ============================================

export const requestsApi = {
  /**
   * Submit a custom request
   */
  create: async (requestData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    serviceType: string;
    budget: string;
    timeline: string;
    description: string;
    additionalNotes?: string;
  }) => {
    return apiCall('/custom-requests', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  /**
   * Get all custom requests (admin)
   */
  getAll: async () => {
    return apiCall('/custom-requests');
  },

  /**
   * Update request status (admin)
   */
  updateStatus: async (requestId: string, status: string) => {
    return apiCall(`/custom-requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }
};

// ============================================
// SUBSCRIPTIONS API
// ============================================

export const subscriptionsApi = {
  /**
   * Get all subscriptions with order details
   */
  getAll: async () => {
    return apiCall('/subscriptions');
  },

  /**
   * Update subscription status
   */
  update: async (id: string, status: string) => {
    return apiCall(`/subscriptions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  },

  /**
   * Get subscription by order ID
   */
  getByOrderId: async (orderId: string) => {
    return apiCall(`/subscriptions/order/${orderId}`);
  }
};

// ============================================
// ADMIN API
// ============================================

export const adminApi = {
  /**
   * Admin login
   */
  login: async (username: string, password: string) => {
    return apiCall('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
  },

  /**
   * Verify admin token
   */
  verify: async (token: string) => {
    return apiCall('/admin/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

// ============================================
// WEBSITE BUILDER API
// ============================================

export const websiteApi = {
  /**
   * Save website pages
   */
  save: async (data: {
    clientId?: string;
    pages: any[];
    siteName: string;
    customDomain?: string;
  }) => {
    return apiCall('/website-builder/pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /**
   * Get website by client ID
   */
  get: async (clientId: string) => {
    return apiCall(`/website-builder/pages/${clientId}`);
  },

  /**
   * Get all websites (admin)
   */
  getAll: async () => {
    return apiCall('/website-builder/pages');
  }
};

// ============================================
// HEALTH CHECK
// ============================================

export const healthCheck = async () => {
  return apiCall('/health');
};

export default {
  orders: ordersApi,
  requests: requestsApi,
  subscriptions: subscriptionsApi,
  admin: adminApi,
  website: websiteApi,
  health: healthCheck
};
