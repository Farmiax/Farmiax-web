import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

// Async Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await authService.login(email, password);
      const { user, accessToken, refreshToken } = res.data;
      
      localStorage.setItem('farmiax_access_token', accessToken);
      localStorage.setItem('farmiax_refresh_token', refreshToken);
      localStorage.setItem('farmiax_user', JSON.stringify(user));
      
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Login failed');
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authService.googleLogin(data);
      const { user, accessToken, refreshToken } = res.data;
      
      localStorage.setItem('farmiax_access_token', accessToken);
      localStorage.setItem('farmiax_refresh_token', refreshToken);
      localStorage.setItem('farmiax_user', JSON.stringify(user));
      
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Google login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout API failed, proceeding to clear local state', err);
    } finally {
      localStorage.removeItem('farmiax_access_token');
      localStorage.removeItem('farmiax_refresh_token');
      localStorage.removeItem('farmiax_user');
    }
    return null;
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updatedData, { getState }) => {
    const { user } = getState().auth;
    const newUser = { ...user, ...updatedData };
    localStorage.setItem('farmiax_user', JSON.stringify(newUser));
    return newUser;
  }
);

// Initial State Initialization from LocalStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('farmiax_user');
    const storedToken = localStorage.getItem('farmiax_access_token');
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
  } catch (err) {
    localStorage.removeItem('farmiax_user');
    localStorage.removeItem('farmiax_access_token');
    localStorage.removeItem('farmiax_refresh_token');
  }
  return null;
};

const initialState = {
  user: loadUserFromStorage(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Google Login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      
      // Update User Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;
