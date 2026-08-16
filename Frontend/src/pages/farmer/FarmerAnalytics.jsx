import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-analytics.css';

// --- Mock Data ---
const revenueData = [
  { name: 'Jan', revenue: 6000 },
  { name: 'Feb', revenue: 23000 },
  { name: 'Mar', revenue: 22000 },
  { name: 'Apr', revenue: 30000 },
  { name: 'May', revenue: 40000 },
  { name: 'Jun', revenue: 45320 },
];

const viewsData = [
  { val: 10 }, { val: 25 }, { val: 20 }, { val: 40 }, { val: 35 }, { val: 50 }, { val: 65 }, { val: 60 }
];
const clicksData = [
  { val: 30 }, { val: 45 }, { val: 35 }, { val: 55 }, { val: 45 }, { val: 65 }, { val: 80 }, { val: 75 }
];
const conversionData = [
  { val: 1 }, { val: 2 }, { val: 1.5 }, { val: 3 }, { val: 2.5 }, { val: 4 }, { val: 3.2 }, { val: 3.5 }
];
const returningData = [
  { val: 50 }, { val: 65 }, { val: 55 }, { val: 80 }, { val: 70 }, { val: 95 }, { val: 110 }, { val: 120 }
];

const topProducts = [
  { name: 'Organic Cherry Tomatoes', sales: '3,450 Sales', percent: 85, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&q=80' },
  { name: 'Premium Wheat Seeds', sales: '2,800 Sales', percent: 70, img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&q=80' },
  { name: 'Natural Soil Enhancer', sales: '1,950 Sales', percent: 50, img: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=100&q=80' },
];

const topLocations = [
  { name: 'California, USA', count: '4,500 Orders', percent: '36%' },
  { name: 'Iowa, USA', count: '3,200 Orders', percent: '25%' },
  { name: 'Ontario, Canada', count: '2,100 Orders', percent: '17%' },
  { name: 'Nebraska, USA', count: '1,500 Orders', percent: '12%' },
  { name: 'Texas, USA', count: '1,150 Orders', percent: '10%' },
];

const FarmerAnalytics = () => {
  return (
    <div className="farmer-layout">
      {/* Sidebar */}
      <aside className="farmer-sidebar">
        <div className="farmer-sidebar-logo" style={{ padding: '12px 0', justifyContent: 'center' }}>
          <Logo size="xl" />
        </div>
        <nav className="farmer-nav">
          <Link to="/farmer/dashboard" className="farmer-nav-item">
            <i className="ri-home-5-line"></i> Dashboard
          </Link>
          <Link to="/farmer/orders" className="farmer-nav-item">
            <i className="ri-file-list-3-line"></i> Orders
          </Link>
          <Link to="/farmer/products" className="farmer-nav-item">
            <i className="ri-landscape-line"></i> Products
          </Link>
          <Link to="/farmer/inventory" className="farmer-nav-item">
            <i className="ri-box-3-line"></i> Inventory
          </Link>
          <Link to="/farmer/customers" className="farmer-nav-item">
            <i className="ri-group-line"></i> Customers
          </Link>
          <Link to="/farmer/earnings" className="farmer-nav-item">
            <i className="ri-money-dollar-circle-line"></i> Earnings
          </Link>
          <Link to="/farmer/analytics" className="farmer-nav-item active">
            <i className="ri-bar-chart-box-line"></i> Analytics
          </Link>
          <Link to="/farmer/payouts" className="farmer-nav-item">
            <i className="ri-bank-card-line"></i> Payouts
          </Link>
          <Link to="/farmer/reviews" className="farmer-nav-item">
            <i className="ri-star-line"></i> Reviews
          </Link>
          <Link to="/farmer/messages" className="farmer-nav-item">
            <i className="ri-message-3-line"></i> Messages
          </Link>
          <Link to="/farmer/profile" className="farmer-nav-item">
            <i className="ri-user-settings-line"></i> Farm Profile
          </Link>
          <Link to="/farmer/settings" className="farmer-nav-item">
            <i className="ri-settings-3-line"></i> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="farmer-main" style={{ background: 'transparent' }}>
        {/* Header */}
        <header className="farmer-header">
          <div className="farmer-search">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Search orders, products, or insights..." />
          </div>
          <div className="farmer-header-right">
            <Link to="/farmer/notifications" className="header-notif-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-notification-3-line" style={{ fontSize: '20px', color: '#111' }}></i>
            </Link>
            <Link to="/farmer/profile" className="header-profile" style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src="https://ui-avatars.com/api/?name=FA&background=FCE06D&color=000" alt="Farmer" />
              <span>Farmer</span>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="farmer-content" style={{ padding: '24px 32px' }}>

          <h1 className="analytics-page-title">Farm Performance Metrics</h1>

          {/* Top KPI Row */}
          <div className="analytics-kpi-row">
            {/* KPI 1 */}
            <div className="analytics-kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Farm Profile Views</span>
                <span className="kpi-icon-wrapper" style={{ color: '#d97706' }}>🚜</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">12,450</span>
              </div>
              <div className="kpi-trend positive">↗ +8.5%</div>
              <div className="kpi-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={viewsData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#28a745" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#28a745" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#28a745" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="analytics-kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Product Clicks</span>
                <span className="kpi-icon-wrapper" style={{ color: '#007bff' }}>🛒</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">45,210</span>
              </div>
              <div className="kpi-trend neutral">↗ +12.1%</div>
              <div className="kpi-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={clicksData}>
                    <defs>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007bff" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007bff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#007bff" strokeWidth={2} fillOpacity={1} fill="url(#colorClicks)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="analytics-kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Conversion Rate</span>
                <span className="kpi-icon-wrapper" style={{ color: '#fd7e14' }}>🏷️</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">3.2%</span>
              </div>
              <div className="kpi-trend orange">↗ +0.4%</div>
              <div className="kpi-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={conversionData}>
                    <defs>
                      <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fd7e14" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fd7e14" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#fd7e14" strokeWidth={2} fillOpacity={1} fill="url(#colorConv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="analytics-kpi-card">
              <div className="kpi-header">
                <span className="kpi-title">Returning Customers</span>
                <span className="kpi-icon-wrapper" style={{ color: '#6f42c1' }}>🤝</span>
              </div>
              <div className="kpi-value-row">
                <span className="kpi-value">1,850</span>
              </div>
              <div className="kpi-trend purple">↗ +6.3%</div>
              <div className="kpi-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={returningData}>
                    <defs>
                      <linearGradient id="colorRet" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6f42c1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6f42c1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#6f42c1" strokeWidth={2} fillOpacity={1} fill="url(#colorRet)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="analytics-map-section">
            <h3 className="analytics-map-title">Geographic Reach & Top Locations</h3>
            <div className="map-content-grid">
              <div className="map-placeholder">
                {/* Fallback CSS map layout */}
                <div className="css-map"></div>
              </div>
              <div className="locations-list">
                <h4>Top Customer Locations</h4>
                {topLocations.map((loc, idx) => (
                  <div className="location-item" key={idx}>
                    <span>{idx + 1}. {loc.name} - {loc.count}</span>
                    <strong>({loc.percent})</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <h2 className="analytics-page-title mt-5">Sales & Revenue Analytics</h2>
          <div className="sales-revenue-wrapper">
            <div className="analytics-sales-section">
              {/* Large Revenue Chart */}
              <div className="sales-chart-card">
                <h3 style={{ marginBottom: '20px', fontSize: '16px', fontWeight: '600' }}>Revenue Trend</h3>
                <div style={{ width: '100%', height: '350px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#73c028" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#73c028" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888', fontSize: 13 }} dy={10} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `$${val / 1000}K`}
                        tick={{ fill: '#888', fontSize: 13 }}
                        dx={-10}
                      />
                      <CartesianGrid vertical={false} stroke="#eee" />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#73c028" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Mini KPIs and Top Products */}
              <div className="sales-right-column">
                <div className="sales-mini-kpi-row">
                  <div className="sales-mini-kpi">
                    <h4>Monthly Sales</h4>
                    <div className="val">$45,320 <span style={{ color: '#28a745', fontSize: '18px' }}>↗</span></div>
                    <div className="trend">+12% <span style={{ color: '#666', fontWeight: '400' }}>from last month</span></div>
                  </div>
                  <div className="sales-mini-kpi">
                    <h4>Weekly Orders</h4>
                    <div className="val">1,250 <span style={{ color: '#28a745', fontSize: '18px' }}>↗</span></div>
                    <div className="trend">+5% <span style={{ color: '#666', fontWeight: '400' }}>from last week</span></div>
                  </div>
                </div>

                <div className="top-products-card">
                  <h4>Top Performing Products</h4>
                  {topProducts.map((prod, idx) => (
                    <div className="top-product-item" key={idx}>
                      <img src={prod.img} alt={prod.name} className="top-product-img" />
                      <div className="top-product-info">
                        <h5>{prod.name}</h5>
                        <p>{prod.sales}</p>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${prod.percent}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FarmerAnalytics;
