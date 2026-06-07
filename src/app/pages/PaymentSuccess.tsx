import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Download, Mail } from 'lucide-react';

export default function PaymentSuccess() {
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Get the most recent order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      setOrderDetails(orders[orders.length - 1]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-600">
                Thank you for your purchase. Your order has been confirmed.
              </p>
            </div>

            {orderDetails && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-semibold">{orderDetails.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">${orderDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">
                      {new Date(orderDetails.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600">Completed</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="text-left">
                    <h3 className="font-semibold mb-1">What's Next?</h3>
                    <p className="text-sm text-gray-700">
                      A confirmation email has been sent to your email address.
                      Our team will contact you within 24 hours to get started with your service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/services"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Browse More Services
                </Link>
                <Link
                  to="/"
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-2">Need help with your order?</p>
            <a
              href="mailto:sowwanpay@gmail.com"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
