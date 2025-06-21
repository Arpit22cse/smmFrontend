import { Loader2, Plus, Edit } from 'lucide-react';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import SMMServiceForm from '../../components/SMMServiceForm';

import useServiceManagement from '../../hooks/useServiceManagement';

import ResponsiveNavbar from '../../components/NavBar';



export default function ServiceManager() {

const {

services, // General services (used for overall loading check)

customServices, // Services for update dropdown

loading, // General loading for initial services fetch and form submissions

loadingCustomServices, // Specific loading for custom services (update dropdown)

mode,

setMode,

selectedServiceRefId,

formData,

handleSelectServiceForUpdate,

handleChange,

handleDuplicateService,

handleSubmit,

handleClearForm,

} = useServiceManagement();



// Show a full-screen loader if the initial general services are still loading

if (loading && services.length === 0) {

return (

<>

{/* <ResponsiveNavbar/> */}

<div className="flex items-center justify-center min-h-screen bg-gray-950 text-gray-100">

<Loader2 className="animate-spin h-10 w-10 text-purple-500" />

<span className="ml-4 text-xl">Loading application data...</span>

</div>

</>

);

}



// Render the initial home page

if (mode === 'initial') {

return (

<>

<ResponsiveNavbar />

<div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">

<h1 className="text-3xl sm:text-4xl font-extrabold text-center text-purple-400 mb-10 tracking-wider"> {/* Enhanced heading */}

SMM Service Operations

</h1>

<div className="flex flex-col sm:flex-row gap-6 w-full max-w-sm sm:max-w-md"> {/* Constrained width for buttons */}

<button

onClick={() => {

setMode('create_new');

handleClearForm(); // Clear any previous form data

}}

className="inline-flex items-center px-8 py-4 border border-transparent text-base sm:text-lg font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 w-full justify-center transform hover:scale-105"

>

<Plus className="h-6 w-6 mr-3" /> Create New Service

</button>

<button

onClick={() => {

setMode('update_existing');

handleClearForm(); // Clear any previous form data

// customServices will be fetched by useEffect when mode becomes 'update_existing'

}}

className="inline-flex items-center px-8 py-4 border border-transparent text-base sm:text-lg font-semibold rounded-2xl shadow-lg text-white bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 w-full justify-center transform hover:scale-105"

>

<Edit className="h-6 w-6 mr-3" /> Update Existing Service

</button>

</div>

<ToastContainer

position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false}

closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"

/>

</div>

</>

);

}



// Render the form if mode is 'create_new' or 'update_existing'

return (

<>

<ResponsiveNavbar />

<div className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">

<ToastContainer

position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false}

closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark"

/>

<SMMServiceForm

services={services} // Passed for context but not directly used in dropdown

customServices={customServices} // Services for the update dropdown

loading={loading} // General loading for form submission

loadingCustomServices={loadingCustomServices} // Specific loading for custom services dropdown

mode={mode} // Pass mode to the form component

selectedServiceRefId={selectedServiceRefId}

formData={formData}

handleSelectServiceForUpdate={handleSelectServiceForUpdate}

handleChange={handleChange}

handleDuplicateService={handleDuplicateService}

handleSubmit={handleSubmit}

handleClearForm={handleClearForm}

setMode={setMode} // Pass setMode to form for back navigation

/>

</div>

</>

);

}