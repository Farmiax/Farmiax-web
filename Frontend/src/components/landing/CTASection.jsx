import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CTASection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer, isFarmer } = useAuth();

  const handleShop = () => {
    if (isAuthenticated && isCustomer) navigate('/customer/shop');
    else navigate('/customer/signup');
  };

  const handleFarmer = () => {
    if (isAuthenticated && isFarmer) navigate('/farmer/dashboard');
    else navigate('/farmer/signup');
  };

  return (
    <section className="cta-banner-section">
      <div className="container">
        <div className="cta-banner-card">
          <div className="cta-icon-wrapper">
            <i className="ri-gift-line cta-gift-icon" />
          </div>

          <div className="cta-text-content">
            <h3 className="cta-title">Join Farmiax Today!</h3>
            <p className="cta-subtitle">
              Whether you want to shop or sell, we make it simple, transparent and rewarding.
            </p>
          </div>

          <div className="cta-actions-group">
            <button className="cta-btn-primary" onClick={handleShop}>
              Shop Now
            </button>
            <button className="cta-btn-secondary" onClick={handleFarmer}>
              Join as a Farmer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
