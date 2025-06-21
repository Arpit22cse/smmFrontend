import { useState, useEffect, useCallback } from 'react';

import { toast } from 'react-toastify';

import {serviceApi} from '../service/api';



const useServiceManagement = () => {

const [services, setServices] = useState([]); // General catalog of all services

const [customServices, setCustomServices] = useState([]); // Services specifically for updating

const [loading, setLoading] = useState(false); // General loading indicator for API calls

const [loadingCustomServices, setLoadingCustomServices] = useState(false); // Specific loading for custom services

const [mode, setMode] = useState('initial'); // 'initial', 'create_new', 'update_existing'



// selectedServiceRefId stores the 'service' (backend's unique ID) for existing services,

// used specifically in 'update_existing' mode's dropdown.

const [selectedServiceRefId, setSelectedServiceRefId] = useState('');



const [formData, setFormData] = useState({

schemaServiceId: '',

schemaServiceRef: '',

name: '',

internalName: '',

type: '',

category: '',

rate: '',

min: '',

max: '',

refill: false,

cancel: false,

});



// Fetch general services on component mount (initial load)

useEffect(() => {

const loadGeneralServices = async () => {

setLoading(true);

const result = await serviceApi.getServices();

if (result.success) {

setServices(result.data);

toast.success("General services catalog loaded.");

} else {

toast.error("Failed to load general services: " + result.message);

}

setLoading(false);

};

loadGeneralServices();

}, []); // Run once on mount



// Fetch custom services only when mode changes to 'update_existing'

useEffect(() => {

if (mode === 'update_existing' && customServices.length === 0 && !loadingCustomServices) {

const loadCustomServices = async () => {

setLoadingCustomServices(true);

const result = await serviceApi.customServices();

if (result.success) {

setCustomServices(result.data);

toast.success("Custom services for update loaded!");

} else {

toast.error("Failed to load custom services for update: " + result.message);

}

setLoadingCustomServices(false);

};

loadCustomServices();

}

}, [mode, customServices.length, loadingCustomServices]); // Dependencies: mode, customServices.length (to avoid re-fetching if already loaded), loadingCustomServices



// Handler for dropdown selection in update mode

const handleSelectServiceForUpdate = useCallback((e) => {

const serviceRef = e.target.value;

setSelectedServiceRefId(serviceRef);





if (serviceRef === '') { // Clear form if "Select a Service" is chosen

setFormData({

schemaServiceId: '', schemaServiceRef: '', name: '', internalName: '', type: '', category: '',

rate: '', min: '', max: '', refill: false, cancel: false,

});

} else {

// Search within customServices for the selected item

let serviceToEdit = customServices.find(service => service.service === serviceRef);

if(!serviceToEdit){

serviceToEdit = services.find(service => service.service === serviceRef)


console.log(serviceToEdit+"service to edit")

}

if (serviceToEdit) {

setFormData({

schemaServiceId: serviceToEdit.serviceId || '',

schemaServiceRef: serviceToEdit.service || '',

name: serviceToEdit.internalName || '',

internalName: serviceToEdit.name || '',

type: serviceToEdit.type || '',

category: serviceToEdit.category || '',

rate: serviceToEdit.rate !== undefined ? String(serviceToEdit.rate) : '',

min: serviceToEdit.min || '',

max: serviceToEdit.max || '',

refill: serviceToEdit.refill || false,

cancel: serviceToEdit.cancel || false,

});

}

}

}, [customServices]); // Dependency changed to customServices



// Handle form input changes

const handleChange = useCallback((e) => {

const { name, value, type, checked } = e.target;

setFormData(prevData => ({

...prevData,

[name]: type === 'checkbox' ? checked : value,

}));

}, []);



// Handle duplication of a service: sets mode to 'create_new' and pre-fills form

const handleDuplicateService = useCallback(() => {

if (!selectedServiceRefId || selectedServiceRefId === '') {

toast.error("Please select an existing service to duplicate.");

return;

}



// Find the service to duplicate from customServices

const serviceToDuplicate = customServices.find(service => service.service === selectedServiceRefId);

if (serviceToDuplicate) {

setFormData({

...serviceToDuplicate,

schemaServiceId: '', // Clear for new input

schemaServiceRef: '', // Clear for new input

});

setMode('create_new'); // Switch to create mode

setSelectedServiceRefId(''); // Clear selection in update dropdown

toast.info("Ready to duplicate service. Enter new Service ID and User Defined Unique ID.");

}

}, [selectedServiceRefId, customServices]); // Dependency changed to customServices



// Handle form submission (create or update)

const handleSubmit = useCallback(async (e) => {

e.preventDefault();

setLoading(true); // Use general loading for submission



const submittedServiceData = {

serviceId: formData.schemaServiceId,

service: formData.schemaServiceRef,

name: formData.name,

internalName: formData.internalName,

type: formData.type,

category: formData.category,

rate: Number(formData.rate),

min: formData.min,

max: formData.max,

refill: formData.refill,

cancel: formData.cancel,

};



// Basic frontend validation for required fields

if (!submittedServiceData.serviceId || !submittedServiceData.service || !submittedServiceData.name || isNaN(submittedServiceData.rate)) {

toast.error("Service ID, User Defined Unique ID, Name, and Rate are required.");

setLoading(false);

return;

}



let result;

try {

if (mode === 'create_new') {

// Frontend validation for unique IDs against the general 'services' list (catalog)



result = await serviceApi.createService(submittedServiceData);

console.log(result);

if (result.success) {

// Update both services lists if successful

setServices(prevServices => [...prevServices, { ...result.data, id: result.data.service }]);

// No need to immediately update customServices, it will be refetched if update mode is entered again

toast.success(`Service added successfully!`);

await new Promise(res => setTimeout(res, 3000));



} else {

toast.error("Failed to add service: " + result.message);

await new Promise(res => setTimeout(res, 3000));



}

} else if (mode === 'update_existing') {

// Original service for validation taken from customServices

const originalService = customServices.find(s => s.service === selectedServiceRefId);

if (originalService) {

// Frontend min/max validation

if (Number(submittedServiceData.min) < Number(originalService.min)) {

toast.error(`Min value cannot be smaller than original min (${originalService.min}).`);

setLoading(false);

return;

}

if (Number(submittedServiceData.max) > Number(originalService.max)) {

toast.error(`Max value cannot be greater than original max (${originalService.max}).`);

setLoading(false);

return;

}

}



// Only send fields relevant for update to backend (service is the key)

const updatePayload = {

serviceId: submittedServiceData.serviceId, // Unique identifier to find service on backend

rate: submittedServiceData.rate,

min: submittedServiceData.min,

max: submittedServiceData.max,

refill: submittedServiceData.refill,

cancel: submittedServiceData.cancel,

};

result = await serviceApi.updateService(updatePayload);

if (result.success) {

// Update both services lists if successful

setServices(prevServices =>

prevServices.map(service =>

service.service === selectedServiceRefId ? { ...service, ...updatePayload } : service

)

);

setCustomServices(prevCustomServices =>

prevCustomServices.map(service =>

service.service === selectedServiceRefId ? { ...service, ...updatePayload } : service

)

);

toast.success(`Service "${originalService.name}" (ID: ${originalService.serviceId}, Unique Ref: ${originalService.service}) updated successfully!`);

await new Promise(res => setTimeout(res, 3000));



} else {

toast.error("Failed to update service: " + result.message);

await new Promise(res => setTimeout(res, 3000));



}

}

} catch (error) {

console.error("Submission Error:", error);

toast.error(`An unexpected error occurred: ${error.message}`);

} finally {

setLoading(false);

setFormData({ // Reset form after submission

schemaServiceId: '', schemaServiceRef: '', name: '', internalName: '', type: '', category: '',

rate: '', min: '', max: '', refill: false, cancel: false,

});

setSelectedServiceRefId(''); // Clear dropdown selection

setMode('initial'); // Return to initial screen

}

}, [mode, selectedServiceRefId, formData, services, customServices]); // Added customServices to dependencies



const handleClearForm = useCallback(() => {

setFormData({

schemaServiceId: '', schemaServiceRef: '', name: '', internalName: '', type: '', category: '',

rate: '', min: '', max: '', refill: false, cancel: false,

});

setSelectedServiceRefId(''); // Clear dropdown in update mode

}, []);



return {

services, // General services for validation

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

};

};

export default useServiceManagement;