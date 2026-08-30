import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import {
  FiSettings, FiLock, FiBell, FiShield, FiCheckCircle,
  FiSave, FiTrash2, FiAlertCircle, FiX
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerSettings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    NewPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      await authService.changePassword(passwordData.oldPassword, passwordData.NewPassword);
      toast.success('Password changed successfully! 🔐');
      setPasswordData({ oldPassword: '', NewPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authService.deleteFarmerAccount();
      toast.success('Farmer account and product listings deleted successfully.');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <FarmerDashboardLayout activeNav="settings">
      <div className="farmer-settings-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header-box">
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Farmer Account Settings & Security
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14.5px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Configure notification preferences, login passwords, and account security.
            </p>
          </div>
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
          <div className="glass-box" style={{ padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
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

            {/* Danger Zone */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#FCA5A5' }}>Delete Farmer Account</h4>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>Deactivate account and remove all listed crops</p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(239, 68, 68, 0.6)',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#FCA5A5',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FiTrash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
            }}
          >
            <div
              className="glass-box"
              style={{
                maxWidth: '460px',
                width: '100%',
                padding: '30px',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                  <FiAlertCircle size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Confirm Account Deletion</h3>
                  <span style={{ fontSize: '12px', color: '#FCA5A5' }}>This action is permanent and cannot be undone</span>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 24px' }}>
                Are you sure you want to delete your farmer account? All your active crop listings, farm profile, and direct marketplace store will be deactivated immediately.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteAccount}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerSettings;
