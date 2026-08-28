import { Navigate } from 'react-router-dom';
import adminService from '../services/adminService';

const AdminProtectedRoute = ({ children }) => {
  const isAuth = adminService.isAdminAuthenticated();

  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
