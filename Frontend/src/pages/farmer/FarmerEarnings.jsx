import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import {
  FiDollarSign, FiTrendingUp, FiArrowUpRight, FiClock,
  FiCheckCircle, FiDownload, FiCreditCard
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerEarnings = () => {
  const [activeTab, setActiveTab] = useState('all');

  const transactions = [
    { id: 'TXN-98412', orderId: '#FMX9823145', date: 'Yesterday, 4:30 PM', amount: 640, status: 'Settled', method: 'Direct Bank Transfer' },
    { id: 'TXN-98405', orderId: '#FMX9821092', date: '3 days ago', amount: 1190, status: 'Settled', method: 'Direct Bank Transfer' },
    { id: 'TXN-98388', orderId: '#FMX9819842', date: '6 days ago', amount: 390, status: 'Settled', method: 'Direct Bank Transfer' },
    { id: 'TXN-98350', orderId: '#FMX9815410', date: '10 days ago', amount: 2450, status: 'Settled', method: 'Direct Bank Transfer' },
    { id: 'TXN-98312', orderId: '#FMX9812001', date: '14 days ago', amount: 850, status: 'Settled', method: 'Direct Bank Transfer' },
  ];

  return (
    <FarmerDashboardLayout activeNav="earnings">
      <div className="farmer-earnings-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Farmer Earnings & Revenue Settlements
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              100% direct farmer payouts with zero middleman deductions.
            </p>
          </div>

          <button
            onClick={() => toast.success('Earnings statement downloaded!')}
            className="btn btn-outline"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              fontSize: '13.5px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              color: '#FFFFFF',
              borderRadius: '10px',
            }}
          >
            <FiDownload size={15} /> Download Statement (PDF)
          </button>
        </div>

        {/* 3 Metric Glass Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '22px', marginBottom: '28px' }}>
          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Available for Payout</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 6px', color: '#4ADE80' }}>₹14,850.00</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Auto-transfers every Monday to registered bank</p>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>This Month's Settled</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 6px', color: '#FFFFFF' }}>₹48,520.00</h2>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FiTrendingUp /> +22.4% vs previous month
            </span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Lifetime Farm Earnings</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '8px 0 6px', color: '#FDE047' }}>₹2,84,300.00</h2>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255, 255, 255, 0.8)' }}>Across 210+ direct harvest dispatches</p>
          </div>
        </div>

        {/* Transaction History Glass Stack */}
        <div className="glass-box" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255, 255, 255, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Recent Order Settlements</h3>
            <span style={{ fontSize: '13px', color: '#86EFAC', fontWeight: 700 }}>• Instant Direct Deposit Active</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="farmer-table">
              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>ORDER REF</th>
                  <th>DATE & TIME</th>
                  <th>PAYOUT METHOD</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: 'right' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      {txn.id}
                    </td>
                    <td style={{ color: '#93C5FD', fontWeight: 600 }}>
                      {txn.orderId}
                    </td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                      {txn.date}
                    </td>
                    <td style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                      🏦 {txn.method}
                    </td>
                    <td>
                      <span className="status-pill status-delivered">
                        ✓ {txn.status}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '16px', color: '#4ADE80', textAlign: 'right' }}>
                      +₹{txn.amount}
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

export default FarmerEarnings;
