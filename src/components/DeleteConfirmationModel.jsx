import React from "react";
import { X } from "lucide-react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, service }) => {
    if (!isOpen || !service) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 p-6 rounded-lg shadow-2xl max-w-sm w-full border border-red-700 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold text-red-500 mb-4 text-center">Confirm Service Deletion</h2>
                <p className="text-gray-100 text-center mb-6">
                    Are you sure you want to delete the service: <br />
                    <span className="font-semibold text-purple-400">"{service.name}" (Unique ID: {service.service})</span>?
                    This action cannot be undone.
                </p>
                <div className="flex justify-around gap-4">
                    <button onClick={onClose} className="flex-1 py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition duration-300">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-300">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;