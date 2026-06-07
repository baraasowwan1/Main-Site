import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../services/api';

interface PayPalButtonProps {
  amount: string;
  serviceName: string;
  serviceId: string;
}

export default function PayPalButton({ amount, serviceName, serviceId }: PayPalButtonProps) {
  const navigate = useNavigate();

  // PayPal Client ID from environment variable
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  if (!paypalClientId) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">
          <strong>Error:</strong> PayPal is not configured. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: 'USD',
        intent: 'capture'
      }}
    >
      <div className="space-y-4">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Secure Payment:</strong> You'll be redirected to PayPal to complete your purchase.
          </p>
        </div>

        {/* PayPal Buttons */}
        <PayPalButtons
          style={{
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                    currency_code: 'USD'
                  },
                  description: serviceName
                }
              ],
              application_context: {
                brand_name: 'SowwanPay Services',
                shipping_preference: 'NO_SHIPPING'
              }
            });
          }}
          onApprove={async (data, actions) => {
            try {
              // Capture the payment
              const details = await actions.order!.capture();
              
              console.log('Payment captured:', details);

              // Save order to database
              const orderData = {
                orderId: details.id,
                service: serviceName,
                serviceId: serviceId,
                amount: amount,
                payerEmail: details.payer?.email_address,
                payerName: details.payer?.name?.given_name + ' ' + details.payer?.name?.surname,
                status: 'completed'
              };

              // Send to backend
              await ordersApi.create(orderData);

              // Navigate to success page
              navigate('/payment-success', { 
                state: { 
                  orderDetails: details,
                  service: serviceName 
                } 
              });
            } catch (error) {
              console.error('Payment capture error:', error);
              alert('Payment failed. Please try again or contact support.');
            }
          }}
          onError={(err) => {
            console.error('PayPal error:', err);
            alert('An error occurred with PayPal. Please try again.');
          }}
          onCancel={() => {
            console.log('Payment cancelled by user');
          }}
        />

        <p className="text-center text-sm text-gray-600">
          Secure payment processing powered by PayPal
        </p>
      </div>
    </PayPalScriptProvider>
  );
}
