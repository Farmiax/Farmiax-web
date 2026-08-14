import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, isCustomer, isFarmer, loading } = useAuth();

  if (loading) {
    return (
      <div className="page-loader">
        <div className="loader-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    if (isCustomer) return <Navigate to="/customer" replace />;
    if (isFarmer) return <Navigate to="/farmer/dashboard" replace />;
  }

  return children;
};

export default GuestRoute;
