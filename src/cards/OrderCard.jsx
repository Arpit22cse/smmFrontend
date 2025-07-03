import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { serviceApi } from '../service/api'; // Make sure this path is correct
import { RotateCcw, Search, AlertCircle, Check, Info, IndianRupee, RefreshCcw } from 'lucide-react';

const OrderCard = ({ order, onOrderUpdate }) => {
  const [refillStatusLoading, setRefillStatusLoading] = useState(false);
  const [currentRefillStatus, setCurrentRefillStatus] = useState(null); // To display status after checking refill
  
  // State for checking main order status - now stores the full response data
  const [checkingOrderStatusLoading, setCheckingOrderStatusLoading] = useState(false);
  // Initialize as null; will store the full API response for detailed status when checked.
  const [lastCheckedOrderStatusDetails, setLastCheckedOrderStatusDetails] = useState(null); 


  // Function to request a refill
  const handleRequestRefill = async () => {
    // Only allow requesting refill if order.refill is exactly an empty string ""
    if (order.refill !== "") {
      toast.warn("Refill is not available to be requested for this order.", { theme: "dark" });
      return;
    }

    try {
      const loadingToastId = toast.loading("Requesting refill...", { theme: "dark" });

      // Assuming serviceApi.requestRefill expects the order's unique ID and returns a refillId
      const response = await serviceApi.requestRefill(order.orderId);

      if (response.success) {
        toast.update(loadingToastId, {
          render: `Refill requested successfully! Refill ID: ${response.data.refill || 'N/A'}`,
          type: "success",
          isLoading: false,
          autoClose: 5000,
          theme: "dark",
          icon: <Check className="text-green-500" />
        });
        
        // IMPORTANT: Call parent to refresh specific order or list.
        // This is crucial for `order.refill` to be updated by the backend
        // from "" to the actual refillId (string) or to -1 if no more refills
        // are available after this request.
        if (onOrderUpdate) {
            onOrderUpdate(order.orderId);
        }
      } else {
        toast.update(loadingToastId, {
          render: response.message || "Failed to request refill.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          theme: "dark",
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } catch (error) {
      console.error("Error requesting refill:", error);
      toast.error(error.response?.data?.message || "An error occurred while requesting refill.", {
        icon: <AlertCircle className="text-red-500" />,
        theme: "dark"
      });
    }
  };

  // Function to check refill status
  const handleCheckRefillStatus = async () => {
    // Use order.refill directly as the refillId if it's a non-empty string
    const refillIdToCheck = order.refill;

    // Check if order.refill is a non-empty string before proceeding
    if (typeof refillIdToCheck !== 'string' || refillIdToCheck.trim() === '') {
      toast.info("No active refill request ID available to check status.", { theme: "dark" });
      return;
    }

    setRefillStatusLoading(true);
    setCurrentRefillStatus(null); // Clear previous status

    try {
      const loadingToastId = toast.loading(`Checking status for Refill ID: ${refillIdToCheck}...`, { theme: "dark" });

      // Assuming serviceApi.checkRefillStatus returns { success: true, status: "Completed" }
      const response = await serviceApi.checkRefillStatus(refillIdToCheck); 

      if (response.success) {
        const status = response.data.status; // Get the status from the response
        setCurrentRefillStatus(status); 

        // Determine toast type and icon based on status
        const toastType = status === 'Completed' ? "success" : "info";
        const toastIcon = status === 'Completed' ? <Check className="text-green-500" /> : <Info className="text-blue-400" />;

        toast.update(loadingToastId, {
          render: `Refill Status: ${status}`,
          type: toastType, // Use the determined type
          isLoading: false,
          autoClose: 7000,
          theme: "dark",
          icon: toastIcon // Use the determined icon
        });
      } else {
        toast.update(loadingToastId, {
          render: response.message || "Failed to check refill status.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          theme: "dark",
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } catch (error) {
      console.error("Error checking refill status:", error);
      toast.error(error.response?.data?.message || "An error occurred while checking refill status.", {
        icon: <AlertCircle className="text-red-500" />,
        theme: "dark"
      });
    } finally {
      setRefillStatusLoading(false);
    }
  };

  // Function to check main order status
  const handleCheckOrderStatus = async () => {
    setCheckingOrderStatusLoading(true);
    setLastCheckedOrderStatusDetails(null); // Clear previous detailed status display

    try {
      const loadingToastId = toast.loading(`Checking status for Order ID: ${order.orderId}...`, { theme: "dark" });
      
      // Assuming serviceApi.checkOrderStatus returns data like:
      // { success: true, data: { charge: "0.27819", start_count: "3572", status: "Partial", remains: "157", currency: "USD" } }
      const response = await serviceApi.checkOrderStatus(order.orderId);

      if (response.success && response.data) { // Check for both success and data presence
        const status = response.data.status; // Access status from response.data
        setLastCheckedOrderStatusDetails(response.data); // Store the full data object

        // Determine toast type and icon based on status
        const toastType = status === 'Completed' ? "success" : "info";
        const toastIcon = status === 'Completed' ? <Check className="text-green-500" /> : <Info className="text-blue-400" />;

        toast.update(loadingToastId, {
          render: `Order Status: ${status}`,
          type: toastType,
          isLoading: false,
          autoClose: 7000,
          theme: "dark",
          icon: toastIcon
        });

        // Optionally, if the order's main status is updated, trigger a parent update
        // This makes sure the primary order.lastStatus prop gets updated if the backend changed it
        if (onOrderUpdate && order.lastStatus !== status) { // Changed to order.lastStatus
            onOrderUpdate(order.orderId); 
        }

      } else {
        toast.update(loadingToastId, {
          render: response.message || "Failed to check order status.",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          theme: "dark",
          icon: <AlertCircle className="text-red-500" />
        });
      }
    } catch (error) {
      console.error("Error checking order status:", error);
      toast.error(error.response?.data?.message || "An error occurred while checking order status.", {
        icon: <AlertCircle className="text-red-500" />,
        theme: "dark"
      });
    } finally {
      setCheckingOrderStatusLoading(false);
    }
  };

  // Helper to determine the color of the status text
  const getStatusTextColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-500';
      case 'Pending': return 'text-yellow-500';
      case 'In Progress': return 'text-blue-500';
      case 'Partial': return 'text-orange-400';
      default: return 'text-red-500'; // For 'Canceled', 'Error', etc.
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white space-y-3 border border-purple-700/50">
      <h3 className="text-xl font-bold text-purple-400">Order ID: {order.orderId}</h3>
      <p>
        <span className="font-semibold">Service:</span> {order.service}
      </p>
      <p>
        <span className="font-semibold">Quantity:</span> {order.quantity}
      </p>
      <p className="flex items-center">
        <span className="font-semibold">Rate:</span> <IndianRupee size={16} className="ml-1 mr-0.5" />{order.rate}
      </p>
      <p>
        <span className="font-semibold">Last Status:</span>{' '} {/* Changed to Last Status */}
        <span className={`font-bold ${getStatusTextColor(lastCheckedOrderStatusDetails?.status || order.lastStatus)}`}>
          {/* Display the dynamically checked status if available, otherwise default to prop status */}
          {lastCheckedOrderStatusDetails?.status || order.lastStatus}
        </span>
      </p>
      <p>
        <span className="font-semibold">Start Count:</span>{' '}
        {/* Display start_count directly from order prop */}
        {lastCheckedOrderStatusDetails?.start_count || order.start_count} 
      </p>

      {/* Display additional order status details ONLY if they have been explicitly fetched */}
      {lastCheckedOrderStatusDetails && (
        <div className="bg-gray-700 p-3 rounded-md text-sm space-y-1 border border-gray-600">
          <p><span className="font-semibold text-gray-300">Charge:</span> {lastCheckedOrderStatusDetails.charge} {lastCheckedOrderStatusDetails.currency}</p>
          <p><span className="font-semibold text-gray-300">Remains:</span> {lastCheckedOrderStatusDetails.remains}</p>
          {/* start_count is now always from order.start_count so no need to repeat it here if it's already shown above */}
        </div>
      )}

      <p>
        <span className="font-semibold">Refill:</span>{' '}
        {order.refill === null ? (
          'Not Available'
        ) : order.refill === "" ? (
          'Available (click to request)'
        ) : ( // Assuming it's a non-empty string (refillId) if not null or ""
          `Refill in progress (ID: ${order.refill})`
        )}
      </p>

      <div className="flex flex-col gap-2"> {/* Container for buttons */}
        {/* Conditional Refill Button: Show if order.refill is exactly an empty string "" */}
        {order.refill !== null && (
          <button
            onClick={handleRequestRefill}
            disabled={refillStatusLoading || checkingOrderStatusLoading} // Disable if any other operation is loading
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RotateCcw size={18} />
            Request Refill
          </button>
        )}

        {/* Conditional Check Refill Status Button: Show if order.refill is a non-empty string (refillId) */}
        {typeof order.refill === 'string' && order.refill.trim() !== '' && (
          <div className="mt-1"> {/* Use mt-1 for a smaller gap if both buttons are present */}
            <button
              onClick={handleCheckRefillStatus}
              disabled={refillStatusLoading || checkingOrderStatusLoading} // Disable if any other operation is loading
              className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={18} />
              {refillStatusLoading ? 'Checking Refill...' : 'Check Refill Status'}
            </button>
            {currentRefillStatus && (
              <p className="mt-2 text-center text-sm text-blue-300">Refill Status: {currentRefillStatus}</p>
            )}
          </div>
        )}

        {/* Check Main Order Status Button */}
        <div className="mt-1">
          <button
            onClick={handleCheckOrderStatus}
            disabled={checkingOrderStatusLoading || refillStatusLoading} // Disable if any other operation is loading
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw size={18} />
            {checkingOrderStatusLoading ? 'Updating Status...' : 'Check Order Status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;