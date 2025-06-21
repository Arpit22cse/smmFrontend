import React, { useState, useEffect, useRef } from 'react';
import { serviceApi } from '../../service/api'; // Ensure this path is correct
import { toast } from 'react-toastify';
import { IndianRupee, Wallet, CheckCircle, XCircle, Clock, Info } from 'lucide-react';
import ResponsiveNavbar from '../../components/NavBar'; // Assuming you have a Navbar component

const PhonePePaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('IDLE'); // IDLE, INITIATED, PENDING, SUCCESS, FAILED
  const [loading, setLoading] = useState(false);
  const pollingIntervalRef = useRef(null); // Ref to store the interval ID for polling

  // Cleanup function for the polling interval
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const initiatePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount greater than 0.', { theme: 'dark' });
      return;
    }

    setLoading(true);
    setPaymentStatus('INITIATED');// Clear any previous refill status messages
    setTransactionId(null); // Clear previous transaction ID

    try {
      const parsedAmount = parseFloat(amount);
      const loadingToastId = toast.loading('Initiating PhonePe payment...', { theme: 'dark' });

      // Call backend to initiate payment
      const response = await serviceApi.initiatePhonePePayment({ amount: parsedAmount });

      if (response.success && response.data.transactionId) {
        setTransactionId(response.data.transactionId);
        setPaymentStatus('PENDING');
        toast.update(loadingToastId, {
          render: `Payment initiated! Transaction ID: ${response.data.transactionId}. Simulating PhonePe redirect...`,
          type: 'info',
          isLoading: false,
          autoClose: 5000,
          theme: 'dark',
          icon: <Info />
        });

        // Simulate PhonePe gateway interaction and callback
        // In a real scenario, you'd redirect to response.paymentUrl here
        // For simulation, we'll immediately trigger a mock success/failure after a delay
        setTimeout(async () => {
          const mockSuccess = Math.random() > 0.3; // 70% chance of success
          try {
            await serviceApi.phonePeCallback({
              transactionId: response.data.transactionId,
              status: mockSuccess ? 'SUCCESS' : 'FAILED'
            });
            toast.info(`Mock PhonePe gateway processed payment. Status: ${mockSuccess ? 'SUCCESS' : 'FAILED'}.`, { theme: 'dark' });
            // Start polling for actual status after mock callback
            startPolling(response.data.transactionId);
          } catch (callbackError) {
            console.error('Mock callback failed:', callbackError);
            toast.error('Failed to simulate PhonePe callback.', { theme: 'dark' });
            setPaymentStatus('FAILED');
          }
        }, 3000); // Simulate 3 seconds on PhonePe gateway

      } else {
        toast.update(loadingToastId, {
          render: response.message || 'Failed to initiate payment.',
          type: 'error',
          isLoading: false,
          autoClose: 5000,
          theme: 'dark',
          icon: <XCircle />
        });
        setPaymentStatus('FAILED');
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error(error.response?.data?.message || 'An unexpected error occurred during payment initiation.', { theme: 'dark' });
      setPaymentStatus('FAILED');
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (id) => {
    if (!id) return; // Only check if a transaction ID exists

    setLoading(true);
    try {
      const response = await serviceApi.checkPhonePePaymentStatus(id);

      if (response.success && response.status) {
        setPaymentStatus(response.status);
        if (response.status === 'SUCCESS' || response.status === 'FAILED') {
          clearInterval(pollingIntervalRef.current); // Stop polling on final status
          toast[response.status === 'SUCCESS' ? 'success' : 'error'](
            `Payment ${response.status}! Transaction ID: ${id}`,
            { theme: 'dark', icon: response.status === 'SUCCESS' ? <CheckCircle /> : <XCircle /> }
          );
        } else {
          toast.info(`Payment status: ${response.status}`, { theme: 'dark' });
        }
      } else {
        toast.error(response.message || 'Failed to check payment status.', { theme: 'dark' });
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast.error('An error occurred while checking payment status.', { theme: 'dark' });
      setPaymentStatus('FAILED'); // Consider marking as failed if status check consistently errors
    } finally {
      setLoading(false);
    }
  };

  // Function to start polling for status
  const startPolling = (id) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current); // Clear any existing interval
    }
    // Poll every 3 seconds until status is SUCCESS or FAILED
    pollingIntervalRef.current = setInterval(() => {
      checkPaymentStatus(id);
    }, 3000); // Poll every 3 seconds
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'IDLE': return <Info className="text-gray-400" />;
      case 'INITIATED': return <Clock className="text-blue-400 animate-pulse" />;
      case 'PENDING': return <Clock className="text-yellow-400 animate-spin" />;
      case 'SUCCESS': return <CheckCircle className="text-green-500" />;
      case 'FAILED': return <XCircle className="text-red-500" />;
      default: return <Info className="text-gray-400" />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'IDLE': return 'Enter amount to start payment';
      case 'INITIATED': return 'Payment initiation in progress...';
      case 'PENDING': return `Waiting for PhonePe confirmation (ID: ${transactionId || 'N/A'})...`;
      case 'SUCCESS': return `Payment Successful! Transaction ID: ${transactionId || 'N/A'}`;
      case 'FAILED': return `Payment Failed! Transaction ID: ${transactionId || 'N/A'}`;
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 flex flex-col">
      <ResponsiveNavbar />
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-700 transition-all duration-500 ease-in-out transform hover:scale-[1.01] space-y-6">
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center">
            Pay with PhonePe (Mock)
          </h2>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-purple-300 text-sm font-semibold mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
                <IndianRupee size={20} />
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
                className="w-full p-3 pl-10 bg-gray-700 border border-purple-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
                placeholder="e.g., 500.00"
                disabled={loading}
              />
            </div>
          </div>

          {/* Payment Status Display */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border 
                       ${paymentStatus === 'SUCCESS' ? 'bg-green-900/40 border-green-700 text-green-300' :
                         paymentStatus === 'FAILED' ? 'bg-red-900/40 border-red-700 text-red-300' :
                         paymentStatus === 'PENDING' || paymentStatus === 'INITIATED' ? 'bg-yellow-900/40 border-yellow-700 text-yellow-300' :
                         'bg-gray-700 border-gray-600 text-gray-300'} transition-all duration-300`}>
            {getStatusIcon()}
            <span className="font-medium">{getStatusMessage()}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              onClick={initiatePayment}
              disabled={loading || paymentStatus === 'PENDING' || paymentStatus === 'INITIATED'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Wallet size={20} />
              {loading && paymentStatus === 'INITIATED' ? 'Initiating...' : 'Pay with PhonePe'}
            </button>

            {transactionId && (paymentStatus === 'PENDING' || paymentStatus === 'INITIATED') && (
              <button
                onClick={() => checkPaymentStatus(transactionId)}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Search size={20} />
                {loading ? 'Checking Status...' : 'Check Status Manually'}
              </button>
            )}

            {(paymentStatus === 'SUCCESS' || paymentStatus === 'FAILED') && (
              <button
                onClick={() => {
                  setAmount('');
                  setTransactionId(null);
                  setPaymentStatus('IDLE');
                  if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                  }
                  toast.info('Payment flow reset.', { theme: 'dark' });
                }}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Reset Payment
              </button>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-400 select-none">
        &copy; {new Date().getFullYear()} OrderHub. All rights reserved.
      </footer>
    </div>
  );
};

export default PhonePePaymentPage;