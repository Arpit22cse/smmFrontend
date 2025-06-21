import React, { useState } from 'react';
import { CreditCard, User, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serviceApi } from '../service/api';

const PaymentForm = () => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');

  /**
   * Handles form submission.
   * Calls the service API to add balance and shows appropriate toast notifications.
   * @param {Object} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate inputs before making the API call
      if (!userId.trim()) {
        toast.error('User ID cannot be empty.', { theme: "dark", className: "bg-purple-950 text-purple-50 border-purple-700" });
        return;
      }
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        toast.error('Amount must be a positive number.', { theme: "dark", className: "bg-purple-950 text-purple-50 border-purple-700" });
        return;
      }

      // Call the mock service API
      const response = await serviceApi.addBalance({
        userId,
        amount: parseFloat(amount),
      });

      // Show success toast
      toast.success(response.data, {
        theme: "dark",
        className: "bg-purple-950 text-purple-50 border-purple-700",
      });

      // Clear the form fields on success
      setUserId('');
      setAmount('');
    } catch (error) {
      // Handle API errors and show error toast
      if (error.response) {
        toast.error(error.response.data.error || 'Payment processing failed', {
          theme: "dark",
          className: "bg-purple-950 text-purple-50 border-purple-700",
        });
      } else {
        toast.error('Failed to process payment', {
          theme: "dark",
          className: "bg-purple-950 text-purple-50 border-purple-700",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 p-6 bg-gray-900 rounded-lg shadow-xl border border-purple-800">
      <h2 className="text-2xl font-bold text-center text-purple-400 mb-6">Add Payment</h2>
      {/* User ID Input */}
      <div className="space-y-2">
        <label htmlFor="userId" className="text-purple-400 flex items-center gap-2">
          <User className="w-4 h-4 text-purple-400" />
          User ID
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter user ID"
          className="w-full px-4 py-2 bg-gray-800 border border-purple-700 rounded-md text-purple-50 focus:border-purple-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <label htmlFor="amount" className="text-purple-400 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-purple-400" />
          Amount ($)
        </label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="0"
          step="0.01"
          className="w-full px-4 py-2 bg-gray-800 border border-purple-700 rounded-md text-purple-50 focus:border-purple-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-purple-50 font-semibold rounded-md flex items-center justify-center gap-2 transition-colors transform hover:scale-105 active:scale-95"
      >
        Add Payment
        <CheckCircle className="w-5 h-5 text-purple-50" />
      </button>
    </form>
  );
};

export default PaymentForm;