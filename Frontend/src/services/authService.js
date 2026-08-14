import api from './api';

const authService = {
  // POST /users/register — multipart/form-data (avatar optional)
  register: async (userData) => {
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === 'avatar' && userData[key]) {
        formData.append('avatar', userData[key]);
      } else if (userData[key] !== undefined && userData[key] !== null) {
        formData.append(key, userData[key]);
      }
    });

    const res = await api.post('/users/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // POST /users/login — { email, password }
  login: async (email, password) => {
    const res = await api.post('/users/login', { email, password });
    return res.data;
  },

  // POST /users/google-login — { email, fullName, avatar, role }
  googleLogin: async (data) => {
    const res = await api.post('/users/google-login', data);
    return res.data;
  },

  // POST /users/logout — requires JWT
  logout: async () => {
    const res = await api.post('/users/logout');
    return res.data;
  },

  // POST /users/refresh_token — { refreshToken }
  refreshToken: async (refreshToken) => {
    const res = await api.post('/users/refresh_token', { refreshToken });
    return res.data;
  },

  // POST /users/changed-password — { oldPassword, NewPassword }
  changePassword: async (oldPassword, NewPassword) => {
    const res = await api.post('/users/changed-password', { oldPassword, NewPassword });
    return res.data;
  },

  // PATCH /users/updated-account — profile fields
  updateProfile: async (data) => {
    const res = await api.patch('/users/updated-account', data);
    return res.data;
  },

  // PATCH /users/avatar — multipart/form-data
  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await api.patch('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // POST /users/forget-password — { email, password }
  forgotPassword: async (email, password) => {
    const res = await api.post('/users/forget-password', { email, password });
    return res.data;
  },

  // GET /users/all-Farmers
  getAllFarmers: async () => {
    const res = await api.get('/users/all-Farmers');
    return res.data;
  },
};

export default authService;
