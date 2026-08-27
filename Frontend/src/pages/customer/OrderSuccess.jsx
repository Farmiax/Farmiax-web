import { Link, useLocation } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { FiCheck, FiMail, FiTruck, FiShoppingBag } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import '../../styles/customer.css';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  const orderId = order._id || order.id || 'FMX' + Math.floor(1000000 + Math.random() * 9000000);
  const totalAmount = order.totalAmount || order.actualAmount || 310;
  const itemCount = order.Products?.length || 1;

  return (
    <CustomerDashboardLayout>
      <div className="container" style={{ padding: '40px 16px', minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="thankyou-wrapper" style={{ maxWidth: '640px', width: '100%' }}>
          {/* Green Check Circle */}
          <div className="thankyou-success-circle">
            <FiCheck size={36} />
          </div>

          <h1 className="thankyou-title">Thank You!</h1>
          <p className="thankyou-sub">Your harvest order has been placed successfully.</p>

          <div className="order-id-badge">
            Order Reference: <strong>#{orderId}</strong>
          </div>

          {/* Order Summary Card */}
          <div className="thankyou-summary-card">
            <h3>Order Summary</h3>
            <div className="summary-metrics-grid">
              <div className="metric-item">
                <p className="metric-label">Total Items</p>
                <p className="metric-val">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</p>
              </div>
              <div className="metric-item">
                <p className="metric-label">Total Amount</p>
                <p className="metric-val">{formatPrice(totalAmount)}</p>
              </div>
              <div className="metric-item">
                <p className="metric-label">Payment Method</p>
                <p className="metric-val green">{order.paymentMethod || 'Cash on Delivery'}</p>
              </div>
            </div>

            <div className="thankyou-notice-box">
              <FiMail size={20} style={{ color: '#0B5D38', flexShrink: 0 }} />
              <span>
                We have synchronized your order with the regional farm depot. You will receive live GPS cold-chain tracking updates.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="thankyou-actions">
            <Link to={`/customer/track-order/${orderId}`} className="btn-dark-green">
              <FiTruck size={18} /> Track Order Live
            </Link>
            <Link to="/customer/shop" className="btn-outline-dark">
              <FiShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default OrderSuccess;
