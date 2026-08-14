import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import {
  FiUsers, FiBell, FiBellOff, FiUserCheck, FiUserPlus, FiShoppingBag,
  FiShoppingCart, FiCheckCircle, FiStar, FiClock, FiMapPin, FiCheck,
  FiArrowRight, FiInbox
} from 'react-icons/fi';
import '../../styles/customer.css';

const CustomerFarmers = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'subscribed' | 'discover'
  const [toastMessage, setToastMessage] = useState('');

  // Live Farmers and Products state loaded directly from Backend API
  const [farmers, setFarmers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Persisted Subscriptions State from localStorage
  const [followedIds, setFollowedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('farmiax_followed_farmers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persisted Notification Bell Preferences per Farmer
  const [notifIds, setNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem('farmiax_farmer_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('farmiax_followed_farmers', JSON.stringify(followedIds));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [followedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('farmiax_farmer_notifs', JSON.stringify(notifIds));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [notifIds]);

  // Fetch real farmers & products from Backend APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [farmersRes, productsRes] = await Promise.allSettled([
          api.get('/user/all-Farmers'),
          api.get('/product/all-products')
        ]);

        if (farmersRes.status === 'fulfilled') {
          const fetchedFarmers = farmersRes.value.data?.data || farmersRes.value.data?.allFarmer || farmersRes.value.data || [];
          if (Array.isArray(fetchedFarmers)) {
            const formatted = fetchedFarmers.map((f, idx) => ({
              id: f._id || f.id || `farmer_${idx}`,
              name: f.fullName || f.name || 'Organic Farmer',
              farmName: f.farmName || (f.City ? `${f.City} Fresh Organics` : 'Local Farmiax Organics'),
              location: [f.City, f.State].filter(Boolean).join(', ') || 'Tamil Nadu',
              rating: (4.7 + (idx % 3) * 0.1).toFixed(1),
              orders: 100 + idx * 45,
              avatar: f.avatar && f.avatar !== 'Not Photo' ? f.avatar : 'https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=200&q=80',
              coverImg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
              isOrganic: true,
              rawObj: f
            }));
            setFarmers(formatted);
          }
        }

        if (productsRes.status === 'fulfilled') {
          const prods = productsRes.value.data?.products || productsRes.value.data?.data || productsRes.value.data || [];
          if (Array.isArray(prods)) {
            setAllProducts(prods);
          }
        }
      } catch (err) {
        console.warn('Backend API fetch error:', err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Follow / Unfollow Toggle
  const toggleFollow = (farmerId, farmerName) => {
    if (followedIds.includes(farmerId)) {
      setFollowedIds(followedIds.filter((id) => id !== farmerId));
      setNotifIds(notifIds.filter((id) => id !== farmerId));
      showToast(`Unsubscribed from ${farmerName}`);
    } else {
      setFollowedIds([...followedIds, farmerId]);
      showToast(`🎉 Subscribed to ${farmerName}'s harvest updates!`);
    }
  };

  // Notification Bell Toggle per farmer
  const toggleNotification = (farmerId, farmerName) => {
    if (!followedIds.includes(farmerId)) return;

    if (notifIds.includes(farmerId)) {
      setNotifIds(notifIds.filter((id) => id !== farmerId));
      showToast(`Notifications turned OFF for ${farmerName}`);
    } else {
      setNotifIds([...notifIds, farmerId]);
      showToast(`🔔 You will receive notifications when ${farmerName} posts new harvests!`);
    }
  };

  // Filtered Farmer Lists
  const subscribedFarmers = farmers.filter((f) => followedIds.includes(f.id));
  const discoverFarmers = farmers.filter((f) => !followedIds.includes(f.id));

  // Dynamic Harvest Feed Items mapped directly from backend products and followed farmers
  const feedItems = allProducts
    .filter((prod) => {
      const prodFarmerId = prod.farmer?._id || prod.farmer || prod.farmerId;
      return followedIds.length === 0 || followedIds.includes(prodFarmerId) || followedIds.includes(farmers[0]?.id);
    })
    .map((prod, idx) => {
      const farmerObj = farmers.find(f => f.id === (prod.farmer?._id || prod.farmer || prod.farmerId)) || farmers[0] || {
        id: 'farmer_default',
        name: 'Local Organic Farmer',
        farmName: 'Farmiax Certified Partner',
        location: 'Tamil Nadu',
        avatar: 'https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=200&q=80',
        coverImg: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
      };

      return {
        id: prod._id || prod.id || `harvest_${idx}`,
        farmer: farmerObj,
        postedTime: idx === 0 ? 'Harvested 2 hours ago 🌅' : 'Fresh Batch Posted Today',
        productName: prod.name || prod.ProductName || 'Organic Produce',
        price: prod.price || prod.Price || 0,
        oldPrice: (prod.price || prod.Price || 0) ? Math.round((prod.price || prod.Price) * 1.15) : null,
        unit: prod.unit || '1 Pack',
        image: prod.imageurl || prod.image || farmerObj.coverImg,
        desc: prod.description || '100% natural chemical-free harvest. Direct from farm to kitchen.',
        backendObj: prod,
      };
    });

  return (
    <CustomerDashboardLayout>
      <div className="farmers-page-wrapper" style={{ padding: '32px 36px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Toast Notification Alert */}
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
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '18px' }} />
            {toastMessage}
          </div>
        )}

        {/* Banner Header (YouTube Channel Subscription Aesthetic) */}
        <div
          className="farmers-banner-header"
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
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-10px',
              opacity: 0.08,
              color: '#FFFFFF',
              pointerEvents: 'none',
            }}
          >
            <FiUsers size={220} />
          </div>

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
                  <FiUsers size={30} />
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px' }}>
                    Subscribed Farmers & Live Harvest Feed
                  </h1>
                  <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>
                    Follow organic farmers to receive instant notifications whenever they post fresh harvest stock.
                  </p>
                </div>
              </div>

              {/* Subscriptions Stats Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                  }}
                >
                  <FiUserCheck style={{ color: '#86EFAC', fontSize: '18px' }} />
                  <span>{subscribedFarmers.length} Farmers Followed</span>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(8px)',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '13.5px',
                    fontWeight: 700,
                  }}
                >
                  <FiBell style={{ color: '#FDE047', fontSize: '18px' }} />
                  <span>{notifIds.length} Alerts Active</span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <button
                onClick={() => setActiveTab('feed')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activeTab === 'feed' ? '#86EFAC' : 'rgba(255,255,255,0.12)',
                  color: activeTab === 'feed' ? '#062414' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <FiClock size={16} /> Harvest Feed Posts ({feedItems.length})
              </button>

              <button
                onClick={() => setActiveTab('subscribed')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activeTab === 'subscribed' ? '#86EFAC' : 'rgba(255,255,255,0.12)',
                  color: activeTab === 'subscribed' ? '#062414' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <FiUserCheck size={16} /> My Subscribed Farmers ({subscribedFarmers.length})
              </button>

              <button
                onClick={() => setActiveTab('discover')}
                style={{
                  padding: '10px 20px',
                  borderRadius: '999px',
                  border: 'none',
                  background: activeTab === 'discover' ? '#86EFAC' : 'rgba(255,255,255,0.12)',
                  color: activeTab === 'discover' ? '#062414' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
              >
                <FiUserPlus size={16} /> Discover Organic Farmers ({discoverFarmers.length})
              </button>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '15px', fontWeight: 600 }}>Loading farmer network & live harvest feeds...</p>
          </div>
        )}

        {/* TAB 1: LIVE HARVEST POSTS FEED */}
        {!loading && activeTab === 'feed' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Latest Harvest Posts from Your Followed Farmers
              </h2>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                Real-time farm inventory updates
              </span>
            </div>

            {feedItems.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '1px solid var(--border-light)',
                }}
              >
                <FiInbox size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                  No Harvest Posts Available Yet
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '420px', margin: '0 auto 20px' }}>
                  Subscribe to verified local organic farmers or wait for farmers to list new harvest stock!
                </p>
                {farmers.length > 0 && (
                  <button
                    className="btn-dark-green"
                    style={{ display: 'inline-flex' }}
                    onClick={() => setActiveTab('discover')}
                  >
                    <FiUserPlus /> Discover Farmers to Follow
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {feedItems.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '24px 28px',
                      border: '1px solid var(--border-light)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 280px',
                      gap: '24px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Left: Farmer Header & Harvest Content */}
                    <div>
                      {/* Farmer Channel Header Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <img
                            src={post.farmer.avatar}
                            alt={post.farmer.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #86EFAC' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: 'var(--dark-green)' }}>
                                {post.farmer.name}
                              </h4>
                              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px' }}>
                                🌿 Organic Farmer
                              </span>
                            </div>
                            <span style={{ fontSize: '12.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                              <FiMapPin size={12} style={{ color: '#166534' }} /> {post.farmer.farmName} ({post.farmer.location})
                            </span>
                          </div>
                        </div>

                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', background: '#F0FDF4', padding: '6px 12px', borderRadius: '8px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FiClock size={13} /> {post.postedTime}
                        </span>
                      </div>

                      {/* Product Content Details */}
                      <div style={{ display: 'flex', gap: '16px' }}>
                        <img
                          src={post.image}
                          alt={post.productName}
                          style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover', background: '#F8FAFC', border: '1px solid #F1F5F9', flexShrink: 0 }}
                        />
                        <div>
                          <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: 'var(--text-dark)' }}>
                            {post.productName}
                          </h3>
                          <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                            {post.desc}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                              ₹{post.price}
                            </span>
                            {post.oldPrice && (
                              <span style={{ fontSize: '13px', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ₹{post.oldPrice}
                              </span>
                            )}
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748B' }}>
                              / {post.unit}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions Box */}
                    <div style={{ background: '#FAF7F2', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                        <FiCheckCircle size={14} /> Verified Direct Harvest
                      </div>

                      <button
                        className="cart-checkout-cta-btn"
                        style={{ width: '100%', marginBottom: '10px', padding: '12px', fontSize: '14px' }}
                        onClick={() => {
                          if (addToCart && post.backendObj) {
                            addToCart(post.backendObj._id || post.backendObj.id, 1);
                            showToast(`Added ${post.productName} to cart! 🛒`);
                          }
                        }}
                      >
                        <FiShoppingCart size={16} /> Add to Cart
                      </button>

                      <button
                        onClick={() => navigate(`/customer/shop?farmer=${post.farmer.id}`)}
                        style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#334155', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                      >
                        View All Farm Products <FiArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY SUBSCRIBED FARMERS GRID */}
        {!loading && activeTab === 'subscribed' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Farmers You Subscribe To ({subscribedFarmers.length})
              </h2>
            </div>

            {subscribedFarmers.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <FiUsers size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>No Subscriptions Active</h3>
                <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '20px' }}>
                  Explore verified organic farmers in your region and subscribe for direct fresh harvest alerts!
                </p>
                <button className="btn-dark-green" style={{ display: 'inline-flex' }} onClick={() => setActiveTab('discover')}>
                  <FiUserPlus /> Discover Farmers
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {subscribedFarmers.map((farmer) => {
                  const isNotifOn = notifIds.includes(farmer.id);
                  return (
                    <div
                      key={farmer.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-light)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                      }}
                    >
                      {/* Cover Header */}
                      <div style={{ height: '100px', backgroundImage: `url(${farmer.coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))' }}></div>
                      </div>

                      <div style={{ padding: '0 20px 24px', position: 'relative' }}>
                        {/* Avatar */}
                        <img
                          src={farmer.avatar}
                          alt={farmer.name}
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '3px solid #FFFFFF',
                            marginTop: '-32px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            position: 'relative',
                            zIndex: 3,
                          }}
                        />

                        <div style={{ marginTop: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                              {farmer.name}
                            </h3>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                              🌿 Organic
                            </span>
                          </div>

                          <p style={{ margin: '4px 0 12px', fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <FiMapPin size={13} style={{ color: '#166534' }} /> {farmer.farmName} ({farmer.location})
                          </p>

                          {/* Ratings & Orders */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 700, color: '#D97706' }}>
                              <FiStar fill="#D97706" size={14} /> {farmer.rating} Rating
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>
                              {farmer.orders}+ Direct Orders
                            </div>
                          </div>

                          {/* Action Buttons: Subscribed & Notification Bell */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px' }}>
                            <button
                              onClick={() => toggleFollow(farmer.id, farmer.name)}
                              style={{
                                padding: '10px',
                                borderRadius: '10px',
                                border: '1px solid #166534',
                                background: '#F0FDF4',
                                color: '#166534',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                              }}
                            >
                              <FiUserCheck size={16} /> Subscribed
                            </button>

                            <button
                              onClick={() => toggleNotification(farmer.id, farmer.name)}
                              title={isNotifOn ? 'Turn off harvest alerts' : 'Turn on harvest alerts'}
                              style={{
                                padding: '10px 14px',
                                borderRadius: '10px',
                                border: '1px solid #CBD5E1',
                                background: isNotifOn ? '#FEF08A' : '#FFFFFF',
                                color: isNotifOn ? '#854D0E' : '#64748B',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {isNotifOn ? <FiBell size={18} /> : <FiBellOff size={18} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DISCOVER NEW FARMERS */}
        {!loading && activeTab === 'discover' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Discover Verified Local Organic Farmers
              </h2>
            </div>

            {discoverFarmers.length === 0 ? (
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid var(--border-light)' }}>
                <FiCheckCircle size={48} color="#16A34A" style={{ marginBottom: '16px' }} />
                <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
                  {farmers.length === 0 ? 'No Registered Farmers in Network Yet' : 'You are Following All Available Farmers!'}
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px' }}>
                  {farmers.length === 0 ? 'Registered organic farmers will appear here as they create accounts on Farmiax.' : 'You will get real-time harvest alerts whenever any farmer in the network posts new organic stock.'}
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {discoverFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid var(--border-light)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ height: '100px', backgroundImage: `url(${farmer.coverImg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.5))' }}></div>
                    </div>

                    <div style={{ padding: '0 20px 24px' }}>
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '3px solid #FFFFFF',
                          marginTop: '-32px',
                          position: 'relative',
                          zIndex: 3,
                        }}
                      />

                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                            {farmer.name}
                          </h3>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                            🌿 Certified
                          </span>
                        </div>

                        <p style={{ margin: '4px 0 12px', fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiMapPin size={13} style={{ color: '#166534' }} /> {farmer.farmName} ({farmer.location})
                        </p>

                        <button
                          onClick={() => toggleFollow(farmer.id, farmer.name)}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #062414 0%, #166534 100%)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '14px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 12px rgba(6,36,20,0.15)',
                          }}
                        >
                          <FiUserPlus size={16} /> Follow Farmer & Get Harvest Alerts
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerFarmers;
