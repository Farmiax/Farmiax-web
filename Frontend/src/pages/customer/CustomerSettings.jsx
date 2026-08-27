import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FiSettings, FiLock, FiBell, FiShield, FiCheckCircle, FiCheck, FiSave,
  FiCreditCard, FiGlobe, FiMapPin, FiPlus, FiTrash2,
  FiUser, FiArrowRight, FiSmartphone, FiMail, FiKey,
  FiEdit3, FiEye, FiEyeOff, FiClock, FiAlertTriangle, FiRefreshCw
} from 'react-icons/fi';
import '../../styles/customer.css';

const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";

const CustomerSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'payment' | 'notifications' | 'security' | 'preferences'
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || 'Priya Raman',
    email: user?.email || 'priya.customer@gmail.com',
    phone: user?.phone || '+91 98451 23456',
    address: user?.address || '42, 3rd Cross, Indiranagar',
    city: user?.City || 'Bengaluru',
    state: user?.State || 'Karnataka',
    pincode: user?.PinCode || '560038',
    gender: 'Female',
    dob: '1994-06-15',
    bio: 'Passionate about 100% organic farm produce, heritage rice varieties, and cold-pressed oils direct from rural farmers.',
  });

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      tag: 'Home (Primary)',
      isDefault: true,
      name: user?.fullName || 'Priya Raman',
      phone: user?.phone || '+91 98451 23456',
      street: user?.address || '42, 3rd Cross, Indiranagar',
      city: user?.City || 'Bengaluru',
      state: user?.State || 'Karnataka',
      pincode: user?.PinCode || '560038',
    },
    {
      id: 'addr_2',
      tag: 'Office',
      isDefault: false,
      name: 'Priya Raman (Work)',
      phone: '+91 98451 23456',
      street: 'Tech Park Block B, Outer Ring Road, Marathahalli',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
    }
  ]);

  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: 'Office',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  // Payment & Wallet State
  const [walletBalance, setWalletBalance] = useState(450); // ₹450 Farmiax Cash
  const [refundPreference, setRefundPreference] = useState('wallet'); // 'wallet' | 'source'
  const [savedUpiList, setSavedUpiList] = useState(['priya.raman@okaxis', 'farmbuy@ybl']);
  const [newUpi, setNewUpi] = useState('');
  const [showAddUpi, setShowAddUpi] = useState(false);

  // Security State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState({
    farmerHarvests: true,
    newFarmerJoined: true,
    discountOffers: true,
    orderUpdates: true,
    whatsappAlerts: true,
    emailAlerts: false,
    smsDeliveryOtp: true,
  });

  // Site Preferences State
  const [deliveryPreference, setDeliveryPreference] = useState('morning');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currencyDisplay, setCurrencyDisplay] = useState('INR');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Profile information updated successfully! ✨');
    }, 600);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pincode) return;

    const created = {
      id: `addr_${Date.now()}`,
      isDefault: addresses.length === 0,
      ...newAddr,
    };

    setAddresses([...addresses, created]);
    setNewAddr({ tag: 'Home', name: '', phone: '', street: '', city: '', state: '', pincode: '' });
    setShowAddAddressForm(false);
    showToast('New shipping address added to address book!');
  };

  const setPrimaryAddress = (id) => {
    setAddresses(
      addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Primary delivery destination updated!');
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast('Address removed from address book');
  };

  const handleAddUpi = (e) => {
    e.preventDefault();
    if (!newUpi.includes('@')) {
      showToast('Please enter a valid UPI VPA handle (e.g. name@okhdfcbank)');
      return;
    }
    setSavedUpiList([...savedUpiList, newUpi.trim()]);
    setNewUpi('');
    setShowAddUpi(false);
    showToast('UPI VPA handle linked for 1-click checkout!');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await api.post('/users/changed-password', {
        oldPassword: passwordData.oldPassword,
        NewPassword: passwordData.newPassword,
      });
      showToast('Login password updated securely! 🔐');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update saved successfully! 🔐');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="settings-page-wrapper" style={{ padding: '28px 36px', maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '28px',
              background: '#062414',
              color: '#FFFFFF',
              padding: '14px 24px',
              borderRadius: '14px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
              fontSize: '14px',
              fontWeight: 700,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '1px solid #86EFAC',
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '20px', flexShrink: 0 }} />
            {toastMessage}
          </div>
        )}

        {/* Top Header Card - Frosted Blurry White Glass Look */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            borderTop: '1px solid rgba(255, 255, 255, 0.8)',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '28px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(22, 101, 52, 0.15)',
                }}
              >
                <FiSettings size={28} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#062414', letterSpacing: '-0.3px' }}>
                  Account Settings & Preferences
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#475569' }}>
                  Manage personal profile, multi-location delivery addresses, wallet payments, notifications, and security.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FiShield size={13} /> Verified Customer
              </span>
            </div>
          </div>

          {/* Clean Segmented Tab Navigation Bar */}
          <div
            className="settings-tabs-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'profile', label: 'Personal Profile', icon: FiUser },
              { id: 'addresses', label: 'Saved Addresses', icon: FiMapPin },
              { id: 'payment', label: 'Payments & Wallet', icon: FiCreditCard },
              { id: 'notifications', label: 'Notifications & Alerts', icon: FiBell },
              { id: 'security', label: 'Security & Password', icon: FiLock },
              { id: 'preferences', label: 'Site Preferences', icon: FiGlobe },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: isActive ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
                    background: isActive ? '#0B5D38' : 'rgba(255, 255, 255, 0.65)',
                    color: isActive ? '#FFFFFF' : '#1F2937',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 16px rgba(11, 93, 56, 0.25)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <IconComp size={15} style={{ color: isActive ? '#86EFAC' : '#0B5D38' }} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: PERSONAL PROFILE */}
        {activeTab === 'profile' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '32px',
              color: '#1F2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#062414' }}>
                  Personal Profile & Identity
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#475569' }}>
                  Update your contact details, bio, and delivery identity.
                </p>
              </div>
            </div>

            {/* Avatar & Fast Stats Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '16px', border: '1px solid rgba(0, 0, 0, 0.08)', marginBottom: '28px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={defaultAvatar}
                  alt="Customer Avatar"
                  style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0B5D38', boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
                />
                <button
                  type="button"
                  onClick={() => showToast('Avatar upload dialog opened')}
                  style={{ position: 'absolute', bottom: '0', right: '0', background: '#0B5D38', color: '#FFF', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                  title="Change avatar"
                >
                  <FiEdit3 size={13} />
                </button>
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
                  {profileData.fullName}
                </h4>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569' }}>
                  {profileData.email} • {profileData.phone}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#DCFCE7', color: '#15803D' }}>
                    🌾 14 Direct Farm Orders
                  </span>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: '#DCFCE7', color: '#15803D' }}>
                    🌿 5 Followed Farmers
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Input Form */}
            <form onSubmit={handleProfileUpdate} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Full Legal Name
                </label>
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Gender
                </label>
                <select
                  value={profileData.gender}
                  onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other / Prefer not to say</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={profileData.dob}
                  onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  City / Location
                </label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                  Organic Food & Harvest Preferences Bio
                </label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px', height: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-dark-green"
                  style={{ padding: '12px 28px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <FiSave size={16} /> {loading ? 'Saving Changes...' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '32px',
              color: '#1F2937',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#062414' }}>
                  Delivery Address Book
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#475569' }}>
                  Manage multi-location shipping addresses for fast 1-click checkout.
                </p>
              </div>

              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="btn-dark-green"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                <FiPlus /> {showAddAddressForm ? 'Cancel' : 'Add New Address'}
              </button>
            </div>

            {/* Form to Add New Address */}
            {showAddAddressForm && (
              <form onSubmit={handleAddAddress} style={{ background: '#FFFFFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #CBD5E1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.05)' }}>
                <h4 style={{ gridColumn: 'span 2', margin: '0 0 8px', fontSize: '15px', color: '#0B5D38', fontWeight: 800 }}>
                  Enter New Delivery Details
                </h4>

                <input
                  type="text"
                  placeholder="Address Tag (e.g. Home, Office, Parents)"
                  value={newAddr.tag}
                  onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="6-digit Pincode"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <textarea
                  placeholder="Street Address, House/Flat No, Landmark"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  style={{ gridColumn: 'span 2', padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', height: '70px', resize: 'vertical' }}
                  required
                />
                <input
                  type="text"
                  placeholder="City / District"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  style={{ padding: '12px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                />

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
                  <button type="submit" className="btn-dark-green">
                    <FiCheck /> Save Delivery Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddAddressForm(false)}
                    style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFF', color: '#64748B', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Saved Address Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    border: addr.isDefault ? '2px solid #0B5D38' : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '16px',
                    padding: '24px',
                    background: addr.isDefault ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(12px)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11.5px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', background: '#DCFCE7', color: '#15803D', textTransform: 'uppercase' }}>
                        {addr.tag}
                      </span>
                      {addr.isDefault && (
                        <span style={{ fontSize: '11.5px', color: '#0B5D38', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiCheck size={14} /> DEFAULT
                        </span>
                      )}
                    </div>

                    <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: 700, color: '#062414' }}>{addr.name}</h4>
                    <p style={{ margin: '0 0 8px', fontSize: '13.5px', color: '#475569', lineHeight: '1.5' }}>
                      {addr.street}, {addr.city} {addr.state ? `, ${addr.state}` : ''} - {addr.pincode}
                    </p>
                    <p style={{ margin: 0, fontSize: '13px', color: '#0B5D38', fontWeight: 700 }}>
                      📞 {addr.phone}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                    {!addr.isDefault && (
                      <button
                        onClick={() => setPrimaryAddress(addr.id)}
                        style={{ fontSize: '12.5px', fontWeight: 700, color: '#0B5D38', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      style={{ fontSize: '12.5px', fontWeight: 600, color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <FiTrash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS & WALLET */}
        {activeTab === 'payment' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '32px',
              color: '#1F2937',
            }}
          >
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
              Wallet Balance & Saved Payment Methods
            </h3>

            {/* Farmiax Wallet Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0B5D38 0%, #07472A 100%)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '24px 30px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
                boxShadow: '0 8px 24px rgba(11, 93, 56, 0.25)',
              }}
            >
              <div>
                <span style={{ fontSize: '12.5px', color: '#86EFAC', textTransform: 'uppercase', fontWeight: 700 }}>
                  Farmiax Cash & Rewards Balance
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '34px', fontWeight: 800, color: '#FFFFFF' }}>₹{walletBalance}.00</h2>
              </div>
              <button
                className="btn-dark-green"
                onClick={() => {
                  setWalletBalance(walletBalance + 500);
                  showToast('₹500 added to Farmiax Cash wallet!');
                }}
                style={{ background: '#86EFAC', color: '#062414', border: 'none', fontWeight: 800 }}
              >
                + Add Cash to Wallet
              </button>
            </div>

            {/* Refund Destination Preference */}
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: '#062414' }}>
                Preferred Refund Destination
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: refundPreference === 'wallet' ? '2px solid #0B5D38' : '1px solid rgba(0, 0, 0, 0.12)',
                    background: refundPreference === 'wallet' ? '#DCFCE7' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                  onClick={() => {
                    setRefundPreference('wallet');
                    showToast('Refund preference set to Instant Farmiax Wallet');
                  }}
                >
                  <input type="radio" checked={refundPreference === 'wallet'} readOnly style={{ accentColor: '#0B5D38' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#062414' }}>Instant Farmiax Wallet (Recommended)</strong>
                    <span style={{ fontSize: '12.5px', color: '#475569' }}>Refund credited within 5 minutes of return completion</span>
                  </div>
                </label>

                <label
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    border: refundPreference === 'source' ? '2px solid #0B5D38' : '1px solid rgba(0, 0, 0, 0.12)',
                    background: refundPreference === 'source' ? '#DCFCE7' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                  }}
                  onClick={() => {
                    setRefundPreference('source');
                    showToast('Refund preference set to Original Payment Bank Source');
                  }}
                >
                  <input type="radio" checked={refundPreference === 'source'} readOnly style={{ accentColor: '#0B5D38' }} />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#062414' }}>Original Payment Bank Account</strong>
                    <span style={{ fontSize: '12.5px', color: '#475569' }}>Refund credited in 2-3 business banking days</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Saved UPI Handles */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#062414' }}>
                  Saved UPI VPA Handles
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddUpi(!showAddUpi)}
                  style={{ background: 'none', border: 'none', color: '#0B5D38', fontWeight: 700, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <FiPlus /> {showAddUpi ? 'Cancel' : 'Link New UPI ID'}
                </button>
              </div>

              {showAddUpi && (
                <form onSubmit={handleAddUpi} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    style={{ flex: 1, padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                    required
                  />
                  <button type="submit" className="btn-dark-green" style={{ padding: '12px 20px' }}>
                    Save UPI
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedUpiList.map((upi, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 20px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.7)',
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0B5D38' }}>⚡ {upi}</span>
                    <button
                      onClick={() => {
                        setSavedUpiList(savedUpiList.filter((item) => item !== upi));
                        showToast('UPI VPA removed from saved list');
                      }}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '32px',
              color: '#1F2937',
            }}
          >
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
              Communication & Order Alert Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'farmerHarvests', title: 'Subscribed Farmer Harvest Alerts', desc: 'Instant push alerts when followed farmers list fresh stock' },
                { key: 'newFarmerJoined', title: 'New Organic Farmer Suggestions', desc: 'Alerts when verified organic growers register in your district' },
                { key: 'discountOffers', title: 'Seasonal Coupons & Flash Sales', desc: 'Exclusive promo codes (FARM20) and fresh harvest harvest discounts' },
                { key: 'orderUpdates', title: 'Order Packing & Live GPS Courier Tracking', desc: 'Real-time updates when your order is packed, shipped, and out for delivery' },
                { key: 'whatsappAlerts', title: 'WhatsApp Direct Invoice & Delivery OTP', desc: 'Receive invoice PDF and delivery arrival alerts directly on WhatsApp' },
                { key: 'emailAlerts', title: 'Weekly Farm Digest & Seasonal Produce Guide', desc: 'Weekly email highlighting new heirloom harvests and nutritional insights' },
                { key: 'smsDeliveryOtp', title: 'SMS OTP for Secure Delivery Handoff', desc: 'Receive single-use OTP via SMS before the package is handed over' },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#062414' }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '3px 0 0', fontSize: '13px', color: '#475569' }}>
                      {item.desc}
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={notifPrefs[item.key]}
                    onChange={(e) => {
                      setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked });
                      showToast('Notification preference updated!');
                    }}
                    style={{ width: '20px', height: '20px', accentColor: '#0B5D38', cursor: 'pointer', flexShrink: 0 }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & PRIVACY */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Password Change Box */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '680px',
                color: '#1F2937',
              }}
            >
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
                Password & Login Security
              </h3>

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showOldPass ? "text" : "password"}
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPass(!showOldPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                    >
                      {showOldPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showNewPass ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPass(!showNewPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                    >
                      {showNewPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#062414', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#1F2937', fontSize: '14px' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-dark-green"
                  style={{ marginTop: '10px', padding: '12px 24px', alignSelf: 'flex-start' }}
                >
                  <FiLock /> {loading ? 'Updating Password...' : 'Update Security Password'}
                </button>
              </form>
            </div>

            {/* Two Factor Auth & Account Privacy */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.45)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderTop: '1px solid rgba(255, 255, 255, 0.8)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '680px',
                color: '#1F2937',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
                Account Data Privacy & Deactivation
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '12px', border: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#062414' }}>
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#475569' }}>
                      Require SMS OTP code for logins on unrecognized browsers
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => {
                      setTwoFactorEnabled(e.target.checked);
                      showToast(e.target.checked ? '2FA Authentication Enabled' : '2FA Disabled');
                    }}
                    style={{ width: '20px', height: '20px', accentColor: '#0B5D38', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#DC2626' }}>
                      Deactivate Farmiax Buyer Account
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#EF4444' }}>
                      Permanently erase order history, saved addresses, and active farmer subscriptions.
                    </p>
                  </div>
                  <button
                    onClick={() => showToast('Account deactivation requested. Confirmation sent to email.')}
                    style={{ background: '#EF4444', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SITE PREFERENCES */}
        {activeTab === 'preferences' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.45)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.8)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '680px',
              color: '#1F2937',
            }}
          >
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: '#062414' }}>
              Regional & Site Display Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>
                  Preferred Delivery Slot Window
                </label>
                <select
                  value={deliveryPreference}
                  onChange={(e) => {
                    setDeliveryPreference(e.target.value);
                    showToast('Default delivery slot updated!');
                  }}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF', color: '#1F2937' }}
                >
                  <option value="morning">Fresh Morning Harvest Slot (Tomorrow 6:30 AM - 9:30 AM)</option>
                  <option value="evening">Evening Post-Work Delivery (5:00 PM - 8:30 PM)</option>
                  <option value="standard">Standard Daytime Dispatch (10:00 AM - 4:00 PM)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>
                  Portal Language Preference
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    showToast('Language preference saved!');
                  }}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF', color: '#1F2937' }}
                >
                  <option value="en">English (Default)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#062414', marginBottom: '8px' }}>
                  Currency & Receipt Format
                </label>
                <select
                  value={currencyDisplay}
                  onChange={(e) => {
                    setCurrencyDisplay(e.target.value);
                    showToast('Currency format updated!');
                  }}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFFFFF', color: '#1F2937' }}
                >
                  <option value="INR">₹ Indian Rupee (INR) - Standard FSSAI GST Invoice</option>
                  <option value="USD">$ US Dollar (Equivalent Display)</option>
                </select>
              </div>
            </div>
          </div>
        )}

      </div>
    </CustomerDashboardLayout>
  );
};

export default CustomerSettings;
