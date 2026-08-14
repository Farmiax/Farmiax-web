import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiSearch, FiHeart, FiShoppingBag, FiUser, FiLogOut, FiBox } from 'react-icons/fi';

const CustomerHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/customer/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Shop', path: '/customer/shop' },
    { label: 'Categories', path: '/customer/shop?tab=categories' },
    { label: 'About Us', path: '/customer#about' },
    { label: 'Farmers', path: '/customer#farmers' },
    { label: 'Offers', path: '/customer/shop?tab=offers' },
    { label: 'Contact', path: '/customer#contact' },
  ];

  return (
    <header className="customer-header-bar">
      <div className="container customer-header-flex">
        {/* Brand Logo */}
        <Link to="/customer" className="customer-brand-link">
          <Logo size="md" variant="badge" />
        </Link>

        {/* Center Nav Links & Search */}
        <nav className="customer-nav-center">
          <form className="customer-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FiSearch className="search-icon" />
            </button>
          </form>

          <Link to="/customer/shop?tab=offers" className="customer-link">Offers</Link>
          <Link to="/customer/orders" className="customer-link">My Orders</Link>
        </nav>

        {/* Action Icons */}
        <div className="customer-actions">
          {/* Wishlist */}
          <Link to="/customer/wishlist" className="customer-action-btn" title="Wishlist">
            <FiHeart size={20} />
            <span className="action-badge wishlist-badge">3</span>
          </Link>

          {/* Cart */}
          <Link to="/customer/cart" className="customer-action-btn" title="Cart">
            <FiShoppingBag size={20} />
            <span className="action-badge cart-badge">{cartCount > 0 ? cartCount : 3}</span>
          </Link>

          {/* User Profile / Menu */}
          <div className="user-profile-relative">
            <button
              className="customer-avatar-btn"
              onClick={() => setUserDropdown(!userDropdown)}
              title={isAuthenticated ? user?.fullName : 'Account'}
            >
              <FiUser size={18} />
            </button>

            {userDropdown && (
              <div className="customer-dropdown-menu">
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-user-info">
                      <p className="user-name">{user?.fullName || 'Dilli Rani'}</p>
                      <p className="user-role">Customer</p>
                    </div>
                    <hr />
                    <Link to="/customer/wishlist" onClick={() => setUserDropdown(false)}>
                      <FiHeart /> My Wishlist
                    </Link>
                    <Link to="/customer/track-order" onClick={() => setUserDropdown(false)}>
                      <FiBox /> Track Orders
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                        navigate('/');
                      }}
                      className="dropdown-logout-btn"
                    >
                      <FiLogOut /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/customer/signin" onClick={() => setUserDropdown(false)}>
                      Sign In
                    </Link>
                    <Link to="/customer/signup" onClick={() => setUserDropdown(false)}>
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerHeader;
