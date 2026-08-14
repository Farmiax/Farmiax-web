import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import {
  FiChevronRight, FiCheck, FiBox, FiHeart, FiShoppingCart, FiUsers, FiTag, FiTruck, FiHeadphones, FiSettings
} from 'react-icons/fi';
import '../../styles/dashboard.css';

const CustomerProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Unsplash URLs for realistic data matching Farmiax brand
  const bannerImg = "https://images.unsplash.com/photo-1595856722238-6369cba4ba86?auto=format&fit=crop&w=1200&q=80";
  const tomatoImg = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80";
  const potatoImg = "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80";
  const bananaImg = "https://images.unsplash.com/photo-1571501443685-61266eecfc6f?auto=format&fit=crop&w=400&q=80";
  const milkImg = "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80";

  const riceImg = "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=200&q=80";
  const capsicumImg = "https://images.unsplash.com/photo-1558237373-c1572cbf610e?auto=format&fit=crop&w=200&q=80";
  const corianderImg = "https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&w=200&q=80";
  const farmerImg = "https://images.unsplash.com/photo-1595844730298-b960ff86faa1?auto=format&fit=crop&w=200&q=80";



  const [categories, setCategories] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [topFarmer, setTopFarmer] = useState(null);
  const [activeTracking, setActiveTracking] = useState(null);
  const [metrics, setMetrics] = useState({ orders: 0, wishlist: 0, cart: 0, farmers: 0 });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productService.getAllProducts(),
          orderService.getUserOrders()
        ]);
        
        const allProducts = productsRes || [];
        // Extract a few products for recommendations
        if (allProducts.length > 0) {
          const formattedRecs = allProducts.slice(0, 4).map(p => ({
            id: p._id,
            name: p.name || 'Organic Product',
            img: p.image ? `http://localhost:5000/${p.image}` : tomatoImg,
            farmer: p.farmer || 'Local Farm',
            price: p.price || 0,
            oldPrice: p.oldPrice || p.price * 1.2,
            weight: `${p.quantity || 1} ${p.unit || 'unit'}`,
            rating: 4.5
          }));
          setRecommended(formattedRecs);
        }

        const allOrders = Array.isArray(ordersRes) ? ordersRes : (ordersRes.orders || []);
        setMetrics(prev => ({ ...prev, orders: allOrders.length }));
        
        if (allOrders.length > 0) {
          const recent = allOrders.slice(0, 3).map(o => ({
            id: o._id.substring(0, 8),
            date: new Date(o.createdAt).toLocaleDateString(),
            items: o.Products?.length || 0,
            status: o.status || 'Confirmed',
            statusClass: o.status?.toLowerCase() === 'delivered' ? 'status-delivered' : 'status-confirmed',
            price: o.totalAmount
          }));
          setRecentOrders(recent);
        }
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    };
    if (user) fetchData();
  }, [user]);

  return (
    <CustomerDashboardLayout>
      <div className="dashboard-layout-grid">

            {/* Center Main Content */}
            <div className="dashboard-center-col">

              {/* Welcome Banner */}
              <div className="welcome-banner">
                <div className="welcome-content">
                  <p className="welcome-sub">Welcome back,</p>
                  <h1 className="welcome-title">{user?.fullName}! 👋</h1>
                  <p className="welcome-desc">
                    Good to see you again. Discover fresh products from trusted farmers.
                  </p>
                  <button className="welcome-btn" onClick={() => navigate('/customer/shop')}>Shop Now</button>
                </div>
                <div className="welcome-image-wrapper">
                  <img src={bannerImg} alt="" />
                </div>
              </div>

              {/* Quick Summary Cards */}
              <div className="summary-cards-row">
                <div className="summary-card">
                  <div className="summary-icon"><FiBox size={24} /></div>
                  <div className="summary-info">
                    <h4>Total Orders</h4>
                    <p>{metrics.orders}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon"><FiHeart size={24} /></div>
                  <div className="summary-info">
                    <h4>Wishlist Items</h4>
                    <p>{metrics.wishlist}</p>
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-icon"><FiShoppingCart size={24} /></div>
                  <div className="summary-info">
                    <h4>Cart Items</h4>
                    <p>{metrics.cart}</p>
                  </div>
                </div>
                <div className="summary-card" onClick={() => navigate('/customer/farmers')} style={{ cursor: 'pointer' }}>
                  <div className="summary-icon"><FiUsers size={24} /></div>
                  <div className="summary-info">
                    <h4>Farmers Followed</h4>
                    <p>{(() => {
                      try {
                        const saved = localStorage.getItem('farmiax_followed_farmers');
                        return saved ? JSON.parse(saved).length : 0;
                      } catch {
                        return 0;
                      }
                    })()}</p>
                  </div>
                </div>
              </div>

              {/* Shop by Categories */}
              <div>
                <div className="section-header">
                  <h3 className="section-title">Shop by Categories</h3>
                  <Link to="/customer/shop" className="section-link">View All <FiChevronRight /></Link>
                </div>
                <div className="categories-row">
                  {categories.length > 0 ? categories.map((cat, i) => (
                    <div key={i} className="category-card" onClick={() => navigate(`/customer/shop?category=${cat.name}`)}>
                      <div className="category-icon" style={{ fontSize: '32px', backgroundColor: 'var(--cream-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cat.emoji}</div>
                      <span className="category-name">{cat.name}</span>
                    </div>
                  )) : <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No categories available.</p>}
                </div>
              </div>

              {/* Recommended for You */}
              <div>
                <div className="section-header">
                  <h3 className="section-title">Recommended for You</h3>
                  <Link to="/customer/shop" className="section-link">View All <FiChevronRight /></Link>
                </div>
                <div className="products-grid">
                  {recommended.length > 0 ? recommended.map((prod, i) => (
                    <div key={i} className="product-item">
                      <button className="product-fav-btn"><FiHeart size={16} /></button>
                      <div className="product-img-box">
                        <img src={prod.img} alt={prod.name} />
                      </div>
                      <h4 className="product-name">{prod.name}</h4>
                      <p className="product-farmer"><FiUsers size={12} /> {prod.farmer}</p>
                      <div className="product-rating">
                        ★ {prod.rating}
                      </div>
                      <div className="product-price-row">
                        <span className="product-price">₹{prod.price} <span className="product-old-price">₹{prod.oldPrice}</span></span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{prod.weight}</span>
                      </div>
                      <button className="product-add-btn">
                        <FiShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  )) : <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>No recommendations yet. Start shopping to get personalized suggestions!</p>}
                </div>
              </div>

              {/* Bottom Row: Orders & Tracking */}
              <div className="bottom-split">
                {/* Recent Orders */}
                <div className="dashboard-card">
                  <div className="section-header">
                    <h3 className="section-title">Recent Orders</h3>
                    <Link to="/customer/orders" className="section-link">View All <FiChevronRight /></Link>
                  </div>
                  <div>
                    {recentOrders.length > 0 ? recentOrders.map((order, i) => (
                      <div key={i} className="order-row">
                        <div className="order-row-left">
                          <div className="order-icon-box"><FiBox size={20} /></div>
                          <div>
                            <h4 className="order-title">Order {order.id}</h4>
                            <p className="order-meta">{order.date} • {order.items} Items</p>
                          </div>
                        </div>
                        <div className="order-row-right">
                          <span className={`status-badge ${order.statusClass}`}>{order.status}</span>
                          <span className="order-price">₹{order.price}</span>
                          <Link to="/customer/track-order" className="order-action-link">Track <FiChevronRight size={12} /></Link>
                        </div>
                      </div>
                    )) : <p style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>No recent orders found.</p>}
                  </div>
                </div>

                {/* Track Your Order */}
                <div className="dashboard-card">
                  <div className="section-header">
                    <h3 className="section-title">Track Your Order</h3>
                    <Link to="/customer/track-order" className="section-link">View All <FiChevronRight /></Link>
                  </div>
                  <div className="tracking-widget">
                    {activeTracking ? (
                      <>
                        <div className="tracking-header">
                          <div className="tracking-icon"><FiTruck size={24} /></div>
                          <div className="tracking-info">
                            <h4>Order {activeTracking.id}</h4>
                            <p className="status">{activeTracking.status}</p>
                            <p>Estimated delivery: {activeTracking.eta}</p>
                          </div>
                        </div>
                        <div className="tracking-steps">
                          <div className="tracking-line"></div>
                          <div className="tracking-line-fill"></div>

                          <div className="tracking-step">
                            <div className="step-circle done"><FiCheck size={14} /></div>
                            <span className="step-label done">Placed</span>
                          </div>
                          <div className="tracking-step">
                            <div className="step-circle done"><FiCheck size={14} /></div>
                            <span className="step-label done">Confirmed</span>
                          </div>
                          <div className="tracking-step">
                            <div className="step-circle done"><FiTruck size={12} /></div>
                            <span className="step-label current">On the Way</span>
                          </div>
                          <div className="tracking-step">
                            <div className="step-circle pending"><FiShoppingCart size={12} /></div>
                            <span className="step-label pending">Delivered</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px 0' }}>
                        <FiTruck size={32} color="var(--border-light)" style={{ marginBottom: '12px' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>No active orders to track right now.</p>
                        <button className="offer-btn" style={{ marginTop: '16px' }} onClick={() => navigate('/customer/shop')}>Start Shopping</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar */}
            <div className="dashboard-right-col">

              {/* Your Cart Widget */}
              <div className="dashboard-card">
                <div className="cart-widget-header">
                  <div className="cart-widget-left">
                    <div className="cart-widget-icon"><FiShoppingCart size={20} /></div>
                    <div className="cart-widget-info">
                      <h4>Your Cart</h4>
                      <p>{metrics.cart} Items</p>
                    </div>
                  </div>
                  <span className="cart-widget-price">₹0.00</span>
                </div>
                <button className="cart-widget-btn" onClick={() => navigate('/customer/cart')}>
                  View Cart <FiChevronRight size={16} />
                </button>
              </div>

              {/* Today's Offer */}
              <div className="dashboard-card">
                <div className="offer-widget-title">
                  <div className="icon"><FiTag size={12} /></div>
                  Today's Offer
                </div>

                <div className="offer-banner">
                  <p>Fresh Vegetables</p>
                  <h3>20% OFF</h3>
                  <p className="sub">On all vegetables</p>
                  <img src={capsicumImg} alt="Offer" className="offer-banner-img" />
                </div>

                <div className="offer-actions">
                  <div className="offer-code">Use Code: FARM20</div>
                  <button className="offer-btn" onClick={() => navigate('/customer/shop?tab=offers')}>Shop Now</button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="dashboard-card" style={{ padding: '16px' }}>
                <div className="quick-links-grid">
                  <Link to="/customer/orders" className="quick-link-item"><FiBox size={16} /> Orders</Link>
                  <Link to="/customer/wishlist" className="quick-link-item"><FiHeart size={16} /> Wishlist</Link>
                  <Link to="/customer/profile" className="quick-link-item"><FiSettings size={16} /> Profile</Link>
                  <Link to="/customer#contact" className="quick-link-item"><FiHeadphones size={16} /> Support</Link>
                </div>
              </div>

              {/* Recently Viewed */}
              <div className="dashboard-card">
                <div className="section-header">
                  <h4 className="section-title">Recently Viewed</h4>
                  <Link to="/customer/shop" className="section-link">View All <FiChevronRight size={12} /></Link>
                </div>
                <div className="recent-view-list">
                  {recentlyViewed.length > 0 ? recentlyViewed.map((item, i) => (
                    <div key={i} className="recent-item">
                      <div className="recent-item-left">
                        <img src={item.img} alt={item.name} className="recent-item-img" />
                        <div className="recent-item-info">
                          <h5>{item.name}</h5>
                          <p>{item.weight}</p>
                        </div>
                      </div>
                      <div className="recent-item-right">
                        <span className="recent-item-price">₹{item.price}</span>
                      </div>
                    </div>
                  )) : <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>No recently viewed items.</p>}
                </div>
              </div>

              {/* Top Farmers */}
              <div className="dashboard-card">
                <div className="section-header">
                  <h4 className="section-title">Top Farmers for You</h4>
                  <Link to="/customer/farmers" className="section-link">View All <FiChevronRight size={12} /></Link>
                </div>

                {topFarmer ? (
                  <>
                    <div className="farmer-profile">
                      <img src={farmerImg} alt="Farmer" className="farmer-avatar" />
                      <div className="farmer-info">
                        <h5>{topFarmer.name}</h5>
                        <p><span style={{ color: 'var(--primary-green)' }}>📍</span> {topFarmer.location}</p>
                        <div className="farmer-rating">
                          <span className="star">★</span>
                          <span className="score">{topFarmer.rating}</span>
                          <span className="count">({topFarmer.orders}+ Orders)</span>
                        </div>
                      </div>
                    </div>
                    <button className="farmer-btn" onClick={() => navigate(`/customer/shop?farmer=${topFarmer.id}`)}>View Products</button>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <FiUsers size={32} color="var(--border-light)" style={{ marginBottom: '12px' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Follow farmers to see them here.</p>
                    <button className="farmer-btn" style={{ marginTop: '16px' }} onClick={() => navigate('/customer/farmers')}>Discover Farmers</button>
                  </div>
                )}
              </div>

            </div>
          </div>

        <div className="dashboard-footer">
          <div className="footer-feature"><span>🌿</span> 100% Fresh & Natural</div>
          <div className="footer-feature"><span>👨‍🌾</span> Direct from Farmers</div>
          <div className="footer-feature"><span>🛡️</span> Secure Payments</div>
          <div className="footer-feature"><span>🚚</span> On-time Delivery</div>
          <div className="footer-feature"><span>🔄</span> Easy Returns</div>
        </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerProfile;
