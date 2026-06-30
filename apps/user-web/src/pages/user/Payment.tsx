import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
// import { bookingApi } from '../../services/api';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // In a real app, integrate Stripe/Razorpay here.
      // We simulate a network request for the payment processing.
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we assume the backend Saga orchestrator received the payment success event.
      // Optionally we could hit a mock endpoint: await bookingApi.post(`/${bookingId}/mock-payment`);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/live/${bookingId}`); // Navigate to live tracking
      }, 2000);
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-16 space-y-6">
        <CheckCircle className="w-24 h-24 text-green-500 animate-bounce" />
        <h1 className="text-3xl font-bold text-text">Payment Successful!</h1>
        <p className="text-text-muted">Your ride is confirmed. Redirecting to live tracking...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-8 mt-16">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6 mx-auto">
          <CreditCard className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold text-center text-text mb-2">Complete Payment</h1>
        <p className="text-center text-text-muted mb-8">Booking ID: <span className="font-mono text-xs">{bookingId}</span></p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-text-muted">Subtotal</span>
            <span className="font-medium">$10.00</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-text-muted">Service Fee</span>
            <span className="font-medium">$2.00</span>
          </div>
          <div className="flex justify-between items-center py-3 text-lg font-bold">
            <span className="text-text">Total</span>
            <span className="text-primary">$12.00</span>
          </div>
        </div>

        <button 
          onClick={handlePay} 
          disabled={loading} 
          className="w-full py-4 bg-text text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-lg shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : 'Pay $12.00 Now'}
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <ShieldCheck className="w-4 h-4" /> Secure Payment
        </div>
      </div>
    </div>
  );
}
