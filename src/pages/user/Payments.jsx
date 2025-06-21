import TransactionCard from "../../cards/TransactionCard";
import ResponsiveNavbar from "../../components/NavBar";
import { useEffect, useState } from "react";
import { serviceApi } from '../../service/api'; // Ensure this path is correct

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state for the first fetch
  const [loadingMore, setLoadingMore] = useState(false); // Loading state specifically for "Load More"
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page number
  const [hasMore, setHasMore] = useState(true); // Flag to check if more data is available
  const limit = 10; // Number of items per page

  // Function to fetch payments from the backend
  async function fetchPayments() {
    // Only set general loading if it's the first page
    if (page === 1) setLoading(true);
    else setLoadingMore(true); // Set specific loading for subsequent pages

    setError(null); // Clear any previous errors

    try {
      // Pass page and limit as query parameters to your API
      const response = await serviceApi.getTransactions({ page, limit });
      // Assuming your API returns data like { success: true, data: [transactions] }
      const fetchedData = response.data.data || response.data; // Adjust based on your actual API response structure

      if (Array.isArray(fetchedData)) {
        // Append new data to existing payments
        setPayments(prevPayments => [...prevPayments, ...fetchedData]);
        // Check if the number of items returned is less than the limit, indicating no more pages
        setHasMore(fetchedData.length === limit);
      } else {
        setPayments([]);
        setHasMore(false);
        console.warn("API did not return an array of transactions:", fetchedData);
      }
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
      setError("Couldn't load transactions. Please try again later.");
      setPayments([]); // Ensure payments is empty on error
      setHasMore(false); // No more data if there's an error
    } finally {
      if (page === 1) setLoading(false);
      else setLoadingMore(false);
    }
  }

  // useEffect hook to trigger fetching payments when the page number changes
  useEffect(() => {
    fetchPayments();
  }, [page]); // Dependency array: re-run when 'page' changes

  // Handler for the "Load More" button click
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1); // Increment page to fetch next set of data
  };

  return (
    <>
      <ResponsiveNavbar />
      <div className="min-h-screen bg-gradient-to-br from-black to-purple-950 text-white flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-2xl lg:max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-10 mt-4 sm:mt-8
                         text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 tracking-tight leading-tight select-none">
            Your Transactions
          </h1>

          {/* Initial Loading State */}
          {loading && payments.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="ml-4 text-purple-400 text-xl font-medium">
                Fetching your transactions...
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
                  Error!
                </p>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {/* No Transactions State */}
          {!loading && !error && payments.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="bg-black/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-purple-900/40 max-w-lg mx-auto animate-fadeIn text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-16 h-16 text-purple-500 mx-auto mb-6 opacity-80"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 8.25h19.5a2.25 2.25 0 0 0 2.25-2.25V6.75H2.25v1.5zM2.25 12h19.5a2.25 2.25 0 0 0 2.25-2.25V10.5H2.25v1.5zM2.25 15.75h19.5a2.25 2.25 0 0 0 2.25-2.25v-.75H2.25v.75zM2.25 19.5h19.5a2.25 2.25 0 0 0 2.25-2.25v-.75H2.25v.75zM2.25 4.5h19.5a2.25 2.25 0 0 0-2.25-2.25H4.5A2.25 2.25 0 0 0 2.25 4.5z"
                  />
                </svg>
                <h2 className="text-3xl font-bold text-purple-400 mb-3">No Transactions Yet!</h2>
                <p className="text-lg text-purple-200 leading-relaxed">
                  It looks like you haven't made any transactions with us yet.
                </p>
                <button className="mt-8 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75">
                  Make a Purchase
                </button>
              </div>
            </div>
          )}

          {/* Transactions List */}
          {!loading && !error && payments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {payments.map((payment, idx) => (
                <TransactionCard key={payment.orderId || idx} payment={payment} />
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
                Load More Transactions
              </button>
            </div>
          )}

          {loadingMore && ( // Show loader when specifically loading more (after initial data)
            <div className="flex justify-center items-center py-4 mt-4">
              <svg className="animate-spin h-8 w-8 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="ml-3 text-purple-400 text-lg">Loading more...</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}