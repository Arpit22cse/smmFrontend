import React, { useEffect, useCallback, useState } from "react";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import DeleteConfirmationModal from "../../components/DeleteConfirmationModel"; // Assuming this path is correct
import { serviceApi } from "../../service/api";
import { X, Copy, Edit, Trash2 } from "lucide-react";

const UpdateServicePage = ({ setPageMode, allServices, setAllServices, customServices, setCustomServices }) => {
  const [loading, setLoading] = useState(false);
  const [loadingCustomServices, setLoadingCustomServices] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [formData, setFormData] = useState({
    serviceId: '',
    service: '',
    name: '',
    internalName: '',
    rate: '',
    min: '',
    max: '',
    refill: false,
    cancel: false, // Added cancel field for consistency
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  useEffect(() => {
    // Clear form and selection on component mount to ensure a fresh state
    setFormData({
      serviceId: '', service: '', name: '', internalName: '',
      rate: '', min: '', max: '', refill: false, cancel: false,
    });
    setSelectedServiceId('');

    // Function to load custom services from the API
    const loadCustomServices = async () => {
      setLoadingCustomServices(true);
      try {
        const result = await serviceApi.customServices(); // Fetch custom services
        if (result.success) {
          setCustomServices(result.data.data || result.data); // Update customServices state
          toast.success("Custom services for update loaded!", { theme: "dark" });
        } else {
          toast.error("Failed to load custom services for update: " + result.message, { theme: "dark" });
        }
      } catch (error) {
        console.error("Error loading custom services:", error);
        toast.error(`An error occurred while loading custom services: ${error.message}`, { theme: "dark" });
      } finally {
        setLoadingCustomServices(false);
      }
    };
    loadCustomServices(); // Call the function to load custom services
  }, [setCustomServices]); // Dependency: setCustomServices ensures this runs when the setter changes (typically once on mount)

  // Handler for when a service is selected from the dropdown for update
  const handleSelectServiceForUpdate = useCallback((e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);

    if (serviceId === '') {
      // If "Select a Service" is chosen, clear the form
      setFormData({
        serviceId: '', service: '', name: '', internalName: '',
        rate: '', min: '', max: '', refill: false, cancel: false,
      });
    } else {
      // Find the selected service from customServices or fallback to allServices
      let serviceToEdit = customServices.find(service => service.serviceId === serviceId);
      // Fallback to allServices if not found in custom (e.g., if a new service hasn't been reloaded into custom yet)
      if (!serviceToEdit) {
        serviceToEdit = allServices.find(service => service.serviceId === serviceId);
      }

      // Populate the form with the selected service's data
      if (serviceToEdit) {
        setFormData({
          serviceId: serviceToEdit.service || '',
          service: serviceToEdit.serviceId || '',
          name: serviceToEdit.name || '',
          internalName: serviceToEdit.internalName || '',
          rate: serviceToEdit.rate !== undefined ? String(serviceToEdit.rate) : '', // Convert number to string for input value
          min: serviceToEdit.min || '',
          max: serviceToEdit.max || '',
          refill: serviceToEdit.refill || false,
          cancel: serviceToEdit.cancel || false,
        });
      }
    }
  }, [customServices, allServices]); // Dependencies: customServices and allServices for finding the service

  // Generic handler for all form input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value, // Handle checkboxes correctly
    }));
  }, []);

  // Handler for duplicating a selected service (switches to create mode with pre-filled data)
  const handleDuplicateService = useCallback(() => {
    if (!selectedServiceId || selectedServiceId === '') {
      toast.error("Please select an existing service to duplicate.", { theme: "dark" });
      return;
    }

    const serviceToDuplicate = allServices.find(service => service.serviceId === selectedServiceId);
    if (serviceToDuplicate) {
      setPageMode('create_new'); // Navigate to the Create Service page
      setFormData({
        ...serviceToDuplicate, // Pre-fill with data from the duplicated service
        serviceId: serviceToDuplicate.service, // Clear Service ID for new input
        service: '',   // Clear User Defined Unique ID for new input
      });
      toast.info("Ready to duplicate service. Please enter new Service ID and User Defined Unique ID.", { theme: "dark" });
    }
  }, [selectedServiceId, allServices, setPageMode, setFormData]); // Dependencies: selectedServiceId, allServices, setPageMode, setFormData

  // Handler for form submission (updating an existing service)
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading indicator

    // Prepare data for submission, ensuring rate is a number
    const submittedServiceData = {
      serviceId: formData.serviceId,
      service: formData.service,
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
      // Retrieve the original service to perform min/max value validation
      const originalService = allServices.find(s => s.serviceId === selectedServiceId);
      if (originalService) {
        if (parseFloat(submittedServiceData.min) < parseFloat(originalService.min)) {
          toast.error(`Min value cannot be smaller than original min (${originalService.min}).`, { theme: "dark" });
          setLoading(false);
          return;
        }
        if (parseFloat(submittedServiceData.max) > parseFloat(originalService.max)) {
          toast.error(`Max value cannot be greater than original max (${originalService.max}).`, { theme: "dark" });
          setLoading(false);
          return;
        }
      }

      // Construct the payload for the update API call
      const updatePayload = {
        serviceId: submittedServiceData.service,
        service: submittedServiceData.serviceId,
        name: submittedServiceData.name,
        internalName: submittedServiceData.internalName,
        rate: submittedServiceData.rate,
        min: submittedServiceData.min,
        max: submittedServiceData.max,
        refill: submittedServiceData.refill,
        cancel: submittedServiceData.cancel,
      };

      const result = await serviceApi.updateService(updatePayload); // Call the update API
      if (result.success) {
        // Update both allServices and customServices states with the new data
        setAllServices(prevServices =>
          prevServices.map(service =>
            service.serviceId === selectedServiceId ? { ...service, ...updatePayload, id: service.id || service._id } : service
          )
        );
        setCustomServices(prevCustomServices =>
          prevCustomServices.map(service =>
            service.serviceId === selectedServiceId ? { ...service, ...updatePayload, id: service.id || service._id } : service
          )
        );
        toast.success(`Service "${submittedServiceData.name}" (ID: ${submittedServiceData.serviceId}, Unique Ref: ${submittedServiceData.service}) updated successfully!`, { theme: "dark" });
        setPageMode('dashboard'); // Navigate back to dashboard on success
      } else {
        toast.error("Failed to update service: " + result.message, { theme: "dark" });
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error(`An unexpected error occurred: ${error.message}`, { theme: "dark" });
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, [formData, selectedServiceId, allServices, customServices, setAllServices, setCustomServices, setPageMode]); // Dependencies for handleSubmit

  // Handler to clear the form fields and reset selected service
  const handleClearForm = useCallback(() => {
    setFormData({
      serviceId: '', service: '', name: '', internalName: '',
      rate: '', min: '', max: '', refill: false, cancel: false,
    });
    setSelectedServiceId('');
  }, []);

  // Callback to open the delete confirmation modal
  const confirmDeleteService = useCallback((service) => {
    setServiceToDelete(service);
    setIsDeleteModalOpen(true);
  }, []);

  // Callback to handle the actual deletion of a service after confirmation
  const handleDeleteService = useCallback(async () => {
    if (!serviceToDelete) return; // Ensure there's a service selected for deletion

    setIsDeleteModalOpen(false); // Close the modal immediately
    setLoading(true); // Start loading indicator for the delete operation

    try {
      const loadingToastId = toast.loading(`Deleting service "${serviceToDelete.name}"...`, { theme: "dark" });

      // Call the API to delete the custom service
      const result = await serviceApi.deleteCustomServices({ serviceId: serviceToDelete.serviceId });

      if (result.success) {
        // Remove the deleted service from both allServices and customServices states
        setAllServices(prev => prev.filter(s => s.serviceId !== serviceToDelete.serviceId));
        setCustomServices(prev => prev.filter(s => s.serviceId !== serviceToDelete.serviceId));

        toast.update(loadingToastId, {
          render: `Service "${serviceToDelete.name}" deleted successfully!`,
          type: "success", isLoading: false, autoClose: 3000, theme: "dark"
        });

        // Reset form and selection after successful deletion
        setSelectedServiceId('');
        setFormData({
          serviceId: '', service: '', name: '', internalName: '', rate: '', min: '', max: '', refill: false, cancel: false,
        });
        setServiceToDelete(null); // Clear the service to delete
        setPageMode('dashboard'); // Navigate back to dashboard on success
      } else {
        toast.update(loadingToastId, {
          render: `Failed to delete service: ${result.message}`,
          type: "error", isLoading: false, autoClose: 5000, theme: "dark"
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred.';
      toast.error(`Failed to delete service: ${errorMessage}`, { theme: "dark" });
    } finally {
      setLoading(false); // Stop loading indicator
    }
  }, [serviceToDelete, setAllServices, setCustomServices, setPageMode]); // Dependencies for handleDeleteService

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 py-8">
      {/* Centered container */}
      <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl border border-purple-700 p-4 sm:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-purple-400 mb-6 tracking-wide">
          Update Existing Service
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

        {/* Service Selection Dropdown */}
        <div className="mb-6">
          <label htmlFor="service-select" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
            Select Service to Update:
          </label>
          <div className="relative">
            <select
              id="service-select"
              value={selectedServiceId}
              onChange={handleSelectServiceForUpdate}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-800 text-gray-100 appearance-none"
              disabled={loadingCustomServices} // Disable dropdown while custom services are loading
            >
              <option value="">
                {loadingCustomServices ? 'Loading Services...' : '-- Select a Service --'}
              </option>
              {!loadingCustomServices && customServices && customServices.map((service) => (
                <option key={service.serviceId} value={service.serviceId}>
                  {service.internalName} (ID: {service.serviceId}) - {service.service}
                </option>
              ))}
            </select>
            {loadingCustomServices && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Loader2 className="animate-spin h-5 w-5 text-purple-400" />
              </div>
            )}
          </div>
        </div>

        {/* Form fields (only visible if a service is selected) */}
        {(selectedServiceId !== '') && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  readOnly={true} // This field is read-only for updates
                  className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm sm:text-sm bg-gray-700 text-gray-100 p-2 cursor-not-allowed`}
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
                  readOnly={true} // This field is read-only for updates
                  className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm sm:text-sm bg-gray-700 text-gray-100 p-2 cursor-not-allowed`}
                  placeholder="Unique numeric ID (e.g., 1, 2, 3)"
                />
              </div>
            </div>

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
              <div className="flex items-center mb-2 sm:mb-0"> {/* Added cancel checkbox */}
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

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4">
              <button
                type="button"
                onClick={handleDuplicateService}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                disabled={loading || !selectedServiceId}
              >
                <Copy className="h-5 w-5 mr-2" /> Duplicate Service
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                ) : (
                  <><Edit className="h-5 w-5 mr-2" /> Update Service</>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  const service = customServices.find(s => s.serviceId === selectedServiceId);
                  if (service) {
                    confirmDeleteService(service);
                  } else {
                    toast.error("Service not found for deletion.", { theme: "dark" });
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                disabled={loading}
              >
                <Trash2 className="h-5 w-5 mr-2" /> Delete Service
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
        )}

        {/* Message displayed when no service is selected in update mode */}
        {selectedServiceId === '' && (
          <p className="text-center text-gray-400 text-lg mt-4 animate-pulse">
            Please select a service from the dropdown above to update or delete.
          </p>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteService}
          service={serviceToDelete}
        />
      </div>
    </div>
  );
};

export default UpdateServicePage;