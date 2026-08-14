import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import {
  FiBell, FiUserCheck, FiTag, FiTruck, FiShoppingBag,
  FiCheckCircle, FiTrash2, FiClock, FiCheck, FiFilter, FiUserPlus, FiArrowRight
} from 'react-icons/fi';
import '../../styles/customer.css';

const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif_1',
    type: 'farmer_product', // Subscribed farmer added a product
    title: '🌾 New Harvest Alert from Subscribed Farmer',
    message: 'Ramesh Kumar (Green Valley Organic) just posted fresh stock of Organic Cold-Pressed Groundnut Oil harvested today!',
    farmerName: 'Ramesh Kumar',
    farmLocation: 'Erode, Tamil Nadu',
    productName: 'Organic Cold-Pressed Groundnut Oil',
    productId: '64f1a2b3c4d5e6f7a8b9c0d1',
    time: '15 mins ago',
    unread: true,
    badgeColor: '#DCFCE7',
    badgeTextColor: '#15803D',
    icon: FiUserCheck,
    actionPath: '/customer/farmers',
    actionText: 'View Harvest Post',
  },
  {
    id: 'notif_2',
    type: 'new_farmer', // New farmer joined & added product -> suggested to all customers
    title: '🌱 New Organic Farmer Joined Farmiax!',
    message: 'Welcoming Lakshmi Narayan from Wayanad Spice Estate! She just added her first batch of Certified Wild Forest Honey.',
    farmerName: 'Lakshmi Narayan',
    farmLocation: 'Wayanad, Kerala',
    productName: 'Wild Forest Honey',
    time: '2 hours ago',
    unread: true,
    badgeColor: '#E0F2FE',
    badgeTextColor: '#0369A1',
    icon: FiUserPlus,
    actionPath: '/customer/farmers',
    actionText: 'Discover Farmer',
  },
  {
    id: 'notif_3',
    type: 'discount_offer', // Discount offer on product
    title: '🔥 Special Harvest Offer: 20% OFF!',
    message: 'Enjoy 20% flat discount on Heritage Rice & Organic Pulses for the next 24 hours. Use code FARM20 at checkout.',
    code: 'FARM20',
    time: '5 hours ago',
    unread: false,
    badgeColor: '#FEF3C7',
    badgeTextColor: '#B45309',
    icon: FiTag,
    actionPath: '/customer/shop?tab=offers',
    actionText: 'Claim Offer',
  },
  {
    id: 'notif_4',
    type: 'order_status', // Order update
    title: '🚚 Order Dispatch Update',
    message: 'Your order #FMX-89240 has been packed by the farmer and is out for doorstep delivery.',
    time: 'Yesterday',
    unread: false,
    badgeColor: '#F3E8FF',
    badgeTextColor: '#6B21A8',
    icon: FiTruck,
    actionPath: '/customer/track-order',
    actionText: 'Track Order',
  },
];

const CustomerNotifications = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'farmer_product' | 'new_farmer' | 'discount_offer' | 'order_status'
  const [toastMessage, setToastMessage] = useState('');

  // Persisted Notifications state in localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('farmiax_customer_notifications');
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
    } catch {
      return DEFAULT_NOTIFICATIONS;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('farmiax_customer_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage notification save notice:', e);
    }
  }, [notifications]);

  // Fetch recent products from API to append live notifications if available
  useEffect(() => {
    const fetchLiveUpdates = async () => {
      try {
        const response = await api.get('/product/all-products');
        const prods = response.data?.products || response.data?.data || response.data || [];
        if (Array.isArray(prods) && prods.length > 0) {
          const latestProd = prods[0];
          const newLiveNotif = {
            id: `live_prod_${latestProd._id || Date.now()}`,
            type: 'farmer_product',
            title: `🌾 Fresh ${latestProd.name || latestProd.ProductName} Harvested!`,
            message: `${latestProd.farmerName || 'Your followed farmer'} just listed new harvest stock of ${latestProd.name || latestProd.ProductName} at ₹${latestProd.price || latestProd.Price}.`,
            productName: latestProd.name || latestProd.ProductName,
            productId: latestProd._id || latestProd.id,
            time: 'Just now',
            unread: true,
            badgeColor: '#DCFCE7',
            badgeTextColor: '#15803D',
            icon: FiUserCheck,
            actionPath: '/customer/farmers',
            actionText: 'View Harvest',
          };

          setNotifications((prev) => {
            if (prev.some((n) => n.id === newLiveNotif.id)) return prev;
            return [newLiveNotif, ...prev];
          });
        }
      } catch (err) {
        console.warn('Live notification API fetch notice:', err?.message);
      }
    };

    fetchLiveUpdates();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    showToast('Notification removed');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Cleared all notifications');
  };

  // Filtering
  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === 'All') return true;
    return n.type === activeFilter;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <CustomerDashboardLayout>
      <div className="notifications-page-wrapper" style={{ padding: '32px 36px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#062414',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: 600,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '18px' }} />
            {toastMessage}
          </div>
        )}

        {/* Page Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #062414 0%, #166534 50%, #15803D 100%)',
            borderRadius: '20px',
            padding: '32px 40px',
            color: '#FFFFFF',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 12px 30px rgba(6, 36, 20, 0.15)',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#86EFAC',
                  }}
                >
                  <FiBell size={30} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                    Notifications & Harvest Alerts
                  </h1>
                  <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>
                    Stay updated with subscribed farmer harvests, new producer launches, and exclusive product discounts.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FiCheck size={16} /> Mark All as Read ({unreadCount})
                  </button>
                )}

                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    style={{
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#FCA5A5',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FiTrash2 size={16} /> Clear All
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                overflowX: 'auto',
              }}
            >
              {[
                { id: 'All', label: 'All Alerts' },
                { id: 'farmer_product', label: '🌾 Subscribed Farmers' },
                { id: 'new_farmer', label: '🌱 New Farmers Joined' },
                { id: 'discount_offer', label: '🔥 Offers & Discounts' },
                { id: 'order_status', label: '🚚 Orders' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: 'none',
                    background: activeFilter === filter.id ? '#86EFAC' : 'rgba(255,255,255,0.12)',
                    color: activeFilter === filter.id ? '#062414' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center',
              border: '1px solid var(--border-light)',
            }}
          >
            <FiBell size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
              No Notifications Found
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
              You are all caught up! New notifications about harvest updates, newly joined farmers, and special discounts will appear here.
            </p>
            <button
              className="btn-dark-green"
              style={{ display: 'inline-flex' }}
              onClick={() => navigate('/customer/farmers')}
            >
              <FiUserPlus /> Explore Farmers Network
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredNotifications.map((n) => {
              const IconComp = n.icon || FiBell;
              return (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  style={{
                    background: n.unread ? '#F0FDF4' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    border: n.unread ? '1.5px solid #86EFAC' : '1px solid var(--border-light)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: n.badgeColor || '#E2E8F0',
                        color: n.badgeTextColor || '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <IconComp size={22} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--dark-green)' }}>
                          {n.title}
                        </h4>
                        {n.unread && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#16A34A',
                              display: 'inline-block',
                            }}
                          ></span>
                        )}
                      </div>

                      <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                        {n.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiClock size={13} /> {n.time}
                        </span>

                        {n.actionPath && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(n.id);
                              navigate(n.actionPath);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#15803D',
                              fontWeight: 800,
                              cursor: 'pointer',
                              padding: 0,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12.5px',
                            }}
                          >
                            {n.actionText || 'View Details'} <FiArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                    title="Delete notification"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px',
                    }}
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerNotifications;
