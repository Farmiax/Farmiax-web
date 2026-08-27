import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import {
  FiUsers, FiSearch, FiMail, FiPhone, FiShoppingBag,
  FiStar, FiCheckCircle, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const customers = [
    {
      id: 'cust-1',
      name: 'Ananya Sharma',
      location: 'Bengaluru, Karnataka',
      email: 'ananya.s@gmail.com',
      phone: '+91 98450 12345',
      ordersCount: 8,
      totalSpent: 4850,
      joined: 'Feb 2024',
      status: 'Loyal Subscriber',
    },
    {
      id: 'cust-2',
      name: 'Karthik Raja',
      location: 'Chennai, Tamil Nadu',
      email: 'karthik.raja@yahoo.com',
      phone: '+91 97123 45678',
      ordersCount: 5,
      totalSpent: 3200,
      joined: 'Apr 2024',
      status: 'Subscribed',
    },
    {
      id: 'cust-3',
      name: 'Dr. Meenakshi Sundaram',
      location: 'Madurai, Tamil Nadu',
      email: 'dr.meenakshi@gmail.com',
      phone: '+91 94432 98765',
      ordersCount: 12,
      totalSpent: 7900,
      joined: 'Dec 2023',
      status: 'VIP Customer',
    },
    {
      id: 'cust-4',
      name: 'Deepak Verma',
      location: 'Hyderabad, Telangana',
      email: 'deepak.v@outlook.com',
      phone: '+91 91234 56789',
      ordersCount: 3,
      totalSpent: 1650,
      joined: 'May 2024',
      status: 'Subscribed',
    },
  ];

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <FarmerDashboardLayout activeNav="customers">
      <div className="farmer-customers-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Direct Buyer Relationships & Subscribers
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              View customer profiles, repeat purchase history, and direct subscribers.
            </p>
          </div>

          <div style={{ position: 'relative', minWidth: '280px' }}>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 38px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                fontSize: '13.5px',
                outline: 'none',
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
              }}
            />
            <FiSearch style={{ position: 'absolute', left: '12px', top: '12px', color: 'rgba(255, 255, 255, 0.7)' }} />
          </div>
        </div>

        {/* 3 Metric Glass Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px', marginBottom: '28px' }}>
          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Total Direct Buyers</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#FFFFFF' }}>{customers.length}</h2>
            <span style={{ fontSize: '13px', color: '#4ADE80', fontWeight: 700 }}>100% verified authentic households</span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Subscribed to Harvests</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#4ADE80' }}>4 Active</h2>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>Receive instant SMS & Email notifications</span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Average Customer Value</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#FDE047' }}>₹4,400</h2>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>Over 7.0 orders per subscriber</span>
          </div>
        </div>

        {/* Customers Glass Table Box */}
        <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>CUSTOMER NAME</th>
                  <th>LOCATION</th>
                  <th>CONTACT</th>
                  <th>TOTAL ORDERS</th>
                  <th>SPENT (₹)</th>
                  <th style={{ textAlign: 'right' }}>SUBSCRIPTION STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '13px' }}>
                          {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{c.name}</strong>
                          <p style={{ margin: 0, fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)' }}>Customer since {c.joined}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)' }}>
                      📍 {c.location}
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: '13px', color: '#FFFFFF' }}>📞 {c.phone}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255, 255, 255, 0.75)' }}>✉️ {c.email}</p>
                    </td>
                    <td style={{ fontSize: '14.5px', fontWeight: 700, color: '#FFFFFF' }}>
                      {c.ordersCount} orders
                    </td>
                    <td style={{ fontSize: '16px', fontWeight: 800, color: '#4ADE80' }}>
                      ₹{c.totalSpent}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="status-pill status-delivered">
                        ✓ {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerCustomers;
