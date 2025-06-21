import { useAuth } from "../../context/Authcontext";
import OrderForm from "../../components/OrderForm";
import CreateUserForm from "../../components/CreateUserForm";
import ResponsiveNavbar from "../../components/NavBar";
import {useNavigate} from "react-router-dom"
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
export default function Home(){
    
    const auth=useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.isAuthenticated) {
            navigate("/login");
            return;
        }
    }, [auth.user, navigate]);
    
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter antialiased">
    {/* Inline react-toastify CSS to resolve import issues in this environment */}
    <style>
        {`
            /* Base Toastify container styling */
            .Toastify__toast-container {
                font-family: 'Inter', sans-serif;
                z-index: 9999;
            }
            /* General toast styling */
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
            /* Success toast specific styling */
            .Toastify__toast--success {
                background-color: rgba(0, 0, 0, 0.9);
                border-color: rgba(76, 29, 149, 0.3);
                color: #f5f3ff;
            }
            /* Error toast specific styling */
            .Toastify__toast--error {
                background-color: rgba(0, 0, 0, 0.9);
                border-color: rgba(76, 29, 149, 0.3);
                color: #f5f3ff;
            }
            /* Info toast specific styling */
            .Toastify__toast--info {
                background-color: rgba(0, 0, 0, 0.9);
                border-color: rgba(76, 29, 149, 0.3);
                color: #f5f3ff;
            }
            /* Progress bar styling */
            .Toastify__progress-bar {
                background-color: #a78bfa; /* purple-400 */
            }
            /* Close button styling */
            .Toastify__close-button {
                color: #f5f3ff; /* white */
                opacity: 0.7;
            }
            .Toastify__close-button:hover {
                opacity: 1;
            }

            /* Input field animation for placeholder */
            .relative > input:not(:placeholder-shown) + label,
            .relative > input:focus + label,
            .relative > select:not(:placeholder-shown) + label,
            .relative > select:focus + label {
                transform: translateY(-20px) scale(0.85); /* Adjust based on padding */
                font-size: 0.75rem; /* text-xs */
            }
            .relative > input + label,
            .relative > select + label {
                transition: all 0.2s ease-out;
            }
            .relative > input:focus,
            .relative > select:focus {
                outline: none;
                box-shadow: none;
            }
        `}
    </style>

    <ResponsiveNavbar />

    <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        {auth.user.role !== 'admin' ? (
            <OrderForm/>
        ) : (
            <CreateUserForm/>
        )}
    </main>

    <ToastContainer
        position="top-right"
        autoClose={5000} // Default autoClose for most toasts
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
        hideProgressBar={false}
        newestOnTop={true} // New toasts appear on top
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      <ToastContainer/>
    </div>
  );
}