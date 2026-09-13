import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://farmiax-web-backend.onrender.com/api/v1';

const getAdminToken = () => localStorage.getItem('farmiax_admin_token');

const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 400,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('farmiax_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.token = token; // Required by backend admin.auth.js middleware
    }
    return config;
  },
  (error) => Promise.reject(error)
);

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('farmiax_admin_token');
      localStorage.removeItem('farmiax_admin_email');
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

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
    const res = await adminApi.get('/product/all-products');
    return res.data?.data || res.data || [];
  },

  // GET /product/product/:productId — Single product with populated farmer details
  getProductDetails: async (productId) => {
    const res = await adminApi.get(`/product/product/${productId}`);
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

    const res = await adminApi.post('/product/update', formData);
    return res.data?.data || res.data;
  },

  // DELETE /product/admin/:productId — Admin-authenticated product deletion
  deleteProduct: async (productId) => {
    const token = getAdminToken();
    try {
      const res = await adminApi.post(`/product/admin-delete/${productId}`, { token });
      return res.data?.data || res.data;
    } catch (postErr) {
      console.warn('POST admin-delete failed, trying DELETE fallback:', postErr);
      const res = await adminApi.delete(`/product/admin/${productId}`);
      return res.data?.data || res.data;
    }
  },

  // GET /order/getorders — Master list of all customer orders
  getAllOrders: async () => {
    const res = await adminApi.get('/order/getorders');
    return res.data?.data || res.data || [];
  },

  // PATCH /order/updatestatus — { orderId, status }
  updateOrderStatus: async (orderId, status) => {
    const res = await adminApi.patch('/order/updatestatus', { orderId, status });
    return res.data?.data || res.data;
  },

  // DELETE /order/updateorderrecord — { orderId }
  deleteOrder: async (orderId) => {
    const res = await adminApi.delete('/order/updateorderrecord', { data: { orderId } });
    return res.data?.data || res.data;
  },

  getAllFarmers: async () => {
    try {
      const res = await adminApi.get('/users/all-Farmers');
      return res.data?.data || res.data || [];
    } catch (err) {
      if (err.response?.status === 404) return [];
      throw err;
    }
  },
};

export default adminService;
