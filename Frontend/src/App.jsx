import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import GuestRoute from './routes/GuestRoute';

// Core Landing & Auth Pages
import LandingPage from './pages/landing/LandingPage';
import AuthSelection from './pages/auth/AuthSelection';
import CustomerAuth from './pages/auth/CustomerAuth';
import FarmerSignIn from './pages/auth/FarmerSignIn';
import FarmerSignUp from './pages/auth/FarmerSignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

// Customer / Buyer Pages
import CustomerShop from './pages/customer/CustomerShop';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerCheckout from './pages/customer/CustomerCheckout';
import OrderSuccess from './pages/customer/OrderSuccess';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerWishlist from './pages/customer/CustomerWishlist';
import CustomerProfile from './pages/customer/CustomerProfile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing & Public Pages */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<GuestRoute><AuthSelection mode="login" /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><AuthSelection mode="register" /></GuestRoute>} />
            <Route path="/customer/signin" element={<GuestRoute><CustomerAuth initialMode="signin" /></GuestRoute>} />
            <Route path="/customer/signup" element={<GuestRoute><CustomerAuth initialMode="signup" /></GuestRoute>} />
            <Route path="/farmer/signin" element={<GuestRoute><FarmerSignIn /></GuestRoute>} />
            <Route path="/farmer/signup" element={<GuestRoute><FarmerSignUp /></GuestRoute>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Customer / Buyer Platform Routes */}
            <Route path="/customer" element={<Navigate to="/customer/profile" replace />} />
            <Route path="/customer/shop" element={<CustomerShop />} />
            <Route path="/customer/cart" element={<CustomerCart />} />
            <Route path="/customer/checkout" element={<CustomerCheckout />} />
            <Route path="/customer/order-success" element={<OrderSuccess />} />
            <Route path="/customer/track-order" element={<TrackOrder />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
            <Route path="/customer/wishlist" element={<CustomerWishlist />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />

            {/* Error Pages */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
