import React, { useState, useEffect } from 'react';
import { User, Wallet, KeyRound, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import { useAuth } from '../../context/Authcontext';
import ResponsiveNavbar from '../../components/NavBar';
import { authApi } from '../../service/api';

const UserProfilePage = () => {
    const auth = useAuth(); // Using the mock useAuth hook
    const [userId, setUserId] = useState(auth.user.id);
    const [userBalance, setUserBalance] = useState(auth.user.wallet);
    const [showChangePassword, setShowChangePassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    const [errors, setErrors] = useState({});

    // Simulate fetching user data from an API
    useEffect(() => {
        authApi.me().then((res)=>{
            setUserBalance(res.data.user.wallet);
        })
        
    }, []);

    /**
     * Validates the change password form fields.
     * @returns {boolean} True if the form is valid, false otherwise.
     */
    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required.';
            isValid = false;
        }

        if (newPassword.length < 8) {
            newErrors.newPassword = 'New password must be at least 8 characters.';
            isValid = false;
        } else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
            newErrors.newPassword = 'New password must include uppercase, lowercase, number, and special character.';
            isValid = false;
        }

        if (newPassword !== confirmNewPassword) {
            newErrors.confirmNewPassword = 'New password and confirm password do not match.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    /**
     * Handles the password change submission.
     * Validates the form and calls the mock serviceApi.
     * @param {Object} e - The form submission event.
     */
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        if (!validateForm()) {
            toast.error('Please correct the errors in the form.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark", // Use dark theme for toasts
            });
            return;
        }

        try {
            // Call the changePassword API from serviceApi
            const { success, message } = await serviceApi.changePassword({
                currentPassword,
                newPassword,
            });

            if (success) {
                toast.success('Password changed successfully!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                // Clear form fields on success
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                // Optionally, hide the password section after success
                // setTimeout(() => setShowChangePassword(false), 2000);
            } else {
                toast.error(message || 'Failed to change password. Please check your current password.', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        } catch (error) {
            console.error('Error changing password:', error);
            toast.error('An unexpected error occurred. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-inter antialiased">
            {/* Inline CSS for react-toastify and custom theme colors */}
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

            <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
                <div className="bg-dark-card p-8 rounded-lg shadow-2xl w-full max-w-md animate-fadeIn border border-primary-purple">
                    <h1 className="text-3xl font-bold text-text-light mb-6 text-center">
                        User Profile
                    </h1>

                    {/* User Info Section */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center text-text-light text-lg animate-slideInDown">
                            <User className="mr-3 text-primary-purple" size={24} />
                            <strong>User ID:</strong> <span className="ml-2 font-medium">{userId}</span>
                        </div>
                        <div className="flex items-center text-text-light text-lg animate-slideInDown delay-100">
                            <Wallet className="mr-3 text-primary-purple" size={24} />
                            <strong>Balance:</strong> <span className="ml-2 font-medium">{userBalance}</span>
                        </div>
                    </div>

                    {/* Change Password Button */}
                    <button
                        onClick={() => setShowChangePassword(!showChangePassword)}
                        className="w-full flex items-center justify-center bg-primary-purple hover:bg-secondary-purple text-text-light font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                    >
                        <KeyRound className="mr-2" size={20} />
                        {showChangePassword ? 'Hide Change Password' : 'Change Password'}
                    </button>

                    {/* Change Password Section */}
                    {showChangePassword && (
                        <div className="mt-8 pt-6 border-t border-dark-background animate-fadeIn">
                            <h2 className="text-2xl font-bold text-text-light mb-6 text-center">Change Password</h2>
                            <form onSubmit={handleChangePassword} className="space-y-5 animate-scaleUp">
                                <div className="relative">
                                    <label htmlFor="currentPassword" className="block text-text-dim text-sm font-medium mb-2">
                                        Current Password
                                    </label>
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        id="currentPassword"
                                        className={`w-full p-3 pr-10 bg-dark-background text-text-light border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple ${errors.currentPassword ? 'border-danger-red' : 'border-dark-background'}`}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-7"
                                    >
                                        {showCurrentPassword ? <EyeOff className="text-text-dim" size={20} /> : <Eye className="text-text-dim" size={20} />}
                                    </span>
                                    {errors.currentPassword && <p className="text-danger-red text-xs mt-1">{errors.currentPassword}</p>}
                                </div>

                                <div className="relative">
                                    <label htmlFor="newPassword" className="block text-text-dim text-sm font-medium mb-2">
                                        New Password
                                    </label>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        className={`w-full p-3 pr-10 bg-dark-background text-text-light border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple ${errors.newPassword ? 'border-danger-red' : 'border-dark-background'}`}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-7"
                                    >
                                        {showNewPassword ? <EyeOff className="text-text-dim" size={20} /> : <Eye className="text-text-dim" size={20} />}
                                    </span>
                                    {errors.newPassword && <p className="text-danger-red text-xs mt-1">{errors.newPassword}</p>}
                                </div>

                                <div className="relative">
                                    <label htmlFor="confirmNewPassword" className="block text-text-dim text-sm font-medium mb-2">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type={showConfirmNewPassword ? 'text' : 'password'}
                                        id="confirmNewPassword"
                                        className={`w-full p-3 pr-10 bg-dark-background text-text-light border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-purple ${errors.confirmNewPassword ? 'border-danger-red' : 'border-dark-background'}`}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        required
                                    />
                                    <span
                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer top-7"
                                    >
                                        {showConfirmNewPassword ? <EyeOff className="text-text-dim" size={20} /> : <Eye className="text-text-dim" size={20} />}
                                    </span>
                                    {errors.confirmNewPassword && <p className="text-danger-red text-xs mt-1">{errors.confirmNewPassword}</p>}
                                </div>

                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center bg-primary-purple hover:bg-secondary-purple text-text-light font-semibold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                                >
                                    Submit Change
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </main>
            {/* React Toastify Container */}
            <ToastContainer />
        </div>
    );
};

export default UserProfilePage;