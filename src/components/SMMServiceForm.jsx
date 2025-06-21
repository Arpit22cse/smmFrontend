import React from "react";
import { Copy, Loader2, Plus, Edit } from "lucide-react";

const SMMServiceForm = ({
  services, // Only needed for the dropdown in update mode, but passed through for completeness
  customServices, // Services for the dropdown in update mode
  loading, // General loading for form submission
  loadingCustomServices, // Specific loading for custom services dropdown
  mode,
  selectedServiceRefId,
  formData,
  handleSelectServiceForUpdate,
  handleChange,
  handleDuplicateService,
  handleSubmit,
  handleClearForm,
  setMode // Received setMode to allow navigation back to initial screen
}) => {
  const isCreateMode = mode === 'create_new';
  const isUpdateMode = mode === 'update_existing';

  return (
    <div className="w-full max-w-3xl bg-gray-900 rounded-2xl shadow-xl border border-purple-700 p-4 sm:p-6 lg:p-8 space-y-6"> {/* Enhanced styling */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-purple-400 mb-6 tracking-wide"> {/* Enhanced styling */}
        {isCreateMode ? 'Create New Service' : 'Update Existing Service'}
      </h1>

      {isUpdateMode && (
        <div className="mb-6">
          <label htmlFor="service-select" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
            Select Service to Update:
          </label>
          <div className="relative"> {/* Added relative for loader positioning */}
            <select
              id="service-select"
              value={selectedServiceRefId}
              onChange={handleSelectServiceForUpdate}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-800 text-gray-100 appearance-none" /* Improved select style */
              disabled={loadingCustomServices} // Disable dropdown while loading
            >
              <option value="">
                {loadingCustomServices ? 'Loading Services...' : '-- Select a Service --'}
              </option>
              {!loadingCustomServices && customServices.map((service,index) => (
                <option key={index} value={service.service}>
                  {service.internalName} (ID: {service.serviceId}) - {service.service}
                </option>
              ))}
            </select>
            {loadingCustomServices && ( // Loader inside dropdown
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Loader2 className="animate-spin h-5 w-5 text-purple-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {isCreateMode && (
        <div className="mb-6">
          <label htmlFor="service-select" className="block text-sm sm:text-base font-medium text-gray-300 mb-2">
            Select Service to Update:
          </label>
          <div className="relative"> {/* Added relative for loader positioning */}
            <select
              id="service-select"
              value={selectedServiceRefId}
              onChange={handleSelectServiceForUpdate}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-gray-800 text-gray-100 appearance-none" /* Improved select style */
              disabled={loadingCustomServices} // Disable dropdown while loading
            >
              <option value="">
                {loadingCustomServices ? 'Loading Services...' : '-- Select a Service --'}
              </option>
              {!loadingCustomServices && services.map((service) => (
                <option key={service.service} value={service.service}>
                  {service.name} (ID: {service.serviceId}) - {service.service}
                </option>
              ))}
            </select>
            {loadingCustomServices && ( // Loader inside dropdown
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Loader2 className="animate-spin h-5 w-5 text-purple-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Form is only visible if in create_new mode, or if in update_existing mode and a service is selected */}
      {(isCreateMode || (isUpdateMode && selectedServiceRefId !== '')) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="schemaServiceId" className="block text-sm font-medium text-gray-300">
              User Defined Unique ID (Backend: service - String, Unique)
              </label>
              <input
                type="text"
                name="schemaServiceId"
                id="schemaServiceId"
                value={formData.schemaServiceId}
                onChange={handleChange}
                required
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
                placeholder="Unique numeric ID (e.g., 1, 2, 3)"
              />
            </div>
            <div>
              <label htmlFor="schemaServiceRef" className="block text-sm font-medium text-gray-300">
              Service ID (Backend: serviceId - String)
              </label>
              <input
                type="text"
                name="schemaServiceRef"
                id="schemaServiceRef"
                value={formData.schemaServiceRef}
                onChange={handleChange}
                required
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
                placeholder="Unique text ID (e.g., SMM-IG-F-STD-001)"
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
                required={isCreateMode} // Required only in create mode
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
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
                required={isCreateMode} // Required only in create mode
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
                placeholder="e.g., IG_FOLLOWERS_STANDARD"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300">
                Type (Backend: type)
              </label>
              <input
                type="text"
                name="type"
                id="type"
                value={formData.type}
                onChange={handleChange}
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
                placeholder="e.g., Default, Premium"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                Category (Backend: category)
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                readOnly={isUpdateMode} // Read-only in update mode
                className={`mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 ${
                  isUpdateMode ? 'bg-gray-700 cursor-not-allowed' : 'hover:border-purple-500 transition-colors'
                }`}
                placeholder="e.g., Instagram, Facebook"
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
                placeholder="e.g., 0.90"
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
                className="mt-1 block w-full rounded-lg border border-gray-700 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm bg-gray-800 text-gray-100 p-2 hover:border-purple-500 transition-colors"
                placeholder="e.g., 10000"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6 mt-4 flex-wrap"> {/* Allow wrapping on small screens */}
            <div className="flex items-center mb-2 sm:mb-0"> {/* Added margin bottom for stacking */}
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
            <div className="flex items-center mb-2 sm:mb-0"> {/* Added margin bottom for stacking */}
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

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-4"> {/* Responsive buttons */}
            {/* Duplicate Service button only shown when an existing service is selected in update mode */}
                  {isUpdateMode && selectedServiceRefId !== '' && (
                    <button
                    type="button"
                    onClick={handleDuplicateService}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                    disabled={loading}
                    >
                    <Copy className="h-5 w-5 mr-2" /> Duplicate Service
                    </button>
                  )}
                  <button
                    type="submit"
                    onClick={isCreateMode ? handleSubmit : undefined}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    ) : isCreateMode ? (
                    <><Plus className="h-5 w-5 mr-2" /> Add New Service</>
                    ) : (
                    <><Edit className="h-5 w-5 mr-2" /> Update Service</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="inline-flex items-center px-4 py-2 border border-purple-700 text-sm font-medium rounded-lg shadow-md text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
                  >
                    Clear Form
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('initial')} // Back to home button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 w-full sm:w-auto justify-center transform hover:scale-105"
            >
              Back to Home
            </button>
          </div>
        </form>
      )}

      {/* Message if in update mode but no service selected */}
      {isUpdateMode && selectedServiceRefId === '' && (
        <p className="text-center text-gray-400 text-lg mt-4 animate-pulse">
          Please select a service from the dropdown above to update.
        </p>
      )}
    </div>
  );
};
export default SMMServiceForm;