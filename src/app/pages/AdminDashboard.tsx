import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import { DollarSign, Users, ShoppingBag, TrendingUp, Mail } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalClients: 0,
    activeSubscriptions: 0,
    pendingRequests: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    // Check if admin is logged in
    const authToken = localStorage.getItem('adminAuth');
    if (!authToken) {
      navigate('/admin');
      return;
    }

    // Load data from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const requests = JSON.parse(localStorage.getItem('customRequests') || '[]');

    // Calculate stats
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.amount), 0);
    const activeSubscriptions = orders.filter((o: any) =>
      o.serviceId === 'social-media' || o.serviceId === 'seo-google'
    ).length;

    setStats({
      totalRevenue,
      totalClients: orders.length,
      activeSubscriptions,
      pendingRequests: requests.filter((r: any) => r.status === 'pending').length
    });

    setRecentOrders(orders.slice(-5).reverse());
    setRecentRequests(requests.slice(-5).reverse());
  }, [navigate]);

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+12.5%'
    },
    {
      title: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'bg-blue-500',
      change: '+8.2%'
    },
    {
      title: 'Active Subscriptions',
      value: stats.activeSubscriptions,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: '+15.3%'
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      icon: Mail,
      color: 'bg-orange-500',
      change: '+3'
    }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="text-white" size={24} />
                    </div>
                    <span className="text-sm text-green-600 font-semibold">{stat.change}</span>
                  </div>
                  <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Recent Orders</h2>
              </div>
              <div className="p-6">
                {recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <div key={index} className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0">
                        <div>
                          <p className="font-semibold">{order.service}</p>
                          <p className="text-sm text-gray-600">{order.orderId}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${order.amount}</p>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Custom Requests */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">Recent Custom Requests</h2>
              </div>
              <div className="p-6">
                {recentRequests.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No custom requests yet</p>
                ) : (
                  <div className="space-y-4">
                    {recentRequests.map((request, index) => (
                      <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">{request.name}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            request.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {request.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-700 mt-1">{request.serviceType}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(request.date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/admin/clients')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Manage Clients
              </button>
              <button
                onClick={() => navigate('/admin/subscriptions')}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
              >
                View Subscriptions
              </button>
              <a
                href="mailto:sowwanpay@gmail.com"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
