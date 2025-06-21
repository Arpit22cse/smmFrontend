import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { User, IndianRupee, ListOrdered, Receipt, RefreshCcw, Search, Menu, X, XCircle, PlusCircle, Trash2, Edit } from 'lucide-react'; // Added new icons
import ResponsiveNavbar from '../../components/NavBar';
import { serviceApi } from '../../service/api'
import 'react-toastify/dist/ReactToastify.css'; // Ensure Toastify CSS is imported

const UserDashboardPage = () => {
    const [userIdInput, setUserIdInput] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null); // The userId of the currently displayed user
    const [userData, setUserData] = useState(null); // Contains user, orders, transactions, and assigned services

    // const [allServices, setAllServices] = useState([]); // Removed: No longer needed for System Service Management
    const [customServices, setCustomServices] = useState([]); // Services available to be assigned to users

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modals for system-wide service management (Add/Delete from all services) - These are now potentially unused if System Service Management is entirely removed
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false); // Can be removed if not needed elsewhere
    const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false); // Can be removed if not needed elsewhere
    const [serviceToDelete, setServiceToDelete] = useState(null); // Can be removed if not needed elsewhere

    // Modals for user-assigned service management (Add/Delete assigned services)
    // isAssignServiceModalOpen is not used, it was meant for a separate modal for assign,
    // but assignment is now direct via dropdown+button.
    const [isAssignServiceModalOpen, setIsAssignServiceModalOpen] = useState(false);
    const [selectedServiceToAddId, setSelectedServiceToAddId] = useState(''); // The serviceId from customServices dropdown
    const [serviceToRemoveFromUser, setServiceToRemoveFromUser] = useState(null); // Service object to remove from user's assigned services
    const [isRemoveFromUserConfirmModalOpen, setIsRemoveFromUserConfirmModalOpen] = useState(false);

    // Mock authentication user role (replace with actual useAuth() from context)
    const mockAuth = {
        user: {
            role: 'admin', // 'user' or 'admin' for testing
            id: 'some_admin_user_id' // Placeholder for the authenticated user making API calls
        }
    };
    const { user: authUser } = mockAuth;

    /**
     * Fetches user data (balance, orders, transactions, services) from the API.
     * This is called when a user ID is searched.
     * @param {string} id - The user ID to fetch data for.
     */
    const fetchUserData = async (id) => {
        setLoading(true);
        setError(null);
        setUserData(null); // Clear previous user data
        setSelectedUserId(null); // Clear selected user ID until success
        try {
            const response = await serviceApi.getUser(id);
            setUserData(response.data); // Assuming response.data contains userId, balance, orders, transactions, and services array
            setSelectedUserId(id); // Set the successfully fetched user ID
            toast.success(`Data loaded for user: ${id}`, { theme: "dark" });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch user data. Please try again.');
            toast.error(err.response?.data?.message || 'Failed to fetch user data!', { theme: "dark" });
            setUserData(null);
            setSelectedUserId(null);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Fetches all services for system-wide admin management.
     * Removed from useEffect as System Service Management section is removed.
     * No longer needed unless system-wide service management is moved elsewhere.
     */
    // const fetchAllServices = async () => {
    //     if (authUser?.role !== 'admin') return;
    //     try {
    //         const response = await serviceApi.getServices(); // Call to your /api/services endpoint
    //         setAllServices(response.data.data || []);
    //     } catch (err) {
    //         console.error("Failed to fetch all services:", err);
    //         toast.error("Failed to load all services for system management.", { theme: "dark" });
    //     }
    // };

    /**
     * Fetches services available to be assigned to users (e.g., all active services).
     */
    const fetchCustomServices = async () => {
        if (authUser?.role !== 'admin') return;

        try {
            const response = await serviceApi.customServices(); // Call to your /api/custom-services endpoint
            setCustomServices(response.data || []);
        } catch (err) {
            console.error("Failed to fetch assignable services:", err);
            toast.error("Failed to load assignable services.", { theme: "dark" });
        }
    };

    useEffect(() => {
        // Fetch assignable services if the authenticated user is an admin on component mount
        if (authUser?.role === 'admin') {
            // fetchAllServices(); // Removed
            fetchCustomServices();
        }
    }, [authUser?.role]);


    /**
     * Handles the search button click or form submission.
     */
    const handleSearch = () => {
        if (!userIdInput.trim()) {
            toast.error('Please enter a User ID to search.', { theme: "dark" });
            return;
        }
        fetchUserData(userIdInput.trim());
    };

    /**
     * Handles adding a new service to the system (admin only).
     * This function is now unreferenced in the UI since the system service management section is removed.
     * @param {object} newServiceData - Data for the new service.
     */
    const handleAddService = async (newServiceData) => {
        try {
            const loadingToastId = toast.loading("Adding system service...", { theme: "dark" });
            const response = await serviceApi.addService(newServiceData);
            toast.update(loadingToastId, {
                render: `Service "${response.data.name}" added to system!`,
                type: "success", isLoading: false, autoClose: 3000, theme: "dark"
            });
            setIsAddServiceModalOpen(false);
            // fetchAllServices(); // Refresh the list of all services - no longer needed here
            fetchCustomServices(); // Also refresh assignable services
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to add system service.';
            toast.error(msg, { theme: "dark" });
        }
    };

    /**
     * Confirms deletion of a service from the system (admin only).
     * This function is now unreferenced in the UI since the system service management section is removed.
     * @param {object} service - The service object to delete.
     */
    const confirmDeleteService = (service) => {
        setServiceToDelete(service);
        setIsDeleteConfirmModalOpen(true);
    };

    /**
     * Executes deletion of a service from the system (admin only).
     * This function is now unreferenced in the UI since the system service management section is removed.
     */
    const handleDeleteService = async () => {
        if (!serviceToDelete) return;

        try {
            const loadingToastId = toast.loading(`Deleting service "${serviceToDelete.name}" from system...`, { theme: "dark" });
            await serviceApi.deleteService(serviceToDelete.serviceId); // Assuming serviceId is used for deletion
            toast.update(loadingToastId, {
                render: `Service "${serviceToDelete.name}" deleted from system!`,
                type: "success", isLoading: false, autoClose: 3000, theme: "dark"
            });
            setIsDeleteConfirmModalOpen(false);
            setServiceToDelete(null);
            // fetchAllServices(); // Refresh the list of all services - no longer needed here
            fetchCustomServices(); // Also refresh assignable services
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete system service.';
            toast.error(msg, { theme: "dark" });
        }
    };

    /**
     * Handles assigning a service to the current user (admin action).
     */
    const handleAssignServiceToUser = async () => {
        if (!selectedServiceToAddId || !selectedUserId) {
            toast.error("Please select a service and ensure a user is selected.", { theme: "dark" });
            return;
        }
        try {
            const loadingToastId = toast.loading("Assigning service to user...", { theme: "dark" });
            await serviceApi.addService({ userId: selectedUserId, serviceId: selectedServiceToAddId });
            toast.update(loadingToastId, {
                render: `Service assigned to ${selectedUserId}!`,
                type: "success", isLoading: false, autoClose: 3000, theme: "dark"
            });
            setSelectedServiceToAddId(''); // Clear selection
            fetchUserData(selectedUserId); // Refresh user data to show new assigned service
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign service.';
            toast.error(msg, { theme: "dark" });
        }
    };

    /**
     * Confirms unassignment of a service from a user (admin action).
     * @param {object} service - The service object to remove from the user.
     */
    const confirmRemoveServiceFromUser = (service) => {
        setServiceToRemoveFromUser(service);
        setIsRemoveFromUserConfirmModalOpen(true);
    };

    /**
     * Executes unassignment of a service from a user (admin action).
     */
    const handleRemoveServiceFromUser = async () => {
        if (!serviceToRemoveFromUser || !selectedUserId) return;

        try {
            const loadingToastId = toast.loading(`Removing service "${serviceToRemoveFromUser.name}" from user...`, { theme: "dark" });
            await serviceApi.deleteService( {userId: selectedUserId, serviceId: serviceToRemoveFromUser.serviceId });
            toast.update(loadingToastId, {
                render: `Service "${serviceToRemoveFromUser.name}" removed from user!`,
                type: "success", isLoading: false, autoClose: 3000, theme: "dark"
            });
            setIsRemoveFromUserConfirmModalOpen(false);
            setServiceToRemoveFromUser(null);
            fetchUserData(selectedUserId); // Refresh user data
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to remove service from user.';
            toast.error(msg, { theme: "dark" });
        }
    };


    // Helper function to format date strings
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Component for Add Service Modal (system-wide) - can be removed if not needed elsewhere
    const AddServiceModal = ({ isOpen, onClose, onAdd }) => {
        const [newService, setNewService] = useState({
            serviceId: '', service: '', internalName: '', name: '', rate: '', min: '', max: ''
        });

        const handleChange = (e) => {
            const { name, value } = e.target;
            setNewService(prev => ({ ...prev, [name]: name === 'rate' || name === 'min' || name === 'max' ? parseFloat(value) : value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!newService.serviceId || !newService.service || !newService.name || !newService.rate || !newService.min || !newService.max) {
                toast.error('All fields are required!', { theme: "dark" });
                return;
            }
            if (isNaN(newService.rate) || isNaN(newService.min) || isNaN(newService.max)) {
                toast.error('Rate, min, and max must be numbers!', { theme: "dark" });
                return;
            }
            onAdd(newService);
        };

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-dark-card p-6 rounded-lg shadow-2xl max-w-md w-full border border-primary-purple relative">
                    <button onClick={onClose} className="absolute top-3 right-3 text-text-dim hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold text-text-light mb-6 text-center">Add New System Service</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {['serviceId', 'service', 'internalName', 'name'].map(field => (
                            <input
                                key={field}
                                type="text"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1') + ' *'}
                                value={newService[field]}
                                onChange={handleChange}
                                className="w-full p-2 bg-dark-background text-text-light border border-primary-purple/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-purple"
                                required
                            />
                        ))}
                        {['rate', 'min', 'max'].map(field => (
                            <input
                                key={field}
                                type="number"
                                name={field}
                                placeholder={field.charAt(0).toUpperCase() + field.slice(1) + ' *'}
                                value={newService[field]}
                                onChange={handleChange}
                                className="w-full p-2 bg-dark-background text-text-light border border-primary-purple/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-purple"
                                step="any"
                                required
                            />
                        ))}
                        <button type="submit" className="w-full bg-primary-purple hover:bg-secondary-purple text-text-light font-semibold py-2 px-4 rounded-md transition duration-300">
                            Add Service
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    // Component for Delete Confirmation Modal (system-wide) - can be removed if not needed elsewhere
    const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, service }) => {
        if (!isOpen || !service) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-dark-card p-6 rounded-lg shadow-2xl max-w-sm w-full border border-danger-red relative">
                    <button onClick={onClose} className="absolute top-3 right-3 text-text-dim hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-danger-red mb-4 text-center">Confirm System Service Deletion</h2>
                    <p className="text-text-light text-center mb-6">
                        Are you sure you want to delete the service: <br />
                        <span className="font-semibold text-primary-purple">"{service.name}" (ID: {service.serviceId})</span>?
                        This will remove it from the system entirely.
                    </p>
                    <div className="flex justify-around gap-4">
                        <button onClick={onClose} className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition duration-300">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="flex-1 py-2 px-4 bg-danger-red hover:bg-red-700 text-white font-semibold rounded-md transition duration-300">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Component for Remove Service From User Confirmation Modal
    const RemoveFromUserConfirmModal = ({ isOpen, onClose, onConfirm, service, userId }) => {
        if (!isOpen || !service || !userId) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-dark-card p-6 rounded-lg shadow-2xl max-w-sm w-full border border-danger-red relative">
                    <button onClick={onClose} className="absolute top-3 right-3 text-text-dim hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <h2 className="text-xl font-bold text-danger-red mb-4 text-center">Confirm Service Removal</h2>
                    <p className="text-text-light text-center mb-6">
                        Are you sure you want to remove service: <br />
                        <span className="font-semibold text-primary-purple">"{service.name}" (ID: {service.serviceId})</span><br />
                        from user: <span className="font-semibold text-primary-purple">"{userId}"</span>?
                    </p>
                    <div className="flex justify-around gap-4">
                        <button onClick={onClose} className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition duration-300">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className="flex-1 py-2 px-4 bg-danger-red hover:bg-red-700 text-white font-semibold rounded-md transition duration-300">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-inter antialiased">
            {/* Inline CSS for react-toastify and custom theme colors (similar to previous apps) */}
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

                /* Loading spinner animation */
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow { animation: spin 2s linear infinite; }
                `}
            </style>

            {/* Navbar */}
            <ResponsiveNavbar/>

            {/* Main content area */}
            <main className="container mx-auto px-4 py-8">
                <div className="bg-dark-card p-8 rounded-lg shadow-2xl w-full max-w-2xl mx-auto border border-primary-purple">
                    <h1 className="text-3xl font-bold text-text-light mb-6 text-center">
                        User Dashboard
                    </h1>

                    {/* User ID Search Input */}
                    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <input
                                type="text"
                                placeholder="Enter User ID (e.g., user123 or demoUser)"
                                className="w-full p-3 pl-10 bg-dark-background text-text-light border border-primary-purple rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple"
                                value={userIdInput}
                                onChange={(e) => setUserIdInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="w-full sm:w-auto flex items-center justify-center bg-primary-purple hover:bg-secondary-purple text-text-light font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading}
                        >
                            {loading ? (
                                <RefreshCcw className="animate-spin-slow mr-2" size={20} />
                            ) : (
                                <Search className="mr-2" size={20} />
                            )}
                            {loading ? 'Searching...' : 'Search User'}
                        </button>
                    </div>

                    {/* Loading, Error, or User Data Display */}
                    {loading && (
                        <div className="text-center py-12 text-text-dim">
                            <RefreshCcw className="animate-spin-slow mx-auto mb-4" size={48} />
                            <p>Loading user data for {userIdInput}...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-danger-red/20 text-danger-red p-4 rounded-md flex items-center gap-3 mb-8">
                            <XCircle size={24} />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* User Data Sections */}
                    {userData && (
                        <div className="space-y-8 mt-8">
                            {/* User Info & Balance */}
                            <div className="bg-dark-background p-6 rounded-lg border border-primary-purple/50 shadow-md">
                                <h2 className="text-2xl font-bold text-text-light mb-4 flex items-center">
                                    <User className="mr-2 text-primary-purple" size={24} /> User: {userData.userId}
                                </h2>
                                <div className="flex items-center text-text-light text-lg">
                                    <IndianRupee className="mr-2 text-primary-purple" size={24} /> {/* Changed to IndianRupee */}
                                    <strong>Balance:</strong> <span className="ml-2 font-medium">{userData.balance}</span>
                                </div>
                            </div>

                            {/* User's Assigned Services Section */}
                            <div className="bg-dark-background p-6 rounded-lg border border-primary-purple/50 shadow-md">
                                <h2 className="text-2xl font-bold text-text-light mb-4 flex items-center">
                                    <ListOrdered className="mr-2 text-primary-purple" size={24} /> Assigned Services
                                </h2>
                                {userData.services && userData.services.length > 0 ? (
                                    <div className="space-y-3">
                                        {userData.services.map((serviceItem) => (
                                            <div key={serviceItem.serviceId} className="bg-dark-card p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-primary-purple/30">
                                                <div className="mb-2 sm:mb-0">
                                                    <p className="font-semibold text-text-light">Name: {serviceItem.internalName}</p>
                                                    <p className="text-text-dim text-sm">Service ID: {serviceItem.serviceId}</p>
                                                </div>
                                                <div className="text-left sm:text-right flex items-center gap-2"> {/* Added flex for button */}
                                                    <p className="font-bold text-text-light">Rate: ₹{parseFloat(serviceItem.rate).toFixed(2)}</p>
                                                    <p className="text-text-dim text-xs">Min: {serviceItem.min} | Max: {serviceItem.max}</p>
                                                    {authUser?.role === 'admin' && (
                                                        <button
                                                            onClick={() => confirmRemoveServiceFromUser(serviceItem)}
                                                            className="p-1 text-danger-red hover:text-red-700 transition duration-300 rounded-md"
                                                            title={`Remove ${serviceItem.name} from ${userData.userId}`}
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-dim text-center py-4">No services assigned to this user.</p>
                                )}

                                {/* Add Service to User - Dropdown & Button (Admin only, when user data loaded) */}
                                {authUser?.role === 'admin' && userData && (
                                    <div className="mt-6 pt-4 border-t border-primary-purple/20">
                                        <h3 className="text-xl font-bold text-text-light mb-4 flex items-center">
                                            <PlusCircle className="mr-2 text-primary-purple" size={20} /> Assign New Service
                                        </h3>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <select
                                                value={selectedServiceToAddId}
                                                onChange={(e) => setSelectedServiceToAddId(e.target.value)}
                                                className="flex-grow p-3 bg-dark-background text-text-light border border-primary-purple/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-purple"
                                            >
                                                <option value="">Select a service to assign</option>
                                                {/* Filter out services already assigned to the user */}
                                                {customServices
                                                    .filter(cs => !userData.services.some(us => us.serviceId === cs.serviceId))
                                                    .map(service => (
                                                        <option key={service.serviceId} value={service.serviceId}>
                                                            {service.internalName} (ID: {service.serviceId})
                                                        </option>
                                                    ))}
                                            </select>
                                            <button
                                                onClick={handleAssignServiceToUser}
                                                disabled={!selectedServiceToAddId}
                                                className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Assign Service
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Orders Section */}
                            <div className="bg-dark-background p-6 rounded-lg border border-primary-purple/50 shadow-md">
                                <h2 className="text-2xl font-bold text-text-light mb-4 flex items-center">
                                    <ListOrdered className="mr-2 text-primary-purple" size={24} /> Orders
                                </h2>
                                {userData.orders && userData.orders.length > 0 ? (
                                    <div className="space-y-3">
                                        {userData.orders.map((order) => (
                                            // Using order._id for key as it's unique from MongoDB
                                            <div key={order._id} className="bg-dark-card p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-primary-purple/30">
                                                <div className="mb-2 sm:mb-0">
                                                    <p className="font-semibold text-text-light">Order ID: {order.orderid}</p>
                                                    <p className="text-text-dim text-sm">Service: {order.service}</p>
                                                    <p className="text-text-dim text-sm">Qty: {order.quantity} | Rate: ₹{order.rate.toFixed(2)}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className="font-bold text-text-light">Total: ₹{(order.quantity * order.rate).toFixed(2)}</p>
                                                    <span className={`text-sm font-medium uppercase ${order.status === 'completed' ? 'text-green-500' : order.status === 'pending' ? 'text-yellow-500' : 'text-blue-400'}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-text-dim text-xs mt-1">Date: {formatDate(order.date)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-dim text-center py-4">No orders found for this user.</p>
                                )}
                            </div>

                            {/* Transactions Section */}
                            <div className="bg-dark-background p-6 rounded-lg border border-primary-purple/50 shadow-md">
                                <h2 className="text-2xl font-bold text-text-light mb-4 flex items-center">
                                    <Receipt className="mr-2 text-primary-purple" size={24} /> Transactions
                                </h2>
                                {userData.transactions && userData.transactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {userData.transactions.map((transaction) => (
                                            // Using transaction._id for key
                                            <div key={transaction._id} className="bg-dark-card p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-primary-purple/30">
                                                <div className="mb-2 sm:mb-0">
                                                    <p className="font-semibold text-text-light">Type: {transaction.type}</p>
                                                    <p className="text-text-dim text-sm">Order ID: {transaction.orderId}</p>
                                                </div>
                                                <div className="text-left sm:text-right">
                                                    <p className={`font-bold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                        Amount: ₹{transaction.amount.toFixed(2)}
                                                    </p>
                                                    <span className={`text-sm font-medium uppercase ${transaction.status === 'completed' ? 'text-green-500' : transaction.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        Status: {transaction.status}
                                                    </span>
                                                    <p className="text-text-dim text-xs mt-1">Date: {formatDate(transaction.date)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-dim text-center py-4">No transactions found for this user.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Admin System Services Management Section (This entire block is removed as per request) */}
                    {/* {authUser?.role === 'admin' && !selectedUserId && (
                        <div className="bg-dark-card p-8 rounded-lg shadow-2xl mt-12 border border-primary-purple">
                            <h1 className="text-3xl font-bold text-text-light mb-6 text-center flex items-center justify-center">
                                <Menu className="mr-3 text-primary-purple" size={28} /> System Service Management
                            </h1>
                            <button
                                onClick={() => setIsAddServiceModalOpen(true)}
                                className="w-full flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg mb-6"
                            >
                                <PlusCircle className="mr-2" size={20} /> Add New System Service
                            </button>

                            <h2 className="text-xl font-bold text-text-light mb-4">All Available System Services:</h2>
                            {allServices.length > 0 ? (
                                <div className="space-y-4">
                                    {allServices.map((service) => (
                                        <div key={service.serviceId} className="bg-dark-background p-4 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center border border-primary-purple/30">
                                            <div className="mb-2 sm:mb-0">
                                                <p className="font-semibold text-text-light">Name: {service.name} ({service.serviceId})</p>
                                                <p className="text-text-dim text-sm">Internal: {service.internalName} | User-Def: {service.service}</p>
                                                <p className="text-text-dim text-sm">Rate: ₹{parseFloat(service.rate).toFixed(2)} | Min: {service.min} | Max: {service.max}</p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => confirmDeleteService(service)}
                                                    className="p-2 text-danger-red hover:text-red-700 transition duration-300"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-text-dim text-center py-4">No services found in the system.</p>
                            )}
                        </div>
                    )} */} {/* END OF REMOVED BLOCK */}
                </div>
            </main>

            {/* Modals for system-wide service management (These can now be removed if not used anywhere else) */}
            {/* <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                onAdd={handleAddService}
            />
            <DeleteConfirmModal
                isOpen={isDeleteConfirmModalOpen}
                onClose={() => setIsDeleteConfirmModalOpen(false)}
                onConfirm={handleDeleteService}
                service={serviceToDelete}
            /> */}

            {/* Modals for user-assigned service management */}
            <RemoveFromUserConfirmModal
                isOpen={isRemoveFromUserConfirmModalOpen}
                onClose={() => setIsRemoveFromUserConfirmModalOpen(false)}
                onConfirm={handleRemoveServiceFromUser}
                service={serviceToRemoveFromUser}
                userId={selectedUserId}
            />


            {/* React Toastify Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark" // Explicitly set theme to dark for consistency with custom styles
            />
        </div>
    );
};

export default UserDashboardPage;