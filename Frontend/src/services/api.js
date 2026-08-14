import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('farmiax_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('farmiax_refresh_token');
        if (!refreshToken) {
          // No refresh token — force logout
          localStorage.removeItem('farmiax_access_token');
          localStorage.removeItem('farmiax_refresh_token');
          localStorage.removeItem('farmiax_user');
          window.location.href = '/';
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_BASE_URL}/users/refresh_token`, {
          refreshToken,
        });

        if (res.data?.data?.accessToken) {
          localStorage.setItem('farmiax_access_token', res.data.data.accessToken);
          localStorage.setItem('farmiax_refresh_token', res.data.data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('farmiax_access_token');
        localStorage.removeItem('farmiax_refresh_token');
        localStorage.removeItem('farmiax_user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
