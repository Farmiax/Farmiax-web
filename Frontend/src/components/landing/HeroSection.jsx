import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/images/hero-bg.jpg';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/customer/signin');
  };

  const handleFarmerClick = () => {
    navigate('/farmer/signin');
  };

  const whyChooseFeatures = [
    { icon: 'ri-leaf-line', label: '100% Natural' },
    { icon: 'ri-truck-line', label: 'Direct from Farmers' },
    { icon: 'ri-star-line', label: 'Premium Quality' },
    { icon: 'ri-price-tag-3-line', label: 'Fair Prices' },
    { icon: 'ri-shield-check-line', label: 'Trust & Transparency' },
  ];

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <img src={heroImg} alt="Farmiax hero background" />
        <div className="hero-bg-overlay" />
      </div>

      <div className="hero-content container">
        <div className="hero-header-text">
          <h1 className="hero-headline">
            Pure. Natural. Trusted.<br />
            From Our Farms to Your Home.
          </h1>
          <p className="hero-subtext">
            Farmiax connects rural farmers and artisans with conscious buyers. Shop authentic products or sell your produce globally with ease.
          </p>
        </div>

        {/* User Path Cards */}
        <div className="user-paths">
          <div className="user-paths-grid">

            {/* Customer Card */}
            <div className="path-card">
              <div className="card-top-icon">
                <i className="ri-shopping-bag-3-line text-white text-xl" />
              </div>
              <h3 className="card-title">For Customers</h3>
              <p className="card-subtitle">Shop authentic products directly from farmers.</p>
              <ul className="path-benefits">
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Wide range of natural products
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Safe & secure payments
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Fast doorstep delivery
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Quality you can trust
                </li>
              </ul>
              <button className="card-action-btn" onClick={handleCustomerClick}>
                Shop as a Customer <i className="ri-arrow-right-line" />
              </button>
            </div>



            {/* Farmer Card */}
            <div className="path-card">
              <div className="card-top-icon">
                <i className="ri-user-smile-line text-white text-xl" />
              </div>
              <h3 className="card-title">For Farmers / Sellers</h3>
              <p className="card-subtitle">Grow your business and reach global customers.</p>
              <ul className="path-benefits">
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Easy product listing
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Global market access
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Secure payments
                </li>
                <li>
                  <span className="check-bullet"><i className="ri-check-line" /></span>
                  Grow your brand
                </li>
              </ul>
              <button className="card-action-btn" onClick={handleFarmerClick}>
                Join as a Farmer <i className="ri-arrow-right-line" />
              </button>
            </div>

          </div>
        </div>

        {/* Why Choose Farmiax Highlight Strip */}
        <div className="why-choose-banner-wrapper">
          <div className="why-choose-banner">
            <p className="why-banner-title">Why Choose Farmiax?</p>
            <div className="why-banner-items">
              {whyChooseFeatures.map((item, idx) => (
                <div key={idx} className="why-banner-item">
                  <i className={`${item.icon} why-banner-icon`} />
                  <span className="why-banner-label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
