import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import FarmerAIChatSupport from './FarmerAIChatSupport';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiBox, FiShoppingBag, FiTruck, FiUsers, FiDollarSign,
  FiBarChart2, FiCreditCard, FiStar, FiMessageSquare, FiUser,
  FiSettings, FiBell, FiSearch, FiLogOut, FiMenu, FiX, FiHelpCircle
} from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';

const FarmerDashboardLayout = ({ children, activeNav = '' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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
    { label: 'Farm Profile', path: '/farmer/profile', icon: FiUser },
    { label: 'Settings', path: '/farmer/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/farmer/signin');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchQuery('');
    }
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
      <aside className={`farmer-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="farmer-sidebar-logo" style={{ padding: '20px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo size="md" imgStyle={{ filter: 'drop-shadow(0 2px 8px rgba(255,255,255,0.4))' }} />
          <button
            className="mobile-close-btn"
            onClick={() => setMobileSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', display: 'none' }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div style={{ padding: '0 16px 14px' }}>
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
                <Icon style={{ marginRight: '10px', fontSize: '18px' }} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={handleLogout}
            className="farmer-nav-item logout"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              marginTop: '12px',
              color: '#F87171',
            }}
          >
            <FiLogOut style={{ marginRight: '10px', fontSize: '18px' }} />
            <span>Sign Out</span>
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
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                borderRadius: '10px',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
              title="AI Assistant Support"
            >
              <FiHelpCircle size={16} color="#86EFAC" />
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
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '8px',
                  height: '8px',
                  background: '#22C55E',
                  borderRadius: '50%',
                }}
              />
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
