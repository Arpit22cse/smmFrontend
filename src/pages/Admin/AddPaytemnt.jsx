import ResponsiveNavbar from '../../components/NavBar'
import PaymentForm from '../../components/PaymentForm'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddPayment(){
    return (
    // Set a dark background and text color for the entire app
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter antialiased">
          <style>
        {`
          .Toastify__toast-container {
            font-family: 'Inter', sans-serif;
            z-index: 9999;
          }
          .Toastify__toast {
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .Toastify__toast--success {
            background-color: #6d28d9; /* purple-700 */
            color: #f5f3ff; /* purple-50 */
            border: 1px solid #7c3aed; /* purple-600 */
          }
          .Toastify__toast--error {
            background-color: #be185d; /* rose-700 */
            color: #f5f3ff; /* purple-50 */
            border: 1px solid #e11d48; /* rose-600 */
          }
          .Toastify__progress-bar {
            background-color: #a78bfa; /* purple-400 */
          }
          .Toastify__close-button {
            color: #f5f3ff; /* purple-50 */
            opacity: 0.7;
          }
          .Toastify__close-button:hover {
            opacity: 1;
          }
        `}
          </style>
          {/* Navbar component */}
          <ResponsiveNavbar />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]"> {/* Adjusted min-h to account for navbar height */}
        {/* PaymentForm component */}
        <PaymentForm />
      </main>

      {/* ToastContainer for react-toastify notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000} // Notifications close after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}