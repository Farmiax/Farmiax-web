import axios from 'axios';
import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://farmiax-web-backend.onrender.com/api/v1';

const getAdminToken = () => localStorage.getItem('farmiax_admin_token');

const adminService = {
  // POST /users/adminlogin — { email, password } -> { Token: token }
  login: async (email, password) => {
    const res = await axios.post(`${API_BASE_URL}/users/adminlogin`, { email, password });
    return res.data;
  },

  // Logout admin
  logout: () => {
    localStorage.removeItem('farmiax_admin_token');
    localStorage.removeItem('farmiax_admin_email');
  },

  // Check admin auth state
  isAdminAuthenticated: () => {
    return Boolean(getAdminToken());
  },

  // GET /product/all-products — All products across all farmers
  getAllProducts: async () => {
    const res = await api.get('/product/all-products');
    return res.data?.data || res.data || [];
  },

  // GET /product/product/:productId — Single product with populated farmer details
  getProductDetails: async (productId) => {
    const res = await api.get(`/product/product/${productId}`);
    return res.data?.data || res.data;
  },

  // POST /product/update — Update any product
  updateProduct: async (productData) => {
    let formData = productData;
    if (!(productData instanceof FormData)) {
      formData = new FormData();
      Object.keys(productData).forEach((key) => {
        if (key === 'image' && productData[key] instanceof File) {
          formData.append('image', productData[key]);
        } else if (productData[key] !== undefined && productData[key] !== null) {
          formData.append(key, productData[key]);
        }
      });
    }

    const res = await api.post('/product/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data?.data || res.data;
  },

  // DELETE /product/admin/:productId — Admin-authenticated product deletion
  // Requires header { token: <adminToken> }
  deleteProduct: async (productId) => {
    const token = getAdminToken();
    const res = await axios.delete(`${API_BASE_URL}/product/admin/${productId}`, {
      headers: { token },
    });
    return res.data?.data || res.data;
  },

  // GET /order/getorders — Master list of all customer orders
  getAllOrders: async () => {
    const res = await api.get('/order/getorders');
    return res.data?.data || res.data || [];
  },

  // PATCH /order/updatestatus — { orderId, status }
  updateOrderStatus: async (orderId, status) => {
    const res = await api.patch('/order/updatestatus', { orderId, status });
    return res.data?.data || res.data;
  },

  // DELETE /order/updateorderrecord — { orderId }
  deleteOrder: async (orderId) => {
    const res = await api.delete('/order/updateorderrecord', { data: { orderId } });
    return res.data?.data || res.data;
  },

  // GET /users/all-Farmers — All registered farmers with active/inactive status
  getAllFarmers: async () => {
    const res = await api.get('/users/all-Farmers');
    return res.data?.data || res.data || [];
  },
};

export default adminService;
