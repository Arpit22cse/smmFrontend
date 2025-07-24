import React, { useState, useEffect } from 'react';
import { serviceApi } from '../service/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Don't forget to import the CSS!


function OrderForm() {
  const [formData, setFormData] = useState({
    linkInput: '',
    serviceId: '', // This will hold selectedProduct.serviceId
    quantity: 1,
    notes: '', // Still managed in state for display/user input
    totalAmount: 0,
  });

  const [servicesData, setServicesData] = useState([]); // State to store fetched services
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch services data on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        // Only fetch if servicesData is empty to prevent unnecessary re-fetches
        if (servicesData.length !== 0) {
          setLoading(false); // If already loaded, stop loading state
          return;
        }

        const response = await serviceApi.getUserServices();
        setServicesData(response.data);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setError("Failed to load services. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this runs once on mount

  // Find the currently selected product's data using 'serviceId' as the key
  const selectedProduct = servicesData.find(p => p.serviceId === formData.serviceId);

  // Access min and max using 'min' and 'max' keys, parse to integer
  // Provide sensible defaults if no product is selected yet
  const minQuantity = selectedProduct ? parseInt(selectedProduct.min, 10) : 1;
  const maxQuantity = selectedProduct ? parseInt(selectedProduct.max, 10) : 100000;

  // Effect to calculate total amount whenever product or quantity changes
  useEffect(() => {
    if (selectedProduct) {
      // Ensure rate is parsed as a number
      const rate = parseFloat(selectedProduct.rate);
      const calculatedTotal = formData.quantity * rate;
      setFormData(prevData => ({
        ...prevData,
        totalAmount: calculatedTotal,
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        totalAmount: 0,
      }));
    }
  }, [formData.serviceId, formData.quantity, selectedProduct]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      let newValue = value;
      if (name === 'quantity') {
        const numValue = parseInt(value, 10);
        // Ensure quantity is a valid number; if not, default to 1 or previous valid value
        if (isNaN(numValue)) {
            newValue = ''; // Allow empty input temporarily if user is deleting
        } else {
            // Apply min/max bounds only if a product is selected
            if (selectedProduct) {
                if (numValue < parseInt(selectedProduct.min, 10)) newValue = numValue;
                else if (numValue > parseInt(selectedProduct.max, 10)) newValue = parseInt(selectedProduct.max, 10);
                else newValue = numValue;
            } else {
                // If no product selected, apply general min/max (or no limits)
                if (numValue < 1) newValue = 1;
                else newValue = numValue;
            }
        }
      }
      return {
        ...prevData,
        [name]: newValue,
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation before sending
    if (!formData.serviceId) {
      toast.error("Please select a product/service.");
      return;
    }
    if (!selectedProduct) {
        toast.error("Selected service details are missing. Please re-select.");
        return;
    }
    if (formData.quantity < minQuantity || formData.quantity > maxQuantity) {
        toast.error(`Quantity must be between ${minQuantity} and ${maxQuantity}.`);
        return;
    }
    if (!formData.linkInput.trim()) {
        toast.error("Link is required.");
        return;
    }

    // Construct the data to send to the backend
    // 'notes' is intentionally excluded from the payload, 'rate' is now included.
    const orderData = {
      linkInput: formData.linkInput,
      serviceId: formData.serviceId, // Your 'Service ID' (e.g., '1', '2')
      service: selectedProduct.service, // The 'User Defined Unique ID' (e.g., 'SMM-IG-F-STD-001')
      quantity: formData.quantity,
      rate: parseFloat(selectedProduct.rate), // Include the rate from selectedProduct
      totalAmount: formData.totalAmount,
      refill: selectedProduct.refill || false
      // 'notes' is intentionally excluded from the payload
    };

    try {
      // Show loading toast immediately
      const loadingToastId = toast.loading("Placing your order...", {
        autoClose: false, // Keep open until success/error
      });

      const response = await serviceApi.placeOrder(orderData); // Send constructed orderData

      // If response contains an error, show error toast and return
      if (response && !response.success) {
        toast.update(loadingToastId, {
          render: `Order failed: ${response.message}`,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        return;
      }

      // Update toast on success
      toast.update(loadingToastId, {
        render: "Order submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Close after 3 seconds
        closeButton: true,
      });

      // Optionally reset form after successful submission
      setFormData({
        linkInput: '',
        serviceId: '',
        quantity: 1,
        notes: '', // Reset notes field in state as well
        totalAmount: 0,
      });

    } catch (err) {
      console.error('Failed to submit order:', err);
      // Extract error message from response if available, otherwise use generic
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      // Update toast on error
      toast.update(loadingToastId, {
        render: `Failed to submit order: ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 5000, // Close after 5 seconds
        closeButton: true,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <p className="ml-4 text-lg text-purple-300">Loading services...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-center p-4 bg-red-900 bg-opacity-50 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md border border-purple-700 transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      {/* ToastContainer for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Place Your Order</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Link Input */}
        <div>
          <label htmlFor="linkInput" className="block text-purple-300 text-sm font-semibold mb-2">
            Link
          </label>
          <input
            type="url" // Use type="url" for better input validation for links
            id="linkInput"
            name="linkInput"
            value={formData.linkInput}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-purple-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            placeholder="https://example.com/your-item"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label htmlFor="serviceId" className="block text-purple-300 text-sm font-semibold mb-2">
            Select Product/Service
          </label>
          <select
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 border border-purple-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 appearance-none pr-8"
            // Add a custom arrow for select box (Tailwind doesn't provide one directly)
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23a78bfa' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.2rem' }}
          >
            <option value="" disabled>Choose a product or service</option>
            {servicesData.map(product => (
              <option key={product.serviceId} value={product.serviceId}>
                {product.name} (Rate: ₹{parseFloat(product.rate).toFixed(2)}/unit)
              </option>
            ))}
          </select>
        </div>

        {/* Display Service ID, Link to Page, and Quantity Needed */}
        {selectedProduct && (
          <div className="bg-gray-700 p-4 rounded-lg border border-purple-600 space-y-2 transition-all duration-300 ease-in-out">
            <h3 className="text-purple-300 text-base font-semibold mb-2">Selected Service Details:</h3>
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-sm">Service Name:</span>
              <span className="text-white text-sm font-medium">{selectedProduct.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-sm">User Defined ID:</span>
              <span className="text-white text-sm font-medium">{selectedProduct.service}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-300 text-sm">Rate:</span>
              <span className="text-white text-sm font-medium">₹{parseFloat(selectedProduct.rate).toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label htmlFor="quantity" className="block text-purple-300 text-sm font-semibold mb-2">
            Quantity
          </label>
          {/* Display min/max below the quantity input */}
          {selectedProduct && (
            <p className="text-purple-400 text-xs mb-1">
              Min: {minQuantity}, Max: {maxQuantity}
            </p>
          )}
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={minQuantity} // Dynamically set min based on selected product
            max={maxQuantity} // Dynamically set max based on selected product
            required
            className="w-full p-3 bg-gray-700 border border-purple-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300"
            disabled={!formData.serviceId} // Disable quantity input if no product is selected
          />
        </div>

        {/* Notes Input */}
        <div>
          <label htmlFor="notes" className="block text-purple-300 text-sm font-semibold mb-2">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 bg-gray-700 border border-purple-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 resize-y"
            placeholder="Any specific instructions for this order?"
          ></textarea>
        </div>


        {/* Total Amount Display */}
        <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-purple-600">
          <span className="text-purple-300 text-lg font-semibold">Total Amount:</span>
          <span className="text-white text-2xl font-bold">
            ₹{formData.totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
}
export default OrderForm;