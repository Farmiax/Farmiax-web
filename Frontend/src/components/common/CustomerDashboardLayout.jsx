import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Logo from './Logo';
import { getImageUrl } from '../../utils/helpers';
import {
  FiSearch, FiBell, FiShoppingCart, FiGrid,
  FiShoppingBag, FiTruck, FiHeart, FiTag, FiUsers,
  FiSettings, FiLogOut, FiBox, FiChevronLeft, FiChevronRight,
  FiShield, FiRefreshCcw, FiCheckCircle, FiMenu, FiX
} from 'react-icons/fi';
import '../../styles/dashboard.css';

const CustomerDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('farmiax_sidebar_open');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem('farmiax_sidebar_open', JSON.stringify(newState));
  };

  const sidebarLinks = [
    { icon: FiGrid, label: 'Dashboard', path: '/customer/profile' },
    { icon: FiShoppingBag, label: 'Shop All', path: '/customer/shop' },
    { icon: FiBox, label: 'Orders', path: '/customer/orders' },
    { icon: FiTruck, label: 'Track Order', path: '/customer/track-order' },
    { icon: FiHeart, label: 'Wishlist', path: '/customer/wishlist' },
    { icon: FiShoppingCart, label: 'Cart', path: '/customer/cart' },
    { icon: FiTag, label: 'Offers', path: '/customer/shop?tab=offers' },
    { icon: FiUsers, label: 'Farmers', path: '/customer/farmers' },
    { icon: FiBell, label: 'Notifications', path: '/customer/notifications' },
    { icon: FiSettings, label: 'Settings', path: '/customer/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/customer/signin');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/customer/shop?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? '' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-logo">
          {isSidebarOpen ? (
            <Logo size="md" />
          ) : (
            <Logo size="sm" />
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
          </button>

          <button
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarLinks.map((link, idx) => {
            const Icon = link.icon;
            // Check active state
            const isActive = location.pathname === link.path || (link.path.includes('?') && location.search.includes(link.path.split('?')[1]));
            return (
              <Link
                key={idx}
                to={link.path}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <button onClick={handleLogout} className="sidebar-link logout" style={{ marginTop: '16px', border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', padding: isSidebarOpen ? '12px 16px' : '12px 0', justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}>
            <FiLogOut size={18} />
            <span style={{ display: isSidebarOpen ? 'block' : 'none' }}>Logout</span>
          </button>
        </nav>
      </aside>

      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="mobile-header-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <FiMenu size={24} color="#FFFFFF" />
            </button>
          </div>

          <form className="header-search" onSubmit={handleSearch}>
            <FiSearch size={18} />
            <input
              type="text"
              placeholder="Search for products, categories or farmers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          <div className="header-actions">
            {(user?.role === 'farmer' || user?.role === 'both') && (
              <button 
                className="btn btn-primary btn-sm" 
                style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 600, marginRight: '8px' }}
                onClick={() => navigate('/farmer/dashboard')}
                title="Go to Farmer Dashboard"
              >
                Farmer Dashboard
              </button>
            )}
            <button className="header-icon-btn" onClick={() => navigate('/customer/notifications')} title="Notifications">
              <FiBell size={22} />
            </button>
            <button className="header-icon-btn" onClick={() => navigate('/customer/cart')} title="Shopping Cart">
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="header-icon-badge" style={{ background: '#F59E0B', color: '#FFFFFF', border: '2px solid #0B5D38' }}>
                  {cartCount}
                </span>
              )}
            </button>
            <div className="header-divider"></div>
            <Link to="/customer/personal-profile" className="header-profile" style={{ textDecoration: 'none' }}>
              {user?.avatar && user.avatar !== 'Not Photo' ? (
                <img
                  src={getImageUrl(user.avatar)}
                  alt="User Profile"
                  className="header-avatar"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="header-avatar-fallback"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1D4533',
                  color: '#86EFAC',
                  display: user?.avatar && user.avatar !== 'Not Photo' ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: '2px solid rgba(255,255,255,0.3)',
                }}
              >
                {(user?.fullName || 'Customer').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="dashboard-content-scroll" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
