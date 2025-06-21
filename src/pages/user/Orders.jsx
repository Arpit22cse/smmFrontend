import React, { useEffect, useState, useCallback } from "react";
import OrderCard from "../../cards/OrderCard"; // Ensure this path is correct
import ResponsiveNavbar from "../../components/NavBar"; // Ensure this path is correct
import { serviceApi } from '../../service/api'; // Ensure this path is correct
import { toast } from 'react-toastify'; // Added toast for messages
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Toast container for notifications
  const [page, setPage] = useState(1); // Start at page 1
  const [hasMore, setHasMore] = useState(true); // Tracks if there are more orders to load
  const limit = 10; // Number of orders to fetch per page

  // Function to fetch orders based on current page and limit
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await serviceApi.getOrders({ page, limit });
      const fetchedOrders = response.data.data || response.data; // Adjust based on your actual API response structure

      if (Array.isArray(fetchedOrders)) {
        setOrders(prevOrders => {
          // If it's the first page, replace existing orders
          // Otherwise, append new orders
          return page === 1 ? fetchedOrders : [...prevOrders, ...fetchedOrders];
        });
        // Determine if there are more orders to load
        setHasMore(fetchedOrders.length === limit);
      } else {
        setOrders([]);
        setHasMore(false);
        console.warn("API did not return an array of orders or expected structure:", fetchedOrders);
        toast.warn("Received unexpected data format for orders.", { theme: "dark" });
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again later.");
      toast.error("Failed to load orders: " + (err.response?.data?.message || err.message), { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }, [page]); // Dependency: page

  // --- New: Handler for updating a single order ---
  const handleOrderUpdate = useCallback(async (updatedOrderId) => {
    // This function will be called by OrderCard when a refill request is made
    // or its status is checked, and it needs the parent to refresh its data.
    toast.info(`Updating order ${updatedOrderId}...`, { theme: "dark", autoClose: 1000 });
    // For simplicity, we'll refetch the current page to ensure the updated order is fresh.
    // In a very large app, you might fetch only that specific order and replace it in the array.
    await fetchOrders(); // Re-fetch all orders currently displayed
  }, [fetchOrders]); // Dependency: fetchOrders to ensure it's up-to-date


  // Effect to call fetchOrders when page changes
  useEffect(() => {
    fetchOrders();
  }, [page, fetchOrders]); // Re-fetch whenever the page number or fetchOrders function changes

  // Handler for "Load More" button
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter antialiased flex flex-col">
       <style>
                {`
                /* Custom Theme Colors */
                .bg-dark-background { background-color: #1a1a1a; } /* Near black */
                .bg-dark-card { background-color: #2a2a2a; } /* Slightly lighter black for cards */
                .text-text-light { color: #f5f3ff; } /* purple-50 */
                .text-text-dim { color: #a78bfa; } /* purple-400 */
                .bg-primary-purple { background-color: #8b5cf6; } /* purple-500 */
                .hover\\:bg-secondary-purple:hover { background-color: #7c3aed; } /* purple-600 */
                .border-primary-purple { border-color: #8b5cf6; } /* purple-500 */
                .text-danger-red { color: #ef4444; } /* red-500 */
                .border-danger-red { border-color: #ef4444; } /* red-500 */

                /* react-toastify custom theme */
                .Toastify__toast-container {
                    font-family: 'Inter', sans-serif;
                    z-index: 9999;
                }
                .Toastify__toast {
                    border-radius: 0.5rem; /* rounded-lg */
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem; /* gap-3 */
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-md */
                    background-color: rgba(0, 0, 0, 0.9); /* bg-black/90 */
                    border: 1px solid rgba(76, 29, 149, 0.3); /* border-purple-900/30 */
                    color: #f5f3ff; /* text-white */
                }
                .Toastify__toast--success {
                    background-color: rgba(0, 0, 0, 0.9);
                    border-color: #10b981; /* green-500 */
                    color: #f5f3ff;
                }
                .Toastify__toast--error {
                    background-color: rgba(0, 0, 0, 0.9);
                    border-color: #ef4444; /* red-500 */
                    color: #f5f3ff;
                }
                .Toastify__progress-bar {
                    background-color: #a78bfa; /* purple-400 */
                }
                .Toastify__close-button {
                    color: #f5f3ff; /* white */
                    opacity: 0.7;
                }
                .Toastify__close-button:hover {
                    opacity: 1;
                }

                /* Basic animations */
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }

                @keyframes slideInDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideInDown { animation: slideInDown 0.4s ease-out forwards; }
                .animate-slideInDown.delay-100 { animation-delay: 0.1s; }

                @keyframes scaleUp {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-scaleUp { animation: scaleUp 0.3s ease-out forwards; }
                `}
            </style>
      <ResponsiveNavbar />

      <main className="flex-grow max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full" id="orders-main-content">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-10 mt-4 sm:mt-8
                       text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-tight leading-tight select-none">
          Your Order History
        </h1>

        {/* Loading State for initial load or "Load More" click */}
        {loading && orders.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-4 text-purple-400 text-xl font-medium">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex justify-center items-center py-12">
            <div className="bg-red-900/40 border border-red-700 rounded-lg p-6 text-center shadow-lg max-w-md mx-auto">
              <p className="text-red-300 text-lg font-semibold mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8 inline-block mr-2 -mt-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.38 3.375 2.07 3.375h14.071c1.69 0 2.936-1.875 2.07-3.375L13.5 4.375c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                Oops!
              </p>
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        {/* No Orders State */}
        {!loading && !error && orders.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="bg-gray-800 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-purple-700/40 max-w-lg mx-auto animate-fadeIn text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-16 h-16 text-purple-400 mx-auto mb-6 opacity-80"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.75 3.104v5.433c0 .526.119 1.037.348 1.515l3.682 7.737a.75.75 0 0 1-1.045 1.054L8.85 18.067a.75.75 0 0 1-.223-.585v-5.433c0-.526-.119-1.037-.348-1.515l-3.682-7.737a.75.75 0 0 1 1.045-1.054L8.85 5.933a.75.75 0 0 1 .223.585Z"
                />
              </svg>
              <h2 className="text-3xl font-bold text-purple-400 mb-3">No Orders Placed Yet!</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                It looks like you haven't placed any orders with us. Start exploring our services!
              </p>
              <button className="mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 animate-scaleUp">
                Explore Services
              </button>
            </div>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && !error && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center animate-slideInDown">
            {orders.map((order) => (
              <OrderCard key={order.orderId} order={order} onOrderUpdate={handleOrderUpdate} />
            ))}
          </div>
        )}

        {/* Load More Button & Loading Indicator */}
        {!loading && hasMore && !error && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="px-8 py-4 bg-purple-600 text-white font-bold rounded-lg shadow-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105
                         focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Load More Orders
            </button>
          </div>
        )}

        {loading && orders.length > 0 && ( // Show a small loader when loading more after initial data
          <div className="flex justify-center items-center py-4 mt-4">
            <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="ml-3 text-purple-400 text-lg">Loading more...</p>
          </div>
        )}

      </main>

      <footer className="text-center py-6 text-gray-400 select-none mt-auto">
        &copy; {new Date().getFullYear()} OrderHub. All rights reserved.
      </footer>
      <ToastContainer/>
    </div>
  );
}
