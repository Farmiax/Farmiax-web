import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import GuestRoute from './routes/GuestRoute';

import LandingPage from './pages/landing/LandingPage';
import AuthSelection from './pages/auth/AuthSelection';
import CustomerAuth from './pages/auth/CustomerAuth';
import FarmerSignIn from './pages/auth/FarmerSignIn';
import FarmerSignUp from './pages/auth/FarmerSignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

import CustomerShop from './pages/customer/CustomerShop';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerCheckout from './pages/customer/CustomerCheckout';
import OrderSuccess from './pages/customer/OrderSuccess';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerWishlist from './pages/customer/CustomerWishlist';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerProductDetails from './pages/customer/CustomerProductDetails';
import CustomerFarmers from './pages/customer/CustomerFarmers';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerSettings from './pages/customer/CustomerSettings';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerInventory from './pages/farmer/FarmerInventory';
import FarmerAnalytics from './pages/farmer/FarmerAnalytics';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<GuestRoute><AuthSelection mode="login" /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><AuthSelection mode="register" /></GuestRoute>} />
            <Route path="/customer/signin" element={<GuestRoute><CustomerAuth initialMode="signin" /></GuestRoute>} />
            <Route path="/customer/signup" element={<GuestRoute><CustomerAuth initialMode="signup" /></GuestRoute>} />
            <Route path="/farmer/signin" element={<GuestRoute><FarmerSignIn /></GuestRoute>} />
            <Route path="/farmer/signup" element={<GuestRoute><FarmerSignUp /></GuestRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/customer" element={<Navigate to="/customer/profile" replace />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/products" element={<FarmerProducts />} />
            <Route path="/farmer/orders" element={<FarmerOrders />} />
            <Route path="/farmer/inventory" element={<FarmerInventory />} />
            <Route path="/farmer/analytics" element={<FarmerAnalytics />} />
            <Route path="/customer/shop" element={<CustomerShop />} />
            <Route path="/customer/product/:id" element={<CustomerProductDetails />} />
            <Route path="/customer/cart" element={<CustomerCart />} />
            <Route path="/customer/checkout" element={<CustomerCheckout />} />
            <Route path="/customer/order-success" element={<OrderSuccess />} />
            <Route path="/customer/track-order" element={<TrackOrder />} />
            <Route path="/customer/track-order/:id" element={<TrackOrder />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            <Route path="/customer/wishlist" element={<CustomerWishlist />} />
            <Route path="/customer/farmers" element={<CustomerFarmers />} />
            <Route path="/customer/notifications" element={<CustomerNotifications />} />
            <Route path="/customer/settings" element={<CustomerSettings />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />

            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
