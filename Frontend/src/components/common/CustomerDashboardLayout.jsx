import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from './Logo';
import {
  FiSearch, FiBell, FiShoppingCart, FiGrid,
  FiShoppingBag, FiTruck, FiHeart, FiTag, FiUsers,
  FiSettings, FiLogOut, FiBox, FiChevronLeft, FiChevronRight,
  FiShield, FiRefreshCcw, FiCheckCircle
} from 'react-icons/fi';
import '../../styles/dashboard.css';

const farmerImg = "https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=200&q=80";

const CustomerDashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    if(search.trim()) {
       navigate(`/customer/shop?search=${encodeURIComponent(search.trim())}`);
    }
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? '' : 'collapsed'}`}>
        <div className="sidebar-logo">
          {isSidebarOpen ? (
            <Logo size="md" />
          ) : (
            <Logo size="sm" />
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
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

      {/* Main Container */}
      <div className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
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
            <button className="header-icon-btn" onClick={() => navigate('/customer/notifications')} title="Notifications">
              <FiBell size={22} />
            </button>
            <button className="header-icon-btn" onClick={() => navigate('/customer/cart')}>
              <FiShoppingCart size={22} />
            </button>
            <div className="header-divider"></div>
            <Link to="/customer/profile" className="header-profile" style={{ textDecoration: 'none' }}>
              <img src={farmerImg} alt="User Profile" className="header-avatar" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="dashboard-content-scroll" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
          <div style={{ flex: 1 }}>
            {children}
          </div>

          {/* Static Features Footer */}
          <div style={{ 
            marginTop: 'auto', 
            background: '#FAF7F2', 
            borderTop: '1px solid var(--border-light)', 
            padding: '24px 40px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            color: 'var(--text-muted)',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiCheckCircle style={{ color: '#84CC16', fontSize: '18px' }} />
              100% Fresh & Natural
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiUsers style={{ color: '#3B82F6', fontSize: '18px' }} />
              Direct from Farmers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiShield style={{ color: '#3B82F6', fontSize: '18px' }} />
              Secure Payments
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiTruck style={{ color: '#F97316', fontSize: '18px' }} />
              On-time Delivery
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FiRefreshCcw style={{ color: '#3B82F6', fontSize: '18px' }} />
              Easy Returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;
