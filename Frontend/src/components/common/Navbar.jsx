import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { useAuth } from '../../context/AuthContext';
import '../../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, isCustomer, isFarmer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const scrollToSection = (id) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setMobileOpen(false);
    if (isAuthenticated) {
      if (isCustomer) navigate('/customer');
      else if (isFarmer) navigate('/farmer/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleJoinNow = () => {
    setMobileOpen(false);
    if (isAuthenticated) {
      if (isCustomer) navigate('/customer');
      else if (isFarmer) navigate('/farmer/dashboard');
    } else {
      navigate('/register');
    }
  };

  const navLinks = [
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Benefits', id: 'benefits' },
    { label: 'Success Stories', id: 'testimonials' },
    { label: 'About Us', id: 'about' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className={`landing-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container container">
        <Link 
          to="/" 
          className="navbar-logo" 
          aria-label="Farmiax Home"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <Logo size="md" variant="badge" />
        </Link>

        <nav className="navbar-desktop-links">
          {navLinks.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="nav-link"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="navbar-desktop-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <button
              onClick={handleLogin}
              className="btn btn-primary btn-sm"
              style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
            >
              {isFarmer ? 'Farmer Portal' : 'My Account'}
            </button>
          ) : (
            <>
              <button
                onClick={handleLogin}
                className="nav-link"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#FAF7F2', fontWeight: 600, fontSize: '14px' }}
              >
                Sign In
              </button>
              <button
                onClick={handleJoinNow}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <i className={`ri-${mobileOpen ? 'close' : 'menu'}-line text-2xl text-white`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="navbar-mobile-menu">
          <div className="mobile-links-container">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="mobile-nav-link"
              >
                {item.label}
              </button>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px', padding: '0 16px' }}>
              {isAuthenticated ? (
                <button
                  onClick={handleLogin}
                  className="btn btn-primary btn-full"
                >
                  {isFarmer ? 'Go to Farmer Dashboard' : 'Go to Shop / Account'}
                </button>
              ) : (
                <>
                  <button onClick={handleLogin} className="btn btn-outline btn-full">
                    Sign In
                  </button>
                  <button onClick={handleJoinNow} className="btn btn-primary btn-full">
                    Join Farmiax
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
