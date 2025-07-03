import React, { useState , useEffect} from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateServicePage from './CreateServicePage';
import UpdateServicePage from './UpdateServicePage';
import ServiceOperationsDashboard from './CreateServiceOperationDashboard';
import ResponsiveNavbar from '../../components/NavBar';
import { serviceApi } from '../../service/api';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

function ServiceManagerApp() {
  const [pageMode, setPageMode] = useState('dashboard');

  const [allServices, setAllServices] = useState([]);
  const [customServices, setCustomServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Initial fetch for all services (used by create and update for validation/duplication)
  useEffect(() => {
    const loadAllServices = async () => {
      setLoadingServices(true);
      setFetchError(null);
      try {
        const result = await serviceApi.getServices();
        if (result.success) {
          setAllServices(result.data);
          toast.success("General services catalog loaded.", { theme: "dark" });
        } else {
          setFetchError("Failed to load general services: " + result.message);
          toast.error("Failed to load general services: " + result.message, { theme: "dark" });
        }
      } catch (err) {
        console.error("Error loading general services:", err);
        setFetchError("An error occurred while loading general services.");
        toast.error("An error occurred while loading general services.", { theme: "dark" });
      } finally {
        setLoadingServices(false);
      }
    };
    loadAllServices();
  }, []);

  // Show a full-screen loader if initial services are still loading
  if (loadingServices && allServices.length === 0 && pageMode === 'dashboard') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">
        <Loader2 className="animate-spin h-10 w-10 text-purple-500" />
        <span className="ml-4 text-xl">Loading application data...</span>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true}
        closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"
      />

      {pageMode === 'dashboard' && (
        <ServiceOperationsDashboard setPageMode={setPageMode} />
      )}

      {pageMode === 'create_new' && (
        <CreateServicePage
          setPageMode={setPageMode}
          allServices={allServices}
          setAllServices={setAllServices}
        />
      )}

      {pageMode === 'update_existing' && (
        <UpdateServicePage
          setPageMode={setPageMode}
          allServices={allServices}
          setAllServices={setAllServices}
          customServices={customServices}
          setCustomServices={setCustomServices}
        />
      )}
    </>
  );
}

export default ServiceManagerApp;