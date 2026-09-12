import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import authService from '../services/authService';
import { socket } from '../services/socket';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load persisted auth state on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('farmiax_user');
      const storedToken = localStorage.getItem('farmiax_access_token');
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('farmiax_user');
      localStorage.removeItem('farmiax_access_token');
      localStorage.removeItem('farmiax_refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  // Socket Connection & Real-time Listeners
  useEffect(() => {
    if (user) {
      socket.connect();
      socket.emit('register', user._id || user.id);

      const handleNewOrder = (data) => {
        toast.success(`🚜 ${data.message}`);
      };

      const handleStatusUpdate = (data) => {
        toast.success(`📦 ${data.message}`);
      };

      socket.on('new_order', handleNewOrder);
      socket.on('order_status_update', handleStatusUpdate);

      return () => {
        socket.off('new_order', handleNewOrder);
        socket.off('order_status_update', handleStatusUpdate);
        socket.disconnect();
      };
    }
  }, [user]);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    const { user: userData, accessToken, refreshToken } = res.data;

    localStorage.setItem('farmiax_access_token', accessToken);
    localStorage.setItem('farmiax_refresh_token', refreshToken);
    localStorage.setItem('farmiax_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const googleLogin = useCallback(async (data) => {
    const res = await authService.googleLogin(data);
    const { user: userData, accessToken, refreshToken } = res.data;

    localStorage.setItem('farmiax_access_token', accessToken);
    localStorage.setItem('farmiax_refresh_token', refreshToken);
    localStorage.setItem('farmiax_user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  }, []);

  const register = useCallback(async (userData) => {
    const res = await authService.register(userData);
    return res;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if API call fails, clear local state
    } finally {
      localStorage.removeItem('farmiax_access_token');
      localStorage.removeItem('farmiax_refresh_token');
      localStorage.removeItem('farmiax_user');
      setUser(null);
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('farmiax_user', JSON.stringify(newUser));
  }, [user]);

  const isAuthenticated = !!user;
  const isCustomer = user?.role === 'customer' || user?.role === 'both';
  const isFarmer = user?.role === 'farmer' || user?.role === 'both';

  const value = {
    user,
    loading,
    isAuthenticated,
    isCustomer,
    isFarmer,
    login,
    googleLogin,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
