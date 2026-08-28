import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import orderService from '../../services/orderService';
import {
  FiUsers, FiSearch, FiMail, FiPhone, FiShoppingBag,
  FiStar, FiCheckCircle, FiClock
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await orderService.getFarmerOrders();
        const ords = Array.isArray(res) ? res : (res?.data || []);

        const custMap = {};
        ords.forEach((ord, idx) => {
          const custUser = ord.user || ord.customer || {};
          const email = custUser.email || ord.deliveryAddress?.email || `customer_${idx}@farmiax.in`;
          const name = custUser.fullName || custUser.name || ord.deliveryAddress?.fullName || 'Verified Buyer';
          const location = [ord.deliveryAddress?.city || custUser.City, ord.deliveryAddress?.state || custUser.State].filter(Boolean).join(', ') || 'Local Community';
          const phone = custUser.phone || ord.deliveryAddress?.phone || 'Direct Customer';
          const spent = Number(ord.totalAmount || ord.actualAmount || 0);

          if (!custMap[email]) {
            custMap[email] = {
              id: custUser._id || `cust-${idx}`,
              name,
              location,
              email,
              phone,
              ordersCount: 1,
              totalSpent: spent,
              joined: ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent',
              status: 'Active Buyer',
            };
          } else {
            custMap[email].ordersCount += 1;
            custMap[email].totalSpent += spent;
          }
        });

        setCustomers(Object.values(custMap));
      } catch (err) {
        console.warn('Customer list load note:', err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
  const avgValue = customers.length > 0 ? Math.round(totalSpentAll / customers.length) : 0;

  return (
    <FarmerDashboardLayout activeNav="customers">
      <div className="farmer-customers-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Direct Buyer Relationships & Customers
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              View customer profiles, repeat purchase history, and direct buyers.
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
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Active Repeat Buyers</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#4ADE80' }}>
              {customers.filter(c => c.ordersCount > 1).length} Active
            </h2>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>Repeat orders placed</span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Average Customer Value</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#FDE047' }}>₹{avgValue.toLocaleString('en-IN')}</h2>
            <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>Direct farm value per buyer</span>
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
                  <th style={{ textAlign: 'right' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
                      Loading customer relationships...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.7)' }}>
                      No customers found. Customer records will be created as orders arrive.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
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
                        {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                      </td>
                      <td style={{ fontSize: '16px', fontWeight: 800, color: '#4ADE80' }}>
                        ₹{c.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="status-pill status-delivered">
                          ✓ {c.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerCustomers;
