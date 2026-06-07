import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav';
import { Search, Eye, Mail, Phone, Calendar, DollarSign } from 'lucide-react';

interface Client {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  service: string;
  amount: string;
  date: string;
  status: string;
  type: 'order' | 'request';
}

export default function ClientManagement() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'orders' | 'requests'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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

    const allClients: Client[] = [
      ...orders.map((order: any) => ({
        id: order.orderId,
        service: order.service,
        amount: order.amount,
        date: order.date,
        status: order.status,
        type: 'order' as const
      })),
      ...requests.map((request: any) => ({
        id: request.id,
        name: request.name,
        email: request.email,
        phone: request.phone,
        service: request.serviceType,
        amount: request.budget,
        date: request.date,
        status: request.status,
        type: 'request' as const
      }))
    ];

    allClients.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setClients(allClients);
    setFilteredClients(allClients);
  }, [navigate]);

  useEffect(() => {
    let filtered = clients;

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(client =>
        filterType === 'orders' ? client.type === 'order' : client.type === 'request'
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredClients(filtered);
  }, [searchTerm, filterType, clients]);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNav />

      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
            <p className="text-gray-600 mt-1">Manage all your clients and their service requests</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, service, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All ({clients.length})
                </button>
                <button
                  onClick={() => setFilterType('orders')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    filterType === 'orders'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Orders ({clients.filter(c => c.type === 'order').length})
                </button>
                <button
                  onClick={() => setFilterType('requests')}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
                    filterType === 'requests'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Requests ({clients.filter(c => c.type === 'request').length})
                </button>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Client</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No clients found
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">{client.name || 'N/A'}</p>
                            {client.email && (
                              <p className="text-sm text-gray-600">{client.email}</p>
                            )}
                            <p className="text-xs text-gray-500">{client.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{client.service}</p>
                          {client.type === 'order' && (
                            <p className="text-sm text-green-600 font-semibold">${client.amount}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            client.type === 'order'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {client.type === 'order' ? 'Order' : 'Request'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-700">
                            {new Date(client.date).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            client.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : client.status === 'pending'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedClient(client)}
                            className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                          >
                            <Eye size={16} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Client Details</h2>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">ID</label>
                  <p className="text-gray-900">{selectedClient.id}</p>
                </div>

                {selectedClient.name && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Name</label>
                    <p className="text-gray-900">{selectedClient.name}</p>
                  </div>
                )}

                {selectedClient.email && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <Mail size={14} />
                      Email
                    </label>
                    <a href={`mailto:${selectedClient.email}`} className="text-blue-600 hover:text-blue-700">
                      {selectedClient.email}
                    </a>
                  </div>
                )}

                {selectedClient.phone && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <Phone size={14} />
                      Phone
                    </label>
                    <a href={`tel:${selectedClient.phone}`} className="text-blue-600 hover:text-blue-700">
                      {selectedClient.phone}
                    </a>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">Service</label>
                  <p className="text-gray-900">{selectedClient.service}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">Type</label>
                  <p className="text-gray-900 capitalize">{selectedClient.type}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                    <Calendar size={14} />
                    Date
                  </label>
                  <p className="text-gray-900">{new Date(selectedClient.date).toLocaleString()}</p>
                </div>

                {selectedClient.amount && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 flex items-center gap-1">
                      <DollarSign size={14} />
                      Amount/Budget
                    </label>
                    <p className="text-gray-900">
                      {selectedClient.type === 'order' ? `$${selectedClient.amount}` : selectedClient.amount}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className="text-gray-900 capitalize">{selectedClient.status}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-4">
              {selectedClient.email && (
                <a
                  href={`mailto:${selectedClient.email}`}
                  className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Send Email
                </a>
              )}
              <button
                onClick={() => setSelectedClient(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
