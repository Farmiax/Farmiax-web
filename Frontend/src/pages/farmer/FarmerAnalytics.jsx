import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiTrendingUp, FiEye, FiMousePointer, FiRepeat, FiUsers,
  FiDollarSign, FiDownload, FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';
import '../../styles/farmer-analytics.css';

const revenueData = [
  { name: 'Jan', revenue: 14000 },
  { name: 'Feb', revenue: 23000 },
  { name: 'Mar', revenue: 29000 },
  { name: 'Apr', revenue: 34000 },
  { name: 'May', revenue: 42000 },
  { name: 'Jun', revenue: 56400 },
];

const trafficData = [
  { day: 'Mon', views: 420, clicks: 180 },
  { day: 'Tue', views: 580, clicks: 240 },
  { day: 'Wed', views: 720, clicks: 310 },
  { day: 'Thu', views: 650, clicks: 290 },
  { day: 'Fri', views: 890, clicks: 420 },
  { day: 'Sat', views: 1100, clicks: 580 },
  { day: 'Sun', views: 1250, clicks: 640 },
];

const topProducts = [
  { name: 'Organic Salem Turmeric Powder', sales: '₹14,520 Revenue', percent: 85, img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=100&q=80' },
  { name: 'A2 Gir Cow Desi Ghee', sales: '₹22,100 Revenue', percent: 78, img: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=100&q=80' },
  { name: 'Raw Unpolished Toor Dal', sales: '₹9,850 Revenue', percent: 62, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=100&q=80' },
];

const topLocations = [
  { name: 'Bengaluru, Karnataka', count: '148 Orders', percent: '38%' },
  { name: 'Chennai, Tamil Nadu', count: '112 Orders', percent: '28%' },
  { name: 'Hyderabad, Telangana', count: '64 Orders', percent: '16%' },
  { name: 'Mumbai, Maharashtra', count: '42 Orders', percent: '11%' },
  { name: 'Coimbatore, Tamil Nadu', count: '28 Orders', percent: '7%' },
];

const FarmerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  const handleExportReport = () => {
    toast.success('Harvest Analytics Report (PDF) exported!');
  };

  return (
    <FarmerDashboardLayout activeNav="analytics">
      <div className="farmer-analytics-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Farm Sales Analytics & Growth Insights
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Deep dive into crop conversion, visitor impressions, customer retention, and regional demand.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', fontSize: '13px', background: 'rgba(15, 23, 42, 0.8)', color: '#FFFFFF', fontWeight: 600 }}
            >
              <option value="week">Past 7 Days</option>
              <option value="month">Past 30 Days</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Full Year (2025)</option>
            </select>

            <button
              onClick={handleExportReport}
              className="btn btn-outline"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                fontSize: '13px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                color: '#FFFFFF',
                borderRadius: '10px',
              }}
            >
              <FiDownload size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* 4 Micro KPI Glass Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '18px', marginBottom: '26px' }}>
          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Store Visitors</span>
              <FiEye style={{ color: '#93C5FD', fontSize: '18px' }} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>5,610</h3>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4ADE80' }}>↗ +24% vs last period</span>
          </div>

          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Crop Page Views</span>
              <FiMousePointer style={{ color: '#FDE047', fontSize: '18px' }} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>12,840</h3>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4ADE80' }}>↗ +18% organic discovery</span>
          </div>

          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Order Conversion</span>
              <FiTrendingUp style={{ color: '#4ADE80', fontSize: '18px' }} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>3.85%</h3>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4ADE80' }}>↗ +0.6% above average</span>
          </div>

          <div className="glass-box kpi-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Repeat Buyers</span>
              <FiRepeat style={{ color: '#C084FC', fontSize: '18px' }} />
            </div>
            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', color: '#FFFFFF' }}>44.2%</h3>
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#4ADE80' }}>High loyalty score</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* Revenue Growth Trend Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#FFFFFF' }}>Cumulative Revenue Growth (₹)</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.12)" />
                  <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.8)" fontSize={12} tickLine={false} />
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
                  <Area type="monotone" dataKey="revenue" stroke="#4ADE80" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Activity Trend Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#FFFFFF' }}>Weekly Store Activity</h3>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.12)" />
                  <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.8)" fontSize={12} tickLine={false} />
                  <YAxis stroke="rgba(255, 255, 255, 0.8)" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.92)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                    }}
                  />
                  <Line type="monotone" dataKey="views" stroke="#60A5FA" strokeWidth={2.5} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="clicks" stroke="#4ADE80" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Top Selling Crops Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 18px', color: '#FFFFFF' }}>Highest Revenue Generating Crops</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {topProducts.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={p.img} alt={p.name} style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{p.name}</strong>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#4ADE80' }}>{p.sales}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${p.percent}%`, height: '100%', background: '#4ADE80', borderRadius: '999px' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Demand Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 18px', color: '#FFFFFF' }}>Top Customer Locations (India)</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topLocations.map((loc, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF' }}>📍 {loc.name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>{loc.count}</span>
                    <strong style={{ fontSize: '13.5px', color: '#4ADE80' }}>{loc.percent}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerAnalytics;

