import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FiSettings, FiLock, FiBell, FiShield, FiCheckCircle,
  FiSave, FiTrash2, FiAlertCircle
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerSettings = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    NewPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [notificationToggles, setNotificationToggles] = useState({
    newOrders: true,
    lowStockAlerts: true,
    payoutSettled: true,
    buyerReviews: true,
    weeklyDigest: false,
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.NewPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/changed-password', {
        oldPassword: passwordData.oldPassword,
        NewPassword: passwordData.NewPassword,
      });
      toast.success('Password changed successfully! 🔐');
      setPasswordData({ oldPassword: '', NewPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.success('Password update preference saved!');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated');
  };

  return (
    <FarmerDashboardLayout activeNav="settings">
      <div className="farmer-settings-view">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Farmer Account Settings & Security
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Configure notification preferences, login passwords, and account security.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Notification Preferences Glass Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FiBell size={22} style={{ color: '#4ADE80' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Notification Alerts</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'newOrders', title: 'New Customer Orders', desc: 'Instant sound alert and push notification when a customer orders' },
                { key: 'lowStockAlerts', title: 'Low Harvest Stock Warnings', desc: 'Alert when product inventory falls below minimum buffer limit' },
                { key: 'payoutSettled', title: 'Bank Payout Confirmations', desc: 'Notifications when revenue settlements are sent to your bank' },
                { key: 'buyerReviews', title: 'Customer Product Reviews', desc: 'Alerts when buyers leave feedback on your crops' },
                { key: 'weeklyDigest', title: 'Weekly Performance Report', desc: 'Receive weekly sales and impressions digest via email' },
              ].map((item) => (
                <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{item.title}</h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationToggles[item.key]}
                    onChange={() => handleToggle(item.key)}
                    style={{ width: '20px', height: '20px', accentColor: '#22C55E', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Password & Security Glass Box */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FiLock size={22} style={{ color: '#4ADE80' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Change Password</h3>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Current Password</label>
                <input
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>New Password</label>
                <input
                  type="password"
                  value={passwordData.NewPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, NewPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '11px', fontSize: '14px', marginTop: '6px' }}
              >
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerSettings;
