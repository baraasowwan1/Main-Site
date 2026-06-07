import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import { Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface Subscription {
  id: string;
  service: string;
  serviceId: string;
  amount: string;
  startDate: string;
  status: 'active' | 'cancelled' | 'pending';
  billingCycle: string;
  nextBillingDate: string;
}

export default function SubscriptionManagement() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    cancelled: 0,
    monthlyRevenue: 0
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'cancelled'>('all');

  useEffect(() => {
    // Check if admin is logged in
    const authToken = localStorage.getItem('adminAuth');
    if (!authToken) {
      navigate('/admin');
      return;
    }

    // Load subscription data from orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Filter subscription-based services
    const subscriptionOrders = orders.filter((order: any) =>
      order.serviceId === 'social-media' || order.serviceId === 'seo-google'
    );

    const subs: Subscription[] = subscriptionOrders.map((order: any) => {
      const startDate = new Date(order.date);
      const nextBilling = new Date(startDate);
      nextBilling.setMonth(nextBilling.getMonth() + 1);

      return {
        id: order.orderId,
        service: order.service,
        serviceId: order.serviceId,
        amount: order.amount,
        startDate: order.date,
        status: 'active' as const,
        billingCycle: 'monthly',
        nextBillingDate: nextBilling.toISOString()
      };
    });

    setSubscriptions(subs);

    // Calculate stats
    const active = subs.filter(s => s.status === 'active').length;
    const pending = subs.filter(s => s.status === 'pending').length;
    const cancelled = subs.filter(s => s.status === 'cancelled').length;
    const monthlyRevenue = subs
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + parseFloat(s.amount), 0);

    setStats({
      total: subs.length,
      active,
      pending,
      cancelled,
      monthlyRevenue
    });
  }, [navigate]);

  const filteredSubscriptions = filterStatus === 'all'
    ? subscriptions
    : subscriptions.filter(s => s.status === filterStatus);

  const updateSubscriptionStatus = (id: string, newStatus: 'active' | 'cancelled' | 'pending') => {
    const updatedSubs = subscriptions.map(sub =>
      sub.id === id ? { ...sub, status: newStatus } : sub
    );
    setSubscriptions(updatedSubs);

    // Recalculate stats
    const active = updatedSubs.filter(s => s.status === 'active').length;
    const pending = updatedSubs.filter(s => s.status === 'pending').length;
    const cancelled = updatedSubs.filter(s => s.status === 'cancelled').length;
    const monthlyRevenue = updatedSubs
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + parseFloat(s.amount), 0);

    setStats({
      total: updatedSubs.length,
      active,
      pending,
      cancelled,
      monthlyRevenue
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-gray-600 mt-1">Track and manage all recurring subscriptions</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Total Subscriptions</h3>
                <TrendingUp className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Active</h3>
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Pending</h3>
                <AlertCircle className="text-orange-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Cancelled</h3>
                <XCircle className="text-red-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold">Monthly Revenue</h3>
                <DollarSign size={20} />
              </div>
              <p className="text-3xl font-bold">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'pending'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilterStatus('cancelled')}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  filterStatus === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelled ({stats.cancelled})
              </button>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subscription ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Billing Cycle</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Next Billing</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        No subscriptions found
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="text-sm font-mono text-gray-900">{sub.id}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Started: {new Date(sub.startDate).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{sub.service}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-lg font-bold text-green-600">${sub.amount}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold capitalize">
                            {sub.billingCycle}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-400" />
                            <p className="text-sm text-gray-700">
                              {new Date(sub.nextBillingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            sub.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : sub.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {sub.status !== 'active' && (
                              <button
                                onClick={() => updateSubscriptionStatus(sub.id, 'active')}
                                className="text-green-600 hover:text-green-700 text-xs font-semibold"
                              >
                                Activate
                              </button>
                            )}
                            {sub.status !== 'cancelled' && (
                              <button
                                onClick={() => updateSubscriptionStatus(sub.id, 'cancelled')}
                                className="text-red-600 hover:text-red-700 text-xs font-semibold"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={20} />
              About Subscriptions
            </h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-7">
              <li>• Monthly subscriptions are billed automatically each month</li>
              <li>• Social Media Management and SEO services are recurring subscriptions</li>
              <li>• Visual Identity Design and Website Creation are one-time purchases</li>
              <li>• In production, this would integrate with PayPal's subscription API for automatic billing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
