import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { FiPackage, FiTruck, FiBox, FiXCircle } from 'react-icons/fi';
import '../../styles/customer.css';

const CustomerOrders = () => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getUserOrders();
        // data.orders is assumed if wrapped, or just data if it returns an array
        setOrders(Array.isArray(data) ? data : data.orders || []);
      } catch (error) {
        console.error('Failed to fetch user orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter((o) => o.status && o.status.toLowerCase() === activeFilter.toLowerCase());

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <FiTruck />;
      case 'shipped': return <FiBox />;
      case 'cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-confirmed';
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="customer-main-content" style={{ padding: '24px' }}>
        <div className="container" style={{ maxWidth: '100%' }}>
          <section className="orders-main-content">
            <div className="orders-page-header">
              <h2>My Orders</h2>
              <div className="orders-filter-pills">
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`order-filter-pill ${activeFilter === f ? 'active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="orders-list-stack">
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Loading orders...
                </div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No orders found.
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div key={order._id || order.id} className="order-item-card">
                    <div className="order-item-left">
                      <div className="order-type-icon">{getStatusIcon(order.status)}</div>
                      <div className="order-info-meta">
                        <h4>Order ID: {order._id || order.id}</h4>
                        <p>{new Date(order.createdAt || Date.now()).toLocaleDateString()} • {order.Products?.length || 0} Items</p>
                      </div>
                    </div>

                    <div className="order-item-right">
                      <span className="order-total-price">₹{order.totalAmount || order.actualAmount || 0}</span>
                      <span className={`status-pill ${getStatusClass(order.status)}`}>
                        {order.status || 'CONFIRMED'}
                      </span>
                      <Link to={`/customer/track-order/${order._id || order.id}`} className="btn-outline-dark text-xs py-2 px-4">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerOrders;
