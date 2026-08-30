import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import FarmerAIChatSupport from './FarmerAIChatSupport';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiBox, FiShoppingBag, FiTruck, FiUsers, FiDollarSign,
  FiBarChart2, FiCreditCard, FiStar, FiMessageSquare, FiUser,
  FiSettings, FiBell, FiSearch, FiLogOut, FiMenu, FiX, FiHelpCircle,
  FiChevronLeft, FiChevronRight
} from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';

const FarmerDashboardLayout = ({ children, activeNav = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('farmiax_farmer_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('farmiax_farmer_sidebar_open', JSON.stringify(newState));
  };

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileSidebarOpen]);

  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Dashboard', path: '/farmer/dashboard', icon: FiGrid },
    { label: 'Orders', path: '/farmer/orders', icon: FiBox },
    { label: 'Products', path: '/farmer/products', icon: FiShoppingBag },
    { label: 'Inventory', path: '/farmer/inventory', icon: FiTruck },
    { label: 'Customers', path: '/farmer/customers', icon: FiUsers },
    { label: 'Earnings', path: '/farmer/earnings', icon: FiDollarSign },
    { label: 'Analytics', path: '/farmer/analytics', icon: FiBarChart2 },
    { label: 'Payouts & KYC', path: '/farmer/payouts', icon: FiCreditCard },
    { label: 'Reviews', path: '/farmer/reviews', icon: FiStar },
    { label: 'Messages', path: '/farmer/messages', icon: FiMessageSquare },
    { label: 'Settings', path: '/farmer/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/farmer/signin');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    if (q.includes('order')) {
      navigate('/farmer/orders');
    } else if (q.includes('product') || q.includes('crop')) {
      navigate('/farmer/products');
    } else if (q.includes('inventory') || q.includes('stock')) {
      navigate('/farmer/inventory');
    } else if (q.includes('customer') || q.includes('buyer')) {
      navigate('/farmer/customers');
    } else if (q.includes('earning') || q.includes('revenue')) {
      navigate('/farmer/earnings');
    } else if (q.includes('analytic') || q.includes('report')) {
      navigate('/farmer/analytics');
    } else if (q.includes('payout') || q.includes('kyc')) {
      navigate('/farmer/payouts');
    } else if (q.includes('review') || q.includes('rating')) {
      navigate('/farmer/reviews');
    } else if (q.includes('message') || q.includes('chat')) {
      navigate('/farmer/messages');
    } else if (q.includes('setting') || q.includes('profile')) {
      navigate('/farmer/settings');
    } else {
      // Fallback if not specifically recognized, just clear or stay
      // but maybe just clear it
    }
    
    setSearchQuery('');
  };

  const farmerName = user?.fullName || 'Farmer Partner';
  const farmerInitials = farmerName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'FA';
  const farmTitle = user?.farmName || 'Organic Agro Farm';

  return (
    <div className="farmer-layout">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="farmer-mobile-overlay"
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`farmer-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''} ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div className="farmer-sidebar-logo">
          {isSidebarOpen ? (
            <Logo size="md" imgStyle={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.4))' }} />
          ) : (
            <Logo size="sm" imgStyle={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.4))' }} />
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
          </button>
        </div>

        <div className="farmer-verified-badge" style={{ padding: '0 16px 14px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(74, 222, 128, 0.45)', borderRadius: '12px', padding: '10px 14px' }}>
            <p style={{ margin: 0, fontSize: '11px', color: '#86EFAC', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>✓ Verified Producer</p>
            <p style={{ margin: '2px 0 0', fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{farmTitle}</p>
          </div>
        </div>

        <nav className="farmer-nav" style={{ flex: 1, overflowY: 'auto' }}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.label.toLowerCase() || location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`farmer-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <Icon style={{ marginRight: isSidebarOpen ? '10px' : '0', fontSize: '18px' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button 
            className="farmer-nav-item logout" 
            onClick={handleLogout}
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', padding: '12px 16px' }}
          >
            <FiLogOut style={{ marginRight: isSidebarOpen ? '10px' : '0', fontSize: '18px', color: '#F87171' }} />
            {isSidebarOpen && <span style={{ color: '#F87171', fontWeight: 700 }}>Logout Securely</span>}
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="farmer-main">
        {/* Top Header */}
        <header className="farmer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="farmer-mobile-hamburger"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'none',
                color: '#FFFFFF',
              }}
              aria-label="Open menu"
            >
              <FiMenu size={22} />
            </button>

            <form onSubmit={handleSearchSubmit} className="farmer-search">
              <FiSearch style={{ color: 'rgba(255,255,255,0.7)', marginRight: '8px' }} />
              <input
                type="text"
                placeholder="Search orders, crops, inventory..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="farmer-header-right">
            <button
              onClick={() => window.openFarmerSupportChat && window.openFarmerSupportChat()}
              className="farmer-header-ai-btn"
              title="AI Assistant Support"
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <i className="ri-customer-service-2-fill" style={{ fontSize: '18px' }}></i>
                <i className="ri-sparkling-fill" style={{ position: 'absolute', top: '-4px', right: '-6px', fontSize: '10px', color: '#FCE06D' }}></i>
              </div>
              <span>AI Support</span>
            </button>

            <Link
              to="/farmer/notifications"
              className="header-notif-btn"
              style={{
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
              title="Notifications"
            >
              <FiBell size={19} style={{ color: '#FFFFFF' }} />
            </Link>

            <Link
              to="/farmer/profile"
              className="header-profile"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#FCE06D',
                  color: '#17221D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '14px',
                }}
              >
                {farmerInitials}
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: '#FFFFFF' }}>{farmerName}</span>
            </Link>
          </div>
        </header>


        {/* Dynamic Page Content */}
        <main className="farmer-content">
          {children}
        </main>
      </div>

      {/* Embedded 24/7 AI Assistant */}
      <FarmerAIChatSupport />
    </div>
  );
};

export default FarmerDashboardLayout;
