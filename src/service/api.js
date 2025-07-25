import axios from 'axios'
// Replace with your API base URL
const API_BASE_URL = 'https://smmbackend-hayt.onrender.com';

// Helper for handling API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (response.status!==200) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// Authentication APIs
export const authApi = {
  login: async ({ userId, password }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/login`,
        { userId, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Login failed" };
      }
    } catch (error) {
      console.error('API Error (login):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  me: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
      if (response.status === 200) {
        const { userId, role, wallet } = response.data;
        return {
          success: true,
          data: {
            isAuthenticated: true,
            user: { id: userId, role, wallet }
          }
        };
      } else {
        return {
          success: false,
          data: {
            isAuthenticated: false,
            user: { id: '', role: '', wallet: 0 }
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        data: {
          isAuthenticated: false,
          user: { id: '', role: '', wallet: 0 }
        }
      };
    }
  },
};
export const serviceApi = {
  getServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/getServices`, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data.data};
      } else {
        return { success: false, message: response.data.message || "Failed to load services" };
      }
    } catch (error) {
      console.error('API Error (getServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/createService`, serviceData, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data};
      } else {
        return { success: false, message: response.data.message || "Failed to create service" };
      }
    } catch (error) {
      console.error('API Error (createService):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  updateService: async (serviceData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/updateService`, serviceData, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to update service" };
      }
    } catch (error) {
      console.error('API Error (updateService):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  customServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/getCustomServices`, { withCredentials: true });
      
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Failed to load custom services" };
      }
    } catch (error) {
      console.error('API Error (customServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  changePassword: async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/user/changePassword`, data, { withCredentials: true });
      
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Failed to load custom services" };
      }
    } catch (error) {
      console.error('API Error (customServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  addBalance: async (data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/addBalance`, data, { withCredentials: true });
      
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Failed to load custom services" };
      }
    } catch (error) {
      console.error('API Error (customServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  changeUserPassword: async(data) => {
    try {

      const response = await axios.post(`${API_BASE_URL}/admin/changeUserPassword`, data, { withCredentials: true });

      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        console.log(response);
        return { success: false, message: response.data.message || "Failed to load custom services" };
      }
    } catch (error) {
      console.error('API Error (customServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  createUser: async(data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/createUser`, data, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to create user" };
      }
    } catch (error) {
      console.error('API Error (createUser):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getUserServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/userServices`, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Failed to load user services" };
      }
    } catch (error) {
      console.error('API Error (getUserServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  placeOrder: async (orderData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/placeOrder`, orderData, { withCredentials: true });
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.data.error || "Failed to place order" };
      }
    } catch (error) {
      console.error('API Error (placeOrder):', error);
      return { success: false, message: error.response?.data?.error || error.message };
    }
  },

  getTransactions: async(page,limit) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/getTransactions`, {
        params: { page, limit },
        withCredentials: true
      });
      if (response.status === 200) {
        return { success: true, data: response.data.data};
      } else {
        return { success: false, message: response.data.message || "Failed to load transactions" };
      }
    } catch (error) {
      console.error('API Error (getTransactions):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getOrders: async (page,limit) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/getOrders`, {
        params: { page, limit },
        withCredentials: true
      });
      if (response.status === 200) {
        return { success: true, data: response.data.data };
      } else {
        return { success: false, message: response.data.message || "Failed to load orders" };
      }
    } catch (error) {
      console.error('API Error (getOrders):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  getUser: async (userId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/getUser`,
        { userId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data};
      } else {
        return { success: false, message: response.data.message || "Failed to load user" };
      }
    } catch (error) {
      console.error('API Error (getUser):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  addService: async ({userId, serviceId}) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/addService`,
        { userId, serviceId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to add service" };
      }
    } catch (error) {
      console.error('API Error (addService):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteService: async ({userId, serviceId}) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/deleteService`,
        { userId, serviceId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to delete service" };
      }
    } catch (error) {
      console.error('API Error (deleteService):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  deleteCustomServices: async ({serviceId }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/admin/deleteCustomServices`,
        { serviceId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to delete custom service" };
      }
    } catch (error) {
      console.error('API Error (deleteCustomServices):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  requestRefill: async (orderId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/requestRefill`,
        { orderId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to request refill" };
      }
    } catch (error) {
      console.error('API Error (requestRefill):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  checkRefillStatus: async (orderId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/requestRefillStatus`,
        { orderId },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to get refill status" };
      }
    } catch (error) {
      console.error('API Error (requestRefillStatus):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },

  checkOrderStatus: async (order) =>{
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/getOrderStatus`,
        { order },
        { withCredentials: true }
      );
      if (response.status === 200) {
        return { success: true, data: response.data };
      } else {
        return { success: false, message: response.data.message || "Failed to get order status" };
      }
    } catch (error) {
      console.error('API Error (getOrderStatus):', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
};