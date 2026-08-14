import { Link, useNavigate } from 'react-router-dom';
import CustomerHeader from '../../components/common/CustomerHeader';
import Footer from '../../components/common/Footer';
import { FiCheck, FiMail, FiTruck } from 'react-icons/fi';
import '../../styles/customer.css';

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="customer-layout">
      <CustomerHeader />

      <main className="customer-main-content" style={{ backgroundColor: '#FFFBF0' }}>
        <div className="container">
          <div className="thankyou-wrapper">
            {/* Green Check Circle */}
            <div className="thankyou-success-circle">
              <FiCheck />
            </div>

            <h1 className="thankyou-title">Thank You!</h1>
            <p className="thankyou-sub">Your order has been placed successfully.</p>

            <div className="order-id-badge">
              Order ID: <strong>FMX1721456789</strong>
            </div>

            {/* Order Summary Card */}
            <div className="thankyou-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-metrics-grid">
                <div className="metric-item">
                  <p className="metric-label">Total Items</p>
                  <p className="metric-val">3 Items</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Total Amount</p>
                  <p className="metric-val">₹310</p>
                </div>
                <div className="metric-item">
                  <p className="metric-label">Estimated Delivery</p>
                  <p className="metric-val green">25 Jul – 27 Jul 2024</p>
                </div>
              </div>

              <div className="thankyou-notice-box">
                <FiMail size={20} className="text-primary-600 flex-shrink-0" />
                <span>
                  We have sent the order details and tracking link to your registered email address and phone number.
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="thankyou-actions">
              <Link to="/customer/track-order" className="btn-dark-green">
                <FiTruck size={18} /> Track Order
              </Link>
              <Link to="/customer/shop" className="btn-outline-dark">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
