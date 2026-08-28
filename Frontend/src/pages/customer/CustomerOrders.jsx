import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import orderService from '../../services/orderService';
import { FiPackage, FiTruck, FiBox, FiXCircle, FiCheckCircle, FiDownload, FiArrowRight } from 'react-icons/fi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import toast from 'react-hot-toast';
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
        const extracted = Array.isArray(data) ? data : (data?.data || data?.orders || []);
        setOrders(extracted);
      } catch (error) {
        console.warn('User orders fetch notice:', error?.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const filteredOrders = activeFilter === 'All'
    ? orders
    : orders.filter((o) => (o.status || '').toLowerCase().includes(activeFilter.toLowerCase()));

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <FiTruck />;
      case 'shipped':
      case 'out for delivery': return <FiBox />;
      case 'cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'shipped':
      case 'out for delivery': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-confirmed';
    }
  };

  const handleDownloadInvoice = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.setTextColor(29, 69, 51);
      doc.text('FARMIAX — Pure. Natural. Trusted.', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Invoice ID: INV-${order._id?.slice(-8) || '001'}`, 14, 28);
      doc.text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}`, 14, 34);
      doc.text(`Customer: ${user?.fullName || 'Customer'}`, 14, 40);

      const items = (order.Products || []).map((item, idx) => [
        idx + 1,
        item.product?.name || 'Organic Produce Item',
        item.quantity || 1,
        `₹${item.price || 0}`,
        `₹${(item.price || 0) * (item.quantity || 1)}`,
      ]);

      doc.autoTable({
        startY: 48,
        head: [['#', 'Item', 'Qty', 'Unit Price', 'Total']],
        body: items.length > 0 ? items : [[1, 'Organic Farm Goods', 1, `₹${order.totalAmount}`, `₹${order.totalAmount}`]],
        theme: 'striped',
        headStyles: { fillColor: [29, 69, 51] },
      });

      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text(`Grand Total: ₹${order.totalAmount || order.actualAmount || 0}`, 140, finalY);

      doc.save(`Farmiax_Invoice_${order._id?.slice(-8) || 'Order'}.pdf`);
      toast.success('Invoice downloaded successfully! 📄');
    } catch (err) {
      console.error('Invoice error:', err);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="customer-main-content" style={{ padding: '24px' }}>
        <div className="container" style={{ maxWidth: '100%' }}>
          <section className="orders-main-content">
            <div className="orders-page-header">
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px', color: '#0F172A' }}>My Orders</h2>
                <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>View all past and ongoing direct harvest orders</p>
              </div>

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
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <div className="loader-spinner" style={{ margin: '0 auto 16px' }} />
                  <p>Loading your order history...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center', background: '#FFF', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                  <FiPackage size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#1E293B' }}>No orders in this category</h3>
                  <p style={{ color: '#64748B', fontSize: '13px', marginBottom: '20px' }}>Explore authentic products and place your first harvest order.</p>
                  <Link to="/customer/shop" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '13px' }}>
                    Start Shopping
                  </Link>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const orderId = order._id || order.id;
                  return (
                    <div key={orderId} className="order-item-card">
                      <div className="order-item-left">
                        <div className="order-type-icon">{getStatusIcon(order.status)}</div>
                        <div className="order-info-meta">
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px', color: '#0F172A' }}>
                            Order #{orderId?.slice(-8) || orderId}
                          </h4>
                          <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                            {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {order.Products?.length || 1} Items
                          </p>
                        </div>
                      </div>

                      <div className="order-item-right" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span className="order-total-price" style={{ fontWeight: 800, fontSize: '16px', color: '#1D4533' }}>
                          ₹{order.totalAmount || order.actualAmount || 0}
                        </span>

                        <span className={`status-pill ${getStatusClass(order.status)}`}>
                          {order.status || 'CONFIRMED'}
                        </span>

                        <button
                          onClick={() => handleDownloadInvoice(order)}
                          className="btn btn-outline btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                          title="Download Invoice PDF"
                        >
                          <FiDownload size={13} /> Invoice
                        </button>

                        <Link
                          to={`/customer/track-order/${orderId}`}
                          className="btn btn-primary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 14px', textDecoration: 'none' }}
                        >
                          Track Details <FiArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerOrders;
