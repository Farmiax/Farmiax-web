import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import {
  FiBell, FiBox, FiDollarSign, FiAlertTriangle,
  FiCheckCircle, FiStar, FiTrash2, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      type: 'order',
      title: 'New Harvest Order Received',
      description: 'Customer Ananya Sharma placed Order #FMX9823145 (₹640) for Organic Salem Turmeric and Toor Dal.',
      time: '15 minutes ago',
      read: false,
    },
    {
      id: 'notif-2',
      type: 'payout',
      title: 'Payout Transfer Credited',
      description: 'Weekly settlement of ₹48,520 has been credited to your State Bank of India account (SBIN0001234).',
      time: 'Yesterday, 5:00 PM',
      read: false,
    },
    {
      id: 'notif-3',
      type: 'stock',
      title: 'Low Harvest Stock Alert',
      description: 'A2 Gir Cow Desi Ghee inventory is currently down to 5 units. Please consider restocking.',
      time: '2 days ago',
      read: true,
    },
    {
      id: 'notif-4',
      type: 'review',
      title: 'New 5-Star Buyer Review',
      description: 'Dr. Meenakshi Sundaram left a glowing 5-star review on your Wild Forest Raw Honey.',
      time: '3 days ago',
      read: true,
    },
  ]);

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
        {notifications.length === 0 ? (
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
