import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  FiTrendingUp, FiShoppingBag, FiBox, FiUsers, FiDollarSign,
  FiStar, FiArrowUpRight, FiPlus, FiEye
} from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-dashboard-redesign.css';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [farmerOrders, setFarmerOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [prodsRes, ordersRes] = await Promise.allSettled([
          productService.getFarmerProducts(user?._id),
          orderService.getFarmerOrders()
        ]);

        if (prodsRes.status === 'fulfilled') {
          const prods = Array.isArray(prodsRes.value) ? prodsRes.value : (prodsRes.value?.data || []);
          setFarmerProducts(prods);
        }

        if (ordersRes.status === 'fulfilled') {
          const ords = Array.isArray(ordersRes.value) ? ordersRes.value : (ordersRes.value?.data || []);
          setFarmerOrders(ords);
        }
      } catch (err) {
        console.warn('Dashboard data fetch notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?._id]);

  const totalProductsCount = farmerProducts.length;
  const totalOrdersCount = farmerOrders.length;
  const totalRevenue = farmerOrders.reduce((sum, ord) => sum + Number(ord.totalAmount || ord.actualAmount || 0), 0);

  // Group actual order statuses
  const statusCounts = farmerOrders.reduce((acc, o) => {
    const s = o.status || 'Processing';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const ordersOverview = [
    { name: 'Delivered', value: statusCounts['Delivered'] || 0, color: '#22C55E' },
    { name: 'Shipped', value: (statusCounts['Shipped'] || 0) + (statusCounts['Out for Delivery'] || 0), color: '#3B82F6' },
    { name: 'Processing', value: (statusCounts['Processing'] || 0) + (statusCounts['Order Placed'] || 0), color: '#F59E0B' },
    { name: 'Pending', value: statusCounts['Pending'] || 0, color: '#94A3B8' },
  ];

  const salesOverview = farmerOrders.length > 0
    ? farmerOrders.slice(-6).map((ord, idx) => ({
        date: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : `Order ${idx + 1}`,
        revenue: Number(ord.totalAmount || ord.actualAmount || 0),
      }))
    : [];

  const recentOrdersList = farmerOrders.slice(0, 5);

  const getStatusClass = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 'pending';
      case 'packed':
      case 'processing': return 'packed';
      case 'shipped':
      case 'out for delivery': return 'shipped';
      case 'delivered': return 'delivered';
      default: return 'pending';
    }
  };

  return (
    <FarmerDashboardLayout activeNav="dashboard">
      <div className="farmer-dashboard-view">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header-box">
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Welcome back, {user?.fullName || 'Farmer Partner'} 🌾
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.95)', fontSize: '15px', textShadow: '0 1px 3px rgba(0,0,0,0.3)', fontWeight: 500 }}>
              Here is what's happening with your farm crops and orders today.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/farmer/products"
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 22px',
                fontSize: '14px',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                boxShadow: '0 4px 16px rgba(22, 101, 52, 0.4)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <FiPlus size={18} /> Add New Crop
            </Link>
          </div>
        </div>

        {/* 4 Metric KPI Glass Cards */}
        <div className="farmer-kpis-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px', marginBottom: '28px' }}>
          {/* Revenue */}
          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gross Revenue
              </span>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.25)', border: '1px solid rgba(74, 222, 128, 0.4)', color: '#86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiDollarSign size={22} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              ₹{totalRevenue.toLocaleString()}
            </h2>
          </div>

          {/* Orders */}
          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Total Orders
              </span>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.25)', border: '1px solid rgba(96, 165, 250, 0.4)', color: '#93C5FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiBox size={22} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              {totalOrdersCount}
            </h2>
          </div>

          {/* Products Listed */}
          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Produce Items
              </span>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.25)', border: '1px solid rgba(251, 191, 36, 0.4)', color: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiShoppingBag size={22} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', color: '#FFFFFF', letterSpacing: '-0.5px' }}>
              {totalProductsCount}
            </h2>
            <Link to="/farmer/products" style={{ fontSize: '13px', fontWeight: 700, color: '#86EFAC', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Manage Crop Catalog <FiArrowUpRight />
            </Link>
          </div>

          {/* Customer Rating */}
          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Quality Rating
              </span>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.25)', border: '1px solid rgba(250, 204, 21, 0.4)', color: '#FDE047', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FiStar size={22} />
              </div>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px', color: '#FDE047', letterSpacing: '-0.5px' }}>
              0.0 ★
            </h2>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255, 255, 255, 0.85)' }}>
              No reviews yet
            </span>
          </div>
        </div>

        {/* Charts Section Glass Boxes */}
        <div className="dashboard-charts-grid" style={{ display: 'grid', gap: '24px', marginBottom: '28px' }}>
          {/* Revenue Chart Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>Sales Revenue Trend (₹)</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Direct harvest proceeds across settlement periods</p>
              </div>
              <span style={{ background: 'rgba(34, 197, 94, 0.2)', border: '1px solid rgba(74, 222, 128, 0.4)', color: '#86EFAC', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '8px' }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesOverview}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.12)" />
                  <XAxis dataKey="date" stroke="rgba(255, 255, 255, 0.8)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255, 255, 255, 0.8)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                    }}
                    formatter={(v) => [`₹${v}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#4ADE80" strokeWidth={3.5} dot={{ r: 5, fill: '#4ADE80', stroke: '#FFFFFF', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Distribution Pie Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>Order Status</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Current active fulfillment stage</p>

            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ordersOverview} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={5}>
                    {ordersOverview.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ color: '#FFFFFF', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Orders Glass Stack */}
        <div className="glass-box" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>Recent Customer Orders</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Live orders ready for dispatch and milestone tracking</p>
            </div>
            <Link to="/farmer/orders" style={{ fontSize: '13.5px', fontWeight: 700, color: '#86EFAC', textDecoration: 'none' }}>
              View All Orders →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>AMOUNT</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentOrdersList.length > 0 ? recentOrdersList.map((ord, idx) => {
                  const ordId = ord._id || ord.id || `ORD-${idx}`;
                  return (
                    <tr key={ordId}>
                      <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                        #{String(ordId).slice(-8)}
                      </td>
                      <td style={{ color: '#FFFFFF', fontWeight: 600 }}>
                        {ord.customer?.fullName || ord.customer || 'Unknown Customer'}
                      </td>
                      <td style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {ord.Products?.length ? `${ord.Products.length} items` : (ord.items || '0 items')}
                      </td>
                      <td style={{ fontWeight: 800, color: '#4ADE80', fontSize: '15px' }}>
                        ₹{ord.totalAmount || ord.amount || 0}
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusClass(ord.status)}`}>
                          {ord.status || 'Pending'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to="/farmer/orders"
                          className="btn btn-outline btn-sm"
                          style={{
                            padding: '6px 14px',
                            fontSize: '12px',
                            textDecoration: 'none',
                            background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
                            boxShadow: '0 4px 16px rgba(22, 101, 52, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                          }}
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="6" style={{ padding: '60px 20px', textAlign: 'center' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#86EFAC' }}>
                        <FiBox size={24} />
                      </div>
                      <h4 style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '700', color: '#FFFFFF' }}>No Recent Orders</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>When customers place orders for your produce, they will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerDashboard;

