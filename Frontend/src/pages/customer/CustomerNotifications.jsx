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

const CustomerNotifications = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Persisted Notifications state in localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('farmiax_customer_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
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
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '32px 40px',
            color: '#1F2937',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
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
                    background: 'rgba(255, 255, 255, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0B5D38',
                  }}
                >
                  <FiBell size={30} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#062414', letterSpacing: '-0.5px' }}>
                    Notifications & Harvest Alerts
                  </h1>
                  <p style={{ margin: '4px 0 0', opacity: 0.9, fontSize: '14px', color: '#475569' }}>
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
                      background: '#0B5D38',
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
                      background: 'transparent',
                      color: '#EF4444',
                      border: '1.5px solid #EF4444',
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
                borderTop: '1px solid rgba(0,0,0,0.08)',
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
                    background: activeFilter === filter.id ? '#0B5D38' : 'rgba(255, 255, 255, 0.6)',
                    color: activeFilter === filter.id ? '#FFFFFF' : '#062414',
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
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '60px 40px',
              textAlign: 'center',
              color: '#1F2937',
            }}
          >
            <FiBell size={48} color="#0B5D38" style={{ marginBottom: '16px' }} />
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
              No Notifications Found
            </h3>
            <p style={{ color: '#475569', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
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
                    background: n.unread ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.45)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    border: n.unread ? '1.5px solid #0B5D38' : '1px solid rgba(255, 255, 255, 0.6)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '20px',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    color: '#1F2937',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#DCFCE7',
                        color: '#15803D',
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
                        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#062414' }}>
                          {n.title}
                        </h4>
                        {n.unread && (
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#0B5D38',
                              display: 'inline-block',
                            }}
                          ></span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', display: 'inline-block' }}>
                        {n.time}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {n.actionLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(n.actionLink);
                        }}
                        style={{
                          background: '#0B5D38',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        View Details <FiArrowRight size={13} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(n.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '6px',
                      }}
                      title="Delete Notification"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
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
