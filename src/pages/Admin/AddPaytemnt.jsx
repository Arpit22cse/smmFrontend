import ResponsiveNavbar from '../../components/NavBar'
import PaymentForm from '../../components/PaymentForm'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddPayment(){
    return (
    // Set a dark background and text color for the entire app
   <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-gray-100 font-inter antialiased">
      {/* Inline CSS for react-toastify and custom theme colors */}
      <style>
        {`
          /* Custom Theme Colors */
          .bg-dark-background { background-color: #1a1a1a; }
          .bg-dark-card { background-color: #2a2a2a; }
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
            border-radius: 0.5rem;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            background-color: rgba(0, 0, 0, 0.9);
            border: 1px solid rgba(76, 29, 149, 0.3);
            color: #f5f3ff;
          }
          .Toastify__toast--success {
            background-color: rgba(0, 0, 0, 0.9);
            border-color: #10b981;
            color: #f5f3ff;
          }
          .Toastify__toast--error {
            background-color: rgba(0, 0, 0, 0.9);
            border-color: #ef4444;
            color: #f5f3ff;
          }
          .Toastify__progress-bar {
            background-color: #a78bfa;
          }
          .Toastify__close-button {
            color: #f5f3ff;
            opacity: 0.7;
          }
          .Toastify__close-button:hover {
            opacity: 1;
          }
        `}
      </style>

      {/* Navbar at the top of the page */}
      <ResponsiveNavbar />

      {/* Main content area, centering the PaymentForm */}
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <PaymentForm />
      </main>

      {/* ToastContainer for react-toastify notifications */}
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
      />
    </div>
  );
}