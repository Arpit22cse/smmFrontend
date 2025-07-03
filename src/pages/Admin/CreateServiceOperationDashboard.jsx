import React from "react";
import { Plus, Edit } from "lucide-react";
import ResponsiveNavbar from "../../components/NavBar";
// ResponsiveNavbar is handled by the parent ServiceManagerApp component,
// so it's intentionally omitted from ServiceOperationsDashboard to prevent duplication.

const ServiceOperationsDashboard = ({ setPageMode }) => {
  return (
    <>
    <ResponsiveNavbar/>
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center">

      

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-center mb-12 tracking-tight leading-tight
                     text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500
                     drop-shadow-lg animate-fadeInDown">
        SMM Service Operations Hub
      </h1>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-sm sm:max-w-xl">
        <button
          onClick={() => setPageMode('create_new')}
          className="inline-flex items-center px-10 py-5 border border-transparent text-lg sm:text-xl font-extrabold rounded-3xl shadow-xl hover:shadow-2xl
                     text-white bg-gradient-to-br from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950
                     focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900
                     transition-all duration-300 w-full justify-center transform hover:scale-105 active:scale-95
                     group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></span>
          <Plus className="h-7 w-7 mr-4 group-hover:rotate-6 transition-transform duration-300" />
          Create New Service
        </button>

        <button
          onClick={() => setPageMode('update_existing')}
          className="inline-flex items-center px-10 py-5 border border-transparent text-lg sm:text-xl font-extrabold rounded-3xl shadow-xl hover:shadow-2xl
                     text-white bg-gradient-to-br from-green-700 to-green-900 hover:from-green-800 hover:to-green-950
                     focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900
                     transition-all duration-300 w-full justify-center transform hover:scale-105 active:scale-95
                     group relative overflow-hidden"
        >
          <span className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity"></span>
          <Edit className="h-7 w-7 mr-4 group-hover:scale-110 transition-transform duration-300" />
          Update Existing Service
        </button>
      </div>
    </div>
    </>
  );
};

export default ServiceOperationsDashboard;