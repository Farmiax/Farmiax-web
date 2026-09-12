import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import adminService from '../../services/adminService';
import Logo from '../common/Logo';
import {
  FiGrid, FiShoppingBag, FiBox, FiUsers, FiSettings,
  FiLogOut, FiChevronLeft, FiChevronRight, FiSearch,
  FiShield, FiActivity, FiServer, FiMenu
} from 'react-icons/fi';
import '../../styles/admin.css';

const AdminDashboardLayout = ({ children, activeNav }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const adminEmail = localStorage.getItem('farmiax_admin_email') || 'admin@farmiax.com';

  const navLinks = [
    { icon: FiGrid, label: 'Dashboard', path: '/admin/dashboard', id: 'dashboard' },
    { icon: FiShoppingBag, label: 'Products Master', path: '/admin/products', id: 'products' },
    { icon: FiBox, label: 'Orders Master', path: '/admin/orders', id: 'orders' },
    { icon: FiUsers, label: 'Farmers Registry', path: '/admin/farmers', id: 'farmers' },
    { icon: FiSettings, label: 'System & Security', path: '/admin/settings', id: 'settings' },
  ];

  const handleLogout = () => {
    adminService.logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout-container">
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? '' : 'collapsed'} ${isMobileMenuOpen ? 'open-mobile' : ''}`}>
        <div className="admin-sidebar-sticky-wrapper">
          <div className="admin-sidebar-header">
            {isSidebarOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Logo size="sm" />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, paddingRight: '12px' }}>
                <Logo size="sm" />
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="admin-desktop-toggle"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              title={isSidebarOpen ? 'Collapse' : 'Expand'}
            >
              {isSidebarOpen ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeNav === link.id || location.pathname === link.path;
              return (
                <Link
                  key={link.id}
                  to={link.path}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                  style={{ justifyContent: isSidebarOpen ? 'flex-start' : 'center' }}
                  title={link.label}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={19} />
                  {isSidebarOpen && <span>{link.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="admin-sidebar-footer">
            <button
              onClick={handleLogout}
              className="admin-nav-link"
              style={{
                width: '100%',
                border: 'none',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                cursor: 'pointer',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              }}
            >
              <FiLogOut size={18} />
              {isSidebarOpen && <span>Admin Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="admin-main-wrapper">
        {/* Top Header */}
        <header className="admin-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="admin-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
            >
              <FiMenu size={24} />
            </button>
            <span className="admin-header-title" style={{ fontSize: '15px', color: '#FFFFFF', fontWeight: 800 }}>
              Farmiax Platform Control Engine
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="admin-server-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(74, 222, 128, 0.3)', borderRadius: '999px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#4ADE80' }}>LIVE SERVER CONNECTED</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#CA8A04', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#000000', fontSize: '14px', flexShrink: 0 }}>
                A
              </div>
              <div className="admin-profile-text" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>Platform Admin</span>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>{adminEmail}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content-view">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
