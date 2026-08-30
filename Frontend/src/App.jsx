import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import GuestRoute from './routes/GuestRoute';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleProtectedRoute from './routes/RoleProtectedRoute';

// Landing & Auth Pages
import LandingPage from './pages/landing/LandingPage';
import AuthSelection from './pages/auth/AuthSelection';
import CustomerAuth from './pages/auth/CustomerAuth';
import FarmerSignIn from './pages/auth/FarmerSignIn';
import FarmerSignUp from './pages/auth/FarmerSignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import NotFound from './pages/error/NotFound';
import Unauthorized from './pages/error/Unauthorized';

// Customer Pages
import CustomerShop from './pages/customer/CustomerShop';
import CustomerCart from './pages/customer/CustomerCart';
import CustomerCheckout from './pages/customer/CustomerCheckout';
import OrderSuccess from './pages/customer/OrderSuccess';
import TrackOrder from './pages/customer/TrackOrder';
import CustomerOrders from './pages/customer/CustomerOrders';
import CustomerWishlist from './pages/customer/CustomerWishlist';
import CustomerProfile from './pages/customer/CustomerProfile';
import CustomerAccountProfile from './pages/customer/CustomerAccountProfile';
import CustomerProductDetails from './pages/customer/CustomerProductDetails';
import CustomerFarmers from './pages/customer/CustomerFarmers';
import CustomerNotifications from './pages/customer/CustomerNotifications';
import CustomerSettings from './pages/customer/CustomerSettings';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import FarmerProducts from './pages/farmer/FarmerProducts';
import FarmerOrders from './pages/farmer/FarmerOrders';
import FarmerInventory from './pages/farmer/FarmerInventory';
import FarmerAnalytics from './pages/farmer/FarmerAnalytics';
import FarmerEarnings from './pages/farmer/FarmerEarnings';
import FarmerPayouts from './pages/farmer/FarmerPayouts';
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmerSettings from './pages/farmer/FarmerSettings';
import FarmerCustomers from './pages/farmer/FarmerCustomers';
import FarmerReviews from './pages/farmer/FarmerReviews';
import FarmerMessages from './pages/farmer/FarmerMessages';
import FarmerNotifications from './pages/farmer/FarmerNotifications';

// Info & Policy Pages
import AboutUs from './pages/info/AboutUs';
import FAQ from './pages/info/FAQ';
import ContactSupport from './pages/info/ContactSupport';
import PrivacyPolicy from './pages/info/PrivacyPolicy';
import TermsConditions from './pages/info/TermsConditions';
import ShippingPolicy from './pages/info/ShippingPolicy';
import ReturnPolicy from './pages/info/ReturnPolicy';

// Admin Suite Pages & Guard
import AdminProtectedRoute from './routes/AdminProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminFarmers from './pages/admin/AdminFarmers';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
            <Routes>
              {/* Landing & Informational (Public) */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<ContactSupport />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route path="/returns" element={<ReturnPolicy />} />

              {/* Authentication Routes (Guest Only) */}
              <Route path="/login" element={<GuestRoute><AuthSelection mode="login" /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><AuthSelection mode="register" /></GuestRoute>} />
              <Route path="/customer/signin" element={<GuestRoute><CustomerAuth initialMode="signin" /></GuestRoute>} />
              <Route path="/customer/signup" element={<GuestRoute><CustomerAuth initialMode="signup" /></GuestRoute>} />
              <Route path="/farmer/signin" element={<GuestRoute><FarmerSignIn /></GuestRoute>} />
              <Route path="/farmer/signup" element={<GuestRoute><FarmerSignUp /></GuestRoute>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Customer Routes (Protected: customer role) */}
              <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="/customer/dashboard" element={<RoleProtectedRoute requiredRole="customer"><CustomerProfile /></RoleProtectedRoute>} />
              <Route path="/customer/profile" element={<RoleProtectedRoute requiredRole="customer"><CustomerProfile /></RoleProtectedRoute>} />
              <Route path="/customer/personal-profile" element={<RoleProtectedRoute requiredRole="customer"><CustomerAccountProfile /></RoleProtectedRoute>} />
              <Route path="/customer/shop" element={<RoleProtectedRoute requiredRole="customer"><CustomerShop /></RoleProtectedRoute>} />
              <Route path="/customer/product/:id" element={<RoleProtectedRoute requiredRole="customer"><CustomerProductDetails /></RoleProtectedRoute>} />
              <Route path="/customer/cart" element={<RoleProtectedRoute requiredRole="customer"><CustomerCart /></RoleProtectedRoute>} />
              <Route path="/customer/checkout" element={<RoleProtectedRoute requiredRole="customer"><CustomerCheckout /></RoleProtectedRoute>} />
              <Route path="/customer/order-success" element={<RoleProtectedRoute requiredRole="customer"><OrderSuccess /></RoleProtectedRoute>} />
              <Route path="/customer/track-order" element={<RoleProtectedRoute requiredRole="customer"><TrackOrder /></RoleProtectedRoute>} />
              <Route path="/customer/track-order/:id" element={<RoleProtectedRoute requiredRole="customer"><TrackOrder /></RoleProtectedRoute>} />
              <Route path="/customer/orders" element={<RoleProtectedRoute requiredRole="customer"><CustomerOrders /></RoleProtectedRoute>} />
              <Route path="/customer/wishlist" element={<RoleProtectedRoute requiredRole="customer"><CustomerWishlist /></RoleProtectedRoute>} />
              <Route path="/customer/farmers" element={<RoleProtectedRoute requiredRole="customer"><CustomerFarmers /></RoleProtectedRoute>} />
              <Route path="/customer/notifications" element={<RoleProtectedRoute requiredRole="customer"><CustomerNotifications /></RoleProtectedRoute>} />
              <Route path="/customer/settings" element={<RoleProtectedRoute requiredRole="customer"><CustomerSettings /></RoleProtectedRoute>} />
              <Route path="/customer/setting" element={<RoleProtectedRoute requiredRole="customer"><CustomerSettings /></RoleProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><CustomerSettings /></ProtectedRoute>} />

              {/* Farmer Routes (Protected: farmer role) */}
              <Route path="/farmer" element={<Navigate to="/farmer/dashboard" replace />} />
              <Route path="/farmer/dashboard" element={<RoleProtectedRoute requiredRole="farmer"><FarmerDashboard /></RoleProtectedRoute>} />
              <Route path="/farmer/products" element={<RoleProtectedRoute requiredRole="farmer"><FarmerProducts /></RoleProtectedRoute>} />
              <Route path="/farmer/orders" element={<RoleProtectedRoute requiredRole="farmer"><FarmerOrders /></RoleProtectedRoute>} />
              <Route path="/farmer/inventory" element={<RoleProtectedRoute requiredRole="farmer"><FarmerInventory /></RoleProtectedRoute>} />
              <Route path="/farmer/analytics" element={<RoleProtectedRoute requiredRole="farmer"><FarmerAnalytics /></RoleProtectedRoute>} />
              <Route path="/farmer/earnings" element={<RoleProtectedRoute requiredRole="farmer"><FarmerEarnings /></RoleProtectedRoute>} />
              <Route path="/farmer/payouts" element={<RoleProtectedRoute requiredRole="farmer"><FarmerPayouts /></RoleProtectedRoute>} />
              <Route path="/farmer/profile" element={<RoleProtectedRoute requiredRole="farmer"><FarmerProfile /></RoleProtectedRoute>} />
              <Route path="/farmer/settings" element={<RoleProtectedRoute requiredRole="farmer"><FarmerSettings /></RoleProtectedRoute>} />
              <Route path="/farmer/customers" element={<RoleProtectedRoute requiredRole="farmer"><FarmerCustomers /></RoleProtectedRoute>} />
              <Route path="/farmer/reviews" element={<RoleProtectedRoute requiredRole="farmer"><FarmerReviews /></RoleProtectedRoute>} />
              <Route path="/farmer/messages" element={<RoleProtectedRoute requiredRole="farmer"><FarmerMessages /></RoleProtectedRoute>} />
              <Route path="/farmer/notifications" element={<RoleProtectedRoute requiredRole="farmer"><FarmerNotifications /></RoleProtectedRoute>} />

              {/* Master Admin Suite Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/products" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
              <Route path="/admin/orders" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
              <Route path="/admin/farmers" element={<AdminProtectedRoute><AdminFarmers /></AdminProtectedRoute>} />
              <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />

              {/* Error Routes */}
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
