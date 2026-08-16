import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/customer/signin');
  };

  const handleFarmerClick = () => {
    navigate('/farmer/signin');
  };

  return (
    <section className="hero-section">
      <div className="hero-bg">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hero-video"
          src="/Bg video.mp4"
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className="hero-content container">
        <div className="hero-header-text">
          <h1 className="hero-headline">
            Pure. Natural. Trusted.<br />
            From Our Farms to Your Home
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

      </div>

      {/* Organic Wavy Flow Transition */}
      <div className="hero-wave-divider">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,32L60,42.7C120,53,240,75,360,74.7C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"
            fill="rgba(250, 247, 242, 0.45)"
          />
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#FAF7F2"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
