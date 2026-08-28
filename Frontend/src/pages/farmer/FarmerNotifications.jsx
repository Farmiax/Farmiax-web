import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import {
  FiBell, FiBox, FiDollarSign, FiAlertTriangle,
  FiCheckCircle, FiStar, FiTrash2, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const [ordersRes, prodsRes] = await Promise.allSettled([
          orderService.getFarmerOrders(),
          productService.getFarmerProducts()
        ]);

        const notifs = [];

        if (ordersRes.status === 'fulfilled') {
          const ords = Array.isArray(ordersRes.value) ? ordersRes.value : (ordersRes.value?.data || []);
          ords.slice(0, 5).forEach((ord, idx) => {
            const custUser = ord.user || ord.customer || {};
            const custName = custUser.fullName || custUser.name || ord.deliveryAddress?.fullName || 'A Customer';
            const prodName = ord.Products?.[0]?.product?.name || 'Fresh Produce';
            notifs.push({
              id: `notif-ord-${ord._id || idx}`,
              type: 'order',
              title: 'New Harvest Order Received',
              description: `${custName} placed Order #${String(ord._id || idx).slice(-8)} (₹${ord.totalAmount || ord.actualAmount || 0}) for ${prodName}.`,
              time: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent',
              read: false,
            });
          });
        }

        if (prodsRes.status === 'fulfilled') {
          const prods = Array.isArray(prodsRes.value) ? prodsRes.value : (prodsRes.value?.data || []);
          prods.forEach((p, idx) => {
            const stock = Number(p.stock || p.quantity || 0);
            if (stock <= 10) {
              notifs.push({
                id: `notif-stock-${p._id || idx}`,
                type: 'stock',
                title: 'Low Harvest Stock Alert',
                description: `${p.name || p.ProductName || 'Farm Product'} inventory is currently down to ${stock} units. Please consider restocking fresh harvest.`,
                time: 'Live Alert',
                read: false,
              });
            }
          });
        }

        setNotifications(notifs);
      } catch (err) {
        console.warn('Notifications fetch note:', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('Notifications cleared');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'order': return <FiBox style={{ color: '#93C5FD' }} />;
      case 'payout': return <FiDollarSign style={{ color: '#86EFAC' }} />;
      case 'stock': return <FiAlertTriangle style={{ color: '#FDE047' }} />;
      case 'review': return <FiStar style={{ color: '#FDE047' }} />;
      default: return <FiBell style={{ color: '#FFFFFF' }} />;
    }
  };

  return (
    <FarmerDashboardLayout activeNav="notifications">
      <div className="farmer-notifications-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Notifications & Activity Alerts
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Real-time updates regarding new orders, inventory alerts, and revenue settlements.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={markAllRead}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.4)', color: '#FFFFFF', borderRadius: '10px' }}
            >
              <FiCheck size={14} /> Mark All as Read
            </button>
            <button
              onClick={clearAll}
              className="btn btn-outline btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px', color: '#FCA5A5', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', borderRadius: '10px' }}
            >
              <FiTrash2 size={14} /> Clear All
            </button>
          </div>
        </div>

        {/* Notifications Stack */}
        {loading ? (
          <div className="glass-box" style={{ padding: '60px 20px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)' }}>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="glass-box" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <FiBell size={48} style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px', color: '#FFFFFF' }}>You are all caught up!</h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', margin: 0 }}>No unread notifications at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className="glass-box"
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  background: n.read ? 'rgba(255, 255, 255, 0.12)' : 'rgba(34, 197, 94, 0.22)',
                  borderColor: n.read ? 'rgba(255, 255, 255, 0.3)' : 'rgba(74, 222, 128, 0.5)',
                }}
              >
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                  {getIcon(n.type)}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>{n.title}</h4>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>{n.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.5 }}>
                    {n.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerNotifications;
