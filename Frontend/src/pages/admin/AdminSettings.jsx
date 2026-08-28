import React, { useState, useEffect } from 'react';
import AdminDashboardLayout from '../../components/admin/AdminDashboardLayout';
import adminService from '../../services/adminService';
import api from '../../services/api';
import {
  FiSettings, FiServer, FiShield, FiActivity,
  FiDatabase, FiCheckCircle, FiAlertCircle, FiRefreshCw
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/admin.css';

const AdminSettings = () => {
  const [latency, setLatency] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking');
  const [checking, setChecking] = useState(false);
  const adminEmail = localStorage.getItem('farmiax_admin_email') || 'admin@farmiax.com';
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'https://farmiax-web-backend.onrender.com/api/v1';

  const checkHealth = async () => {
    setChecking(true);
    const start = performance.now();
    try {
      await api.get('/product/all-products');
      const diff = Math.round(performance.now() - start);
      setLatency(diff);
      setServerStatus('online');
      toast.success(`Server health optimal (${diff}ms response time)`);
    } catch (err) {
      setServerStatus('warning');
      setLatency(null);
      toast.error('API response delayed or warning returned');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <AdminDashboardLayout activeNav="settings">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
          System & Engine Diagnostics
        </h1>
        <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          Real-time REST API health, environment endpoints, and security configuration.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* API Health & Ping Glass Box */}
        <div className="admin-glass-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FiServer size={22} style={{ color: '#4ADE80' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Live API Health Ping</h3>
            </div>
            <button
              onClick={checkHealth}
              disabled={checking}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#FFF',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <FiRefreshCw className={checking ? 'spin-icon' : ''} size={12} /> Ping
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>Active Backend Gateway</span>
                <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>{apiBase}</strong>
              </div>
              <span className={`admin-status-badge ${serverStatus === 'online' ? 'status-active' : 'status-placed'}`}>
                {serverStatus === 'online' ? 'ONLINE (200 OK)' : 'DIAGNOSTIC PENDING'}
              </span>
            </div>

            <div style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', display: 'block' }}>Gateway Response Latency</span>
                <strong style={{ fontSize: '16px', color: '#4ADE80' }}>{latency ? `${latency} ms` : 'Measuring...'}</strong>
              </div>
              <FiActivity size={22} style={{ color: '#4ADE80' }} />
            </div>
          </div>
        </div>

        {/* Security & Access Box */}
        <div className="admin-glass-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <FiShield size={22} style={{ color: '#FACC15' }} />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Admin Security Clearance</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13.5px' }}>
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Authenticated Operator:</span>
              <strong style={{ color: '#FFFFFF' }}>{adminEmail}</strong>
            </div>
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Security Scope:</span>
              <strong style={{ color: '#4ADE80' }}>FULL PLATFORM ENGINE ACCESS</strong>
            </div>
            <div style={{ padding: '14px 16px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Database Engine:</span>
              <strong style={{ color: '#60A5FA' }}>MongoDB Cluster (Mongoose 9)</strong>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminSettings;
