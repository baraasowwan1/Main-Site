import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface PayPalButtonProps {
  amount: string;
  serviceName: string;
  serviceId: string;
}

export default function PayPalButton({ amount, serviceName, serviceId }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayment = () => {
    setIsLoading(true);

    // DEMO: In production, this would integrate with PayPal SDK
    // PayPal integration requires:
    // 1. PayPal Business account
    // 2. Client ID and Secret
    // 3. Server-side order creation and verification

    setTimeout(() => {
      // Simulate payment success
      const orderData = {
        orderId: 'DEMO_' + Date.now(),
        service: serviceName,
        serviceId: serviceId,
        amount: amount,
        date: new Date().toISOString(),
        status: 'completed'
      };

      // Store order in localStorage (in production, this would be saved to database)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));

      navigate('/payment-success');
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      {/* Demo Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Demo Mode:</strong> This is a demonstration. Real PayPal integration requires backend setup.
        </p>
      </div>

      {/* PayPal Button */}
      <button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .762-.633h8.167c2.7 0 4.588.543 5.615 1.615 1.014 1.059 1.397 2.656 1.14 4.748-.296 2.407-1.174 4.138-2.61 5.147-1.408 1.015-3.49 1.53-6.188 1.53H9.697a.77.77 0 0 0-.762.634l-.518 3.283-.024.125a.372.372 0 0 1-.368.313zm.374-7.78l.8-5.066a.372.372 0 0 1 .368-.313h1.867c1.194 0 2.054-.28 2.556-.833.488-.537.732-1.398.724-2.561 0-.022 0-.045.002-.067a.372.372 0 0 1 .371-.345h2.022a.372.372 0 0 1 .368.413c-.138 2.085-.813 3.498-2.006 4.2-1.18.695-2.954 1.047-5.271 1.047H7.82a.372.372 0 0 0-.37.413z"/>
            </svg>
            Pay with PayPal
          </>
        )}
      </button>

      {/* Alternative Payment Note */}
      <p className="text-center text-sm text-gray-600">
        Secure payment processing powered by PayPal
      </p>
    </div>
  );
}
