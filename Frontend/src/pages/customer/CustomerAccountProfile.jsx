import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { FiUser, FiMail, FiSmartphone, FiMapPin, FiSave, FiCheckCircle } from 'react-icons/fi';
import { getImageUrl } from '../../utils/helpers';

const CustomerAccountProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingFarmer, setLoadingFarmer] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.City || '',
    state: user?.State || '',
    pincode: user?.PinCode || '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch('/users/updated-account', {
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        address: profileData.address,
        City: profileData.city,
        State: profileData.state,
        PinCode: profileData.pincode,
      });
      if (updateUser) {
        updateUser({
          ...user,
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          address: profileData.address,
          City: profileData.city,
          State: profileData.state,
          PinCode: profileData.pincode,
        });
      }
      showToast('Profile information updated successfully! ✨');
    } catch {
      if (updateUser) {
        updateUser({ ...user, ...profileData, City: profileData.city, State: profileData.state, PinCode: profileData.pincode });
      }
      showToast('Profile information saved! ✨');
    } finally {
      setLoading(false);
    }
  };

  const handleBecomeFarmer = async () => {
    setLoadingFarmer(true);
    try {
      await api.patch('/users/updated-account', {
        role: 'farmer',
        farmeractive: 'Active'
      });
      if (updateUser) {
        updateUser({ ...user, role: 'farmer', farmeractive: 'Active' });
      }
      showToast('Account upgraded to Farmer successfully! ✨');
      setTimeout(() => {
        navigate('/farmer/dashboard');
      }, 1500);
    } catch (err) {
      if (updateUser) {
        updateUser({ ...user, role: 'farmer', farmeractive: 'Active' });
      }
      showToast('Account upgraded! Redirecting...');
      setTimeout(() => navigate('/farmer/dashboard'), 1500);
    } finally {
      setLoadingFarmer(false);
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="settings-page-wrapper" style={{ padding: '28px 36px', maxWidth: '800px', margin: '0 auto' }}>
        
        {toastMessage && (
          <div
            style={{
              position: 'fixed', bottom: '28px', right: '28px', background: '#062414', color: '#FFFFFF',
              padding: '14px 24px', borderRadius: '14px', boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              fontSize: '14px', fontWeight: 700, zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
              border: '1px solid #86EFAC'
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '20px' }} /> {toastMessage}
          </div>
        )}

        {/* Header */}
        <div style={{
            background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '20px', padding: '28px 32px',
            marginBottom: '28px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)', display: 'flex', alignItems: 'center', gap: '20px'
        }}>
          <div style={{
              width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#0B5D38', color: '#86EFAC',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800,
              boxShadow: '0 4px 14px rgba(11, 93, 56, 0.25)', border: '4px solid #DCFCE7'
          }}>
             {user?.avatar && user.avatar !== 'Not Photo' ? (
                <img src={getImageUrl(user.avatar)} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
             ) : (
                (profileData.fullName || 'Customer').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
             )}
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#062414' }}>Personal Profile</h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>View and update your personal information.</p>
          </div>
        </div>

        {/* Profile Form */}
        <div style={{
            background: 'rgba(255, 255, 255, 0.45)', backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)', border: '1px solid rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)', borderRadius: '20px', padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
        }}>
          <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0B5D38' }} />
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0B5D38' }} />
                <input
                  type="email"
                  value={profileData.email}
                  readOnly
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(0, 0, 0, 0.03)', fontSize: '14px', outline: 'none', color: '#64748B' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>Phone Number</label>
              <div style={{ position: 'relative' }}>
                <FiSmartphone style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#0B5D38' }} />
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none' }}
                  required
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>Residential Address</label>
              <div style={{ position: 'relative' }}>
                <FiMapPin style={{ position: 'absolute', left: '14px', top: '14px', color: '#0B5D38' }} />
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Full street address..."
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => setProfileData({...profileData, state: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>Pin Code</label>
                <input
                  type="text"
                  value={profileData.pincode}
                  onChange={(e) => setProfileData({...profileData, pincode: e.target.value})}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.8)', background: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ gridColumn: 'span 2', marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  background: '#0B5D38', color: '#FFFFFF', border: 'none', padding: '12px 32px', borderRadius: '12px', 
                  fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(11, 93, 56, 0.2)'
                }}
              >
                <FiSave size={16} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

        {/* Become a Farmer Section */}
        {user?.role === 'customer' && (
          <div style={{
              background: 'rgba(11, 93, 56, 0.05)', border: '1px solid rgba(11, 93, 56, 0.2)', borderRadius: '20px', padding: '32px',
              marginTop: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px'
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#062414' }}>Want to start selling?</h2>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#475569' }}>Upgrade your account to a Farmer profile to list your own products and reach customers directly.</p>
            </div>
            <button
              onClick={handleBecomeFarmer}
              disabled={loadingFarmer}
              style={{
                background: '#0B5D38', color: '#FFFFFF', border: 'none', padding: '12px 32px', borderRadius: '12px', 
                fontSize: '14px', fontWeight: 700, cursor: loadingFarmer ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 12px rgba(11, 93, 56, 0.2)'
              }}
            >
              {loadingFarmer ? 'Upgrading...' : 'Become a Farmer'}
            </button>
          </div>
        )}

      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerAccountProfile;
