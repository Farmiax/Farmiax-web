import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import FarmerAIChatSupport from '../../components/common/FarmerAIChatSupport';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-dashboard-redesign.css';

const FarmerDashboard = () => {
  // State structured according to expected backend payload
  const [dashboardData, setDashboardData] = useState({
    farmerName: 'Ramesh Kumar',
    farmName: 'Green Valley Farm',
    location: 'Coimbatore, Tamil Nadu',
    farmerSince: 'Jan 2023',
    kpis: {
      totalOrders: { value: 128, trend: '+18%', isPositive: true },
      totalRevenue: { value: 78560, trend: '+22%', isPositive: true },
      productsListed: { value: 24, trend: '', isPositive: true },
      totalCustomers: { value: 356, trend: '+14%', isPositive: true },
      averageRating: { value: 4.7, reviewsCount: 128 }
    },
    salesOverview: [
      { date: '1 Aug', revenue: 10000 },
      { date: '5 Aug', revenue: 12000 },
      { date: '10 Aug', revenue: 18000 },
      { date: '15 Aug', revenue: 14000 },
      { date: '20 Aug', revenue: 22000 },
      { date: '25 Aug', revenue: 16000 },
      { date: '31 Aug', revenue: 25000 }
    ],
    ordersOverview: [
      { name: 'Delivered', value: 72, color: '#28a745' },
      { name: 'Shipped', value: 28, color: '#007bff' },
      { name: 'Packed', value: 16, color: '#fd7e14' },
      { name: 'Pending', value: 12, color: '#6c757d' }
    ],
    recentOrders: [
      { id: '#FX20250814', customer: 'Arun Kumar', items: '4 Items', amount: 1250, status: 'Pending', date: '14 Aug 2025' },
      { id: '#FX20250813', customer: 'Meera Devi', items: '2 Items', amount: 680, status: 'Packed', date: '13 Aug 2025' },
      { id: '#FX20250812', customer: 'Suresh Babu', items: '3 Items', amount: 920, status: 'Shipped', date: '12 Aug 2025' },
      { id: '#FX20250811', customer: 'Kavitha R.', items: '5 Items', amount: 1780, status: 'Delivered', date: '11 Aug 2025' },
      { id: '#FX20250810', customer: 'Raghul V.', items: '1 Item', amount: 350, status: 'Delivered', date: '10 Aug 2025' }
    ],
    topProducts: [
      { name: 'Organic Tomatoes', qty: '120 kg', revenue: 2400, img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&q=80' },
      { name: 'Fresh Spinach', qty: '90 kg', revenue: 1800, img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&q=80' },
      { name: 'Carrots', qty: '85 kg', revenue: 1700, img: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&q=80' },
      { name: 'Green Capsicum', qty: '70 kg', revenue: 1400, img: 'https://images.unsplash.com/photo-1563514222080-60b5d92df917?w=100&q=80' },
      { name: 'Cucumbers', qty: '60 kg', revenue: 1200, img: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=100&q=80' }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch to backend `/api/farmer/dashboard`
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'packed': return 'packed';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      default: return 'pending';
    }
  };

  return (
    <div className="farmer-layout">
      {/* Sidebar Navigation */}
      <aside className="farmer-sidebar">
        <div className="farmer-sidebar-logo" style={{ padding: '12px 0', justifyContent: 'center' }}>
          <Logo size="xl" />
        </div>
        <nav className="farmer-nav">
          <Link to="/farmer/dashboard" className="farmer-nav-item active">
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
          <Link to="/farmer/analytics" className="farmer-nav-item">
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

      {/* Main Content Area */}
      <div className="farmer-main">
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

        {/* Dashboard Content */}
        <main className="farmer-dashboard-wrapper">
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading dashboard data...</div>
          ) : (
            <>

              {/* KPI 5-Column Grid */}
              <div className="kpi-grid-5">
                <div className="kpi-card-new">
                  <div className="kpi-header">
                    <div className="icon-box green-light"><i className="ri-shopping-bag-line"></i></div>
                    <span className="kpi-title">Total Orders</span>
                  </div>
                  <div className="kpi-value">{dashboardData.kpis.totalOrders.value}</div>
                  <div className="kpi-trend trend-up">↗ {dashboardData.kpis.totalOrders.trend} <span style={{ color: '#666', fontWeight: '400' }}>vs last month</span></div>
                </div>

                <div className="kpi-card-new">
                  <div className="kpi-header">
                    <div className="icon-box purple-light">₹</div>
                    <span className="kpi-title">Total Revenue</span>
                  </div>
                  <div className="kpi-value">₹{dashboardData.kpis.totalRevenue.value.toLocaleString()}</div>
                  <div className="kpi-trend trend-up">↗ {dashboardData.kpis.totalRevenue.trend} <span style={{ color: '#666', fontWeight: '400' }}>vs last month</span></div>
                </div>

                <div className="kpi-card-new">
                  <div className="kpi-header">
                    <div className="icon-box blue-light"><i className="ri-box-3-line"></i></div>
                    <span className="kpi-title">Products Listed</span>
                  </div>
                  <div className="kpi-value">{dashboardData.kpis.productsListed.value}</div>
                  <div className="kpi-trend"><span style={{ color: '#666', fontWeight: '400' }}>vs last month</span></div>
                </div>

                <div className="kpi-card-new">
                  <div className="kpi-header">
                    <div className="icon-box orange-light"><i className="ri-group-line"></i></div>
                    <span className="kpi-title">Total Customers</span>
                  </div>
                  <div className="kpi-value">{dashboardData.kpis.totalCustomers.value}</div>
                  <div className="kpi-trend trend-up">↗ {dashboardData.kpis.totalCustomers.trend} <span style={{ color: '#666', fontWeight: '400' }}>vs last month</span></div>
                </div>

                <div className="kpi-card-new">
                  <div className="kpi-header">
                    <div className="icon-box yellow-light"><i className="ri-star-line"></i></div>
                    <span className="kpi-title">Average Rating</span>
                  </div>
                  <div className="kpi-value" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {dashboardData.kpis.averageRating.value} <i className="ri-star-fill" style={{ color: '#fbc02d', fontSize: '18px' }}></i>
                  </div>
                  <div className="kpi-trend"><span style={{ color: '#666', fontWeight: '400' }}>({dashboardData.kpis.averageRating.reviewsCount} reviews)</span></div>
                </div>
              </div>

              {/* Chart Grid (2 Columns) */}
              <div className="chart-grid-2">
                {/* Sales Overview Line Chart */}
                <div className="chart-card-new">
                  <div className="chart-card-header">
                    <div>
                      <h3 className="chart-card-title">Sales Overview</h3>
                      <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '8px' }}>₹ {dashboardData.kpis.totalRevenue.value.toLocaleString()}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Revenue <span style={{ color: '#28a745', marginLeft: '12px' }}>↗ 22% vs last month</span></div>
                    </div>
                    <select style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}>
                      <option>This Month</option>
                      <option>Last Month</option>
                    </select>
                  </div>
                  <div style={{ height: '200px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dashboardData.salesOverview} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(val) => `₹${val / 1000}k`} />
                        <Tooltip formatter={(value) => `₹${value}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={3} dot={{ r: 4, fill: '#28a745', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Orders Overview Donut Chart */}
                <div className="chart-card-new">
                  <div className="chart-card-header">
                    <h3 className="chart-card-title">Orders Overview</h3>
                    <select style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}>
                      <option>This Month</option>
                    </select>
                  </div>
                  <div style={{ height: '220px', width: '100%', position: 'relative' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={dashboardData.ordersOverview}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {dashboardData.ordersOverview.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: '700' }}>{dashboardData.kpis.totalOrders.value}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Total Orders</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom 3-Column Grid */}
              <div className="bottom-grid-3">

                {/* Recent Orders Table */}
                <div className="table-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="chart-card-title">Recent Orders</h3>
                    <Link to="/farmer/orders" style={{ fontSize: '13px', color: '#28a745', textDecoration: 'none', fontWeight: '500' }}>View all</Link>
                  </div>
                  <table className="recent-orders-table-new">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.recentOrders.map((order, idx) => (
                        <tr key={idx}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.items}</td>
                          <td style={{ fontWeight: '500' }}>₹ {order.amount.toLocaleString()}</td>
                          <td><span className={`status-badge-new ${getStatusClass(order.status)}`}>{order.status}</span></td>
                          <td style={{ color: '#666' }}>{order.date}</td>
                          <td>
                            <button className="action-btn-eye"><i className="ri-eye-line"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Top Selling Products */}
                <div className="table-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 className="chart-card-title">Top Selling Products</h3>
                    <Link to="/farmer/products" style={{ fontSize: '13px', color: '#28a745', textDecoration: 'none', fontWeight: '500' }}>View all</Link>
                  </div>
                  <div className="top-products-list">
                    {dashboardData.topProducts.map((prod, idx) => (
                      <div className="top-product-item-new" key={idx}>
                        <img src={prod.img} alt={prod.name} className="top-product-img-new" />
                        <div className="top-product-info-new">
                          <h5>{prod.name}</h5>
                          <p>{prod.qty}</p>
                        </div>
                        <div className="top-product-price">₹ {prod.revenue.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions & Help */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="chart-card-title" style={{ marginBottom: '16px' }}>Quick Actions</h3>
                  <div className="quick-actions-grid">
                    <Link to="/farmer/products/add" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                      <i className="ri-add-box-line"></i>
                      <span>Add Product</span>
                    </Link>
                    <Link to="/farmer/inventory" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                      <i className="ri-box-3-line"></i>
                      <span>Manage Inventory</span>
                    </Link>
                    <Link to="/farmer/orders" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                      <i className="ri-file-list-3-line"></i>
                      <span>View Orders</span>
                    </Link>
                    <Link to="/farmer/analytics" className="quick-action-btn" style={{ textDecoration: 'none' }}>
                      <i className="ri-bar-chart-line"></i>
                      <span>Sales Report</span>
                    </Link>
                  </div>


                </div>

              </div>

            </>
          )}
        </main>
      </div>

      {/* Floating AI Customer Support Button & Chat Widget */}
      <FarmerAIChatSupport />
    </div>
  );
};

export default FarmerDashboard;
