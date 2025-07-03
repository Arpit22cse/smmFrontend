import React, { useEffect, useCallback, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Loader2, AlertCircle, X, Copy, Plus, Search } from "lucide-react"; // Added Search icon
import { serviceApi } from "../../service/api";
import { v4 as uuidv4 } from 'uuid';

const CreateServicePage = ({ setPageMode, allServices, setAllServices }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: '',
    service: '',
    name: '',
    internalName: '',
    rate: '',
    min: '',
    max: '',
    refill: false,
    cancel: false,
  });
  const [selectedServiceIdForDuplication, setSelectedServiceIdForDuplication] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Effect to reset form and filters on component mount or when navigating to this page
  useEffect(() => {
    setFormData({
      serviceId: '', service: '', name: '', internalName: '',
      rate: '', min: '', max: '', refill: false, cancel: false,
    });
    setSelectedServiceIdForDuplication('');
    setSearchTerm('');
    setSelectedCategoryFilter('All');
  }, []);

  // Handler for all form input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Handler for duplicating a selected service
  const handleDuplicateService = useCallback(() => {
    if (!selectedServiceIdForDuplication) {
      toast.error("Please select an existing service to duplicate.", { theme: "dark" });
      return;
    }

    // Find the service to duplicate using the user-defined unique ID (service field)
    const serviceToDuplicate = allServices.find(service => service.service === selectedServiceIdForDuplication);
    if (serviceToDuplicate) {
      setFormData(prev => ({
        ...prev,
        ...serviceToDuplicate,
        serviceId: serviceToDuplicate.service, // Clear original serviceId for the new duplicated service
        service: '',   // Clear original service (user-defined unique ID) for the new duplicated service
        // Ensure min, max, refill, cancel are correctly carried over, handling potential undefined values
        min: serviceToDuplicate.min || '',
        max: serviceToDuplicate.max || '',
        refill: serviceToDuplicate.refill || false,
        cancel: serviceToDuplicate.cancel || false,
      }));
      setSelectedServiceIdForDuplication(''); // Clear selection in dropdown after duplication
      toast.info("Ready to duplicate service. Please enter new Service ID and User Defined Unique ID.", { theme: "dark" });
    }
  }, [selectedServiceIdForDuplication, allServices]);

  // Handler for form submission (creating a new service)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepare data for submission, mapping formData to API expected structure
    const submittedServiceData = {
      serviceId: formData.service, // API expects serviceId to be the user-defined unique ID
      service: formData.serviceId, // API expects service to be the numeric service ID
      name: formData.name,
      internalName: formData.internalName,
      rate: Number(formData.rate),
      min: formData.min,
      max: formData.max,
      refill: formData.refill,
      cancel: formData.cancel,
    };

    // Basic validation for required fields
    if (!submittedServiceData.serviceId || !submittedServiceData.service || !submittedServiceData.name || isNaN(submittedServiceData.rate)) {
      toast.error("Service ID, User Defined Unique ID, Name, and Rate are required.", { theme: "dark" });
      setLoading(false);
      return;
    }

    try {
      // Frontend validation for uniqueness against all existing services
      if (allServices.some(s => s.serviceId === submittedServiceData.serviceId)) {
        toast.error(`Service ID "${submittedServiceData.serviceId}" already exists.`, { theme: "dark" });
        setLoading(false);
        return;
      }

      // Call the API to create the service
      const result = await serviceApi.createService(submittedServiceData);
      if (result.success) {
        // Update the allServices state with the newly created service
        setAllServices(prevServices => [...prevServices, { ...result.data, id: result.data._id || Date.now() }]);
        toast.success(`Service "${result.data.name}" added successfully!`, { theme: "dark" });
        setPageMode('dashboard'); // Navigate back to dashboard on success
      } else {
        toast.error("Failed to add service: " + result.data, { theme: "dark" });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(`An unexpected error occurred: ${error.message}`, { theme: "dark" });
    } finally {
      setLoading(false);
    }
  }, [formData, allServices, setAllServices, setPageMode]);

  // Handler to clear the form fields and reset filters
  const handleClearForm = useCallback(() => {
    setFormData({
      serviceId: '', service: '', name: '', internalName: '',
      rate: '', min: '', max: '', refill: false, cancel: false,
    });
    setSelectedServiceIdForDuplication('');
    setSearchTerm('');
    setSelectedCategoryFilter('All');
  }, []);

  // Memoized list of unique categories for the filter dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set(['All']); // Start with 'All' option
    allServices.forEach(service => {
      if (service.category) {
        categories.add(service.category);
      }
    });
    return Array.from(categories).sort(); // Sort categories alphabetically
  }, [allServices]);

  // Memoized filtered services for the duplication dropdown based on search term and category
  const filteredServicesForDuplication = useMemo(() => {
    let filtered = allServices;
    if (selectedCategoryFilter !== 'All') {
      filtered = filtered.filter(service => service.category === selectedCategoryFilter);
    }
    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        service.service.toLowerCase().includes(lowerCaseSearchTerm) // Search by User Defined Unique ID
         // Search by numeric Service ID
      );
    }
    return filtered;
  }, [allServices, searchTerm, selectedCategoryFilter]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      {/* Main container with responsive max-width and styling */}
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl border border-purple-700 p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-purple-400 mb-6 tracking-wide">
          Create New Service
        </h1>

        {/* Back to Dashboard Button */}
        <button
          onClick={() => {
            handleClearForm(); // Clear form state when navigating back
            setPageMode('dashboard');
          }}
          className="mb-4 px-4 py-2 bg-gray-700 text-gray-100 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center"
        >
          <X className="h-4 w-4 mr-2" /> Back to Dashboard
        </button>

        {/* Duplicate Existing Service Section */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700 space-y-4">
          <h2 className="text-xl font-bold text-gray-200">Duplicate Existing Service</h2>
          
          {/* Search Input for duplication */}
          <div className="relative">
            <label htmlFor="search-service" className="sr-only">Search Services</label>
            <input
              type="text"
              id="search-service"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 block w-full pl-10 pr-3 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700 text-gray-100"
              placeholder="Search by Name, ID, or Unique ID..."
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Category Filter for duplication */}
          <div>
            <label htmlFor="category-filter" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
              Filter by Category:
            </label>
            <select
              id="category-filter"
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-700 text-gray-100 appearance-none"
            >
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Service Selection Dropdown for Duplication */}
          <div>
            <label htmlFor="service-select-duplicate" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
              Select Service to Duplicate:
            </label>
            <select
              id="service-select-duplicate"
              value={selectedServiceIdForDuplication}
              onChange={(e) => setSelectedServiceIdForDuplication(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-800 text-gray-100 appearance-none"
            >
              <option value="">-- Select a Service to Duplicate --</option>
              {filteredServicesForDuplication.length > 0 ? (
                filteredServicesForDuplication.map((service) => (
                  <option key={service.service} value={service.service}> {/* Value is service.service (User Defined Unique ID) */}
                    {service.name} (ID: {service.serviceId}) - {service.service}
                  </option>
                ))
              ) : (
                <option value="" disabled>No services found matching filters.</option>
              )}
            </select>
          </div>
          <button
            type="button"
            onClick={handleDuplicateService}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full justify-center transform hover:scale-105"
            disabled={loading || !selectedServiceIdForDuplication}
          >
            <Copy className="h-5 w-5 mr-2" /> Duplicate Selected Service
          </button>
        </div>

        {/* Form for Creating New Service */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Service ID and User Defined Unique ID fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-300">
                User Defined Unique ID (e.g., "SMM-IG-F-STD-001")
              </label>
              <input
                type="text"
                name="service"
                id="service"
                value={formData.service}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors`}
                placeholder="User Defined Unique ID (e.g., SMM-IG-F-STD-001)"
              />
            </div>
            <div>
              <label htmlFor="serviceId" className="block text-sm font-medium text-gray-300">
                Service ID (e.g., "1", "2")
              </label>
              <input
                type="text"
                name="serviceId"
                id="serviceId"
                value={formData.serviceId}
                onChange={handleChange}
                required
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors`}
                placeholder="Unique numeric ID (e.g., 1, 2, 3)"
              />
            </div>
          </div>

          {/* Display Name and Internal Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Display Name (Backend: name)
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required={true}
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors`}
                placeholder="Name shown to customers (e.g., Followers, Likes)"
              />
            </div>
            <div>
              <label htmlFor="internalName" className="block text-sm font-medium text-gray-300">
                Internal Name (Backend: internalName)
              </label>
              <input
                type="text"
                name="internalName"
                id="internalName"
                value={formData.internalName}
                onChange={handleChange}
                required={true}
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors`}
                placeholder="e.g., IG_FOLLOWERS_STANDARD"
              />
            </div>
          </div>

          {/* Rate, Min, Max fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="rate" className="block text-sm font-medium text-gray-300">
                Rate (Backend: rate)
              </label>
              <input
                type="number"
                name="rate"
                id="rate"
                value={formData.rate}
                onChange={handleChange}
                required
                step="0.01"
                className="mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors"
                placeholder="e.90"
              />
            </div>
            <div>
              <label htmlFor="min" className="block text-sm font-medium text-gray-300">
                Min Value (Backend: min - String)
              </label>
              <input
                type="text"
                name="min"
                id="min"
                value={formData.min}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors"
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <label htmlFor="max" className="block text-sm font-medium text-gray-300">
                Max Value (Backend: max - String)
              </label>
              <input
                type="text"
                name="max"
                id="max"
                value={formData.max}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors"
                placeholder="e.g., 10000"
              />
            </div>
          </div>

          {/* Checkboxes for Refill and Cancel */}
          <div className="flex items-center space-x-6 mt-4 flex-wrap">
            <div className="flex items-center mb-2 sm:mb-0">
              <input
                id="refill"
                name="refill"
                type="checkbox"
                checked={formData.refill}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="refill" className="ml-2 block text-sm text-gray-100">
                Refill
              </label>
            </div>
            <div className="flex items-center mb-2 sm:mb-0">
              <input
                id="cancel"
                name="cancel"
                type="checkbox"
                checked={formData.cancel}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
              />
              <label htmlFor="cancel" className="ml-2 block text-sm text-gray-100">
                Cancel
              </label>
            </div>
          </div>

          {/* Action Buttons (Add New Service, Clear Form) */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                <><Plus className="h-5 w-5 mr-2" /> Add New Service</>
              )}
            </button>
            <button
              type="button"
              onClick={handleClearForm}
              className="inline-flex items-center px-4 py-2 border border-purple-700 text-sm font-medium rounded-lg shadow-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;
