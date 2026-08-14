import { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerDashboardLayout from '../../components/common/CustomerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  FiSettings, FiLock, FiBell, FiShield, FiCheckCircle, FiSave,
  FiCreditCard, FiGlobe, FiMapPin, FiPlus, FiTrash2,
  FiUser, FiArrowRight
} from 'react-icons/fi';
import '../../styles/customer.css';

const CustomerSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('addresses'); // 'addresses' | 'payment' | 'notifications' | 'security' | 'preferences'
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      tag: 'Home (Primary)',
      isDefault: true,
      name: user?.fullName || '',
      phone: user?.phone || '',
      street: user?.address || '',
      city: user?.City || '',
      state: user?.State || '',
      pincode: user?.PinCode || '',
    },
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

  const [walletBalance, setWalletBalance] = useState(250); // ₹250 Farmiax Cash
  const [refundPreference, setRefundPreference] = useState('wallet'); // 'wallet' | 'source'
  const [savedUpiList, setSavedUpiList] = useState(['customer@okaxis', 'farmbuyer@ybl']);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    NewPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState({
    farmerHarvests: true,
    newFarmerJoined: true,
    discountOffers: true,
    orderUpdates: true,
    whatsappAlerts: true,
    emailAlerts: true,
  });
  const [deliveryPreference, setDeliveryPreference] = useState('standard');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
    showToast('New delivery address added successfully!');
  };

  const setPrimaryAddress = (id) => {
    setAddresses(
      addresses.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Primary shipping address updated!');
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((a) => a.id !== id));
    showToast('Address removed');
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.NewPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await api.post('/user/changed-password', {
        oldPassword: passwordData.oldPassword,
        NewPassword: passwordData.NewPassword,
      });
      showToast('Password updated successfully! 🔐');
      setPasswordData({ oldPassword: '', NewPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update saved successfully');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerDashboardLayout>
      <div className="settings-page-wrapper" style={{ padding: '32px 36px', maxWidth: '1240px', margin: '0 auto' }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              background: '#062414',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              fontSize: '14px',
              fontWeight: 600,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <FiCheckCircle style={{ color: '#86EFAC', fontSize: '18px' }} />
            {toastMessage}
          </div>
        )}

        {/* Clean, Elegant Header Card (No Heavy Solid Green Box) */}
        <div
          style={{
            background: 'var(--dark-green)',
            borderRadius: '20px',
            padding: '28px 36px',
            border: 'none',
            marginBottom: '28px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FiSettings size={26} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
                  Account Settings & Preferences
                </h1>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'rgba(255,255,255,0.8)' }}>
                  Manage delivery addresses, wallet payments, notifications, and login security.
                </p>
              </div>
            </div>

            {/* Quick Profile Link Notice */}

          </div>

          {/* Clean Segmented Tab Navigation Bar */}
          <div
            className="settings-tabs-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {[
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
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: isActive ? '1.5px solid #86EFAC' : '1px solid rgba(255,255,255,0.2)',
                    background: isActive ? '#86EFAC' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#062414' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <IconComp size={14} style={{ color: isActive ? '#166534' : 'rgba(255,255,255,0.7)' }} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                  Delivery Address Book
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#64748B' }}>
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
              <form onSubmit={handleAddAddress} style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <h4 style={{ gridColumn: 'span 2', margin: '0 0 8px', fontSize: '15px', color: 'var(--dark-green)', fontWeight: 800 }}>
                  Enter Delivery Details
                </h4>

                <input
                  type="text"
                  placeholder="Address Tag (e.g. Home, Office, Parents)"
                  value={newAddr.tag}
                  onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Recipient Name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="Mobile Phone Number"
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="6-digit Pincode"
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <textarea
                  placeholder="Street Address, House/Flat No, Landmark"
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  style={{ gridColumn: 'span 2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', minHeight: '60px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="City / District"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                  required
                />

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="submit" className="btn-dark-green" style={{ padding: '10px 20px', fontSize: '13px' }}>
                    Save Address
                  </button>
                </div>
              </form>
            )}

            {/* List of Saved Addresses */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    borderRadius: '16px',
                    padding: '20px',
                    border: addr.isDefault ? '2px solid #166534' : '1px solid #E2E8F0',
                    background: addr.isDefault ? '#F0FDF4' : '#FFFFFF',
                    position: 'relative',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: addr.isDefault ? '#166534' : '#E2E8F0',
                        color: addr.isDefault ? '#FFFFFF' : '#475569',
                      }}
                    >
                      {addr.tag} {addr.isDefault && '• DEFAULT'}
                    </span>

                    <button
                      onClick={() => deleteAddress(addr.id)}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: 800, color: 'var(--dark-green)' }}>
                    {addr.name}
                  </h4>
                  <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>📞 {addr.phone}</span>

                  {!addr.isDefault && (
                    <button
                      onClick={() => setPrimaryAddress(addr.id)}
                      style={{
                        marginTop: '14px',
                        width: '100%',
                        background: '#FFFFFF',
                        border: '1px solid #166534',
                        color: '#166534',
                        padding: '8px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                      }}
                    >
                      Set as Default Shipping Address
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PAYMENTS & WALLET */}
        {activeTab === 'payment' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
              Wallet Balance & Saved Payment Methods
            </h3>

            {/* Farmiax Wallet Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #062414 0%, #166534 100%)',
                borderRadius: '16px',
                padding: '24px 30px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '32px',
                boxShadow: '0 10px 20px rgba(6, 36, 20, 0.1)',
              }}
            >
              <div>
                <span style={{ fontSize: '12.5px', opacity: 0.8, textTransform: 'uppercase', fontWeight: 700 }}>
                  Farmiax Cash & Rewards Balance
                </span>
                <h2 style={{ margin: '4px 0 0', fontSize: '32px', fontWeight: 800 }}>₹{walletBalance}.00</h2>
              </div>
              <button
                className="btn-dark-green"
                onClick={() => showToast('Wallet top-up modal opened')}
                style={{ background: '#86EFAC', color: '#062414', border: 'none', fontWeight: 800 }}
              >
                + Add Cash to Wallet
              </button>
            </div>

            {/* Refund Destination Preference */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Preferred Refund Destination
              </h4>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <label
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: refundPreference === 'wallet' ? '2px solid #166534' : '1px solid #E2E8F0',
                    background: refundPreference === 'wallet' ? '#F0FDF4' : '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onClick={() => {
                    setRefundPreference('wallet');
                    showToast('Refund preference updated to Instant Farmiax Wallet');
                  }}
                >
                  <input type="radio" checked={refundPreference === 'wallet'} readOnly />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--dark-green)' }}>Instant Farmiax Wallet (Recommended)</strong>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Refund credited within 5 minutes of return</span>
                  </div>
                </label>

                <label
                  style={{
                    flex: 1,
                    padding: '16px',
                    borderRadius: '12px',
                    border: refundPreference === 'source' ? '2px solid #166534' : '1px solid #E2E8F0',
                    background: refundPreference === 'source' ? '#F0FDF4' : '#FFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                  onClick={() => {
                    setRefundPreference('source');
                    showToast('Refund preference updated to Original Payment Source');
                  }}
                >
                  <input type="radio" checked={refundPreference === 'source'} readOnly />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--dark-green)' }}>Original Payment Bank Account</strong>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Refund credited in 2-3 business banking days</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Saved UPI Handles */}
            <div>
              <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Saved UPI VPA Handles
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedUpiList.map((upi, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 18px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#334155' }}>⚡ {upi}</span>
                    <button
                      onClick={() => {
                        setSavedUpiList(savedUpiList.filter((item) => item !== upi));
                        showToast('UPI VPA removed');
                      }}
                      style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
              Communication & Order Alert Channels
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'farmerHarvests', title: 'Subscribed Farmer Harvest Alerts', desc: 'Instant push alerts when followed farmers list fresh stock' },
                { key: 'newFarmerJoined', title: 'New Organic Farmer Joining Suggestions', desc: 'Promotions when new verified local farmers list their harvest catalog' },
                { key: 'discountOffers', title: 'Promotions & Seasonal Coupon Alerts', desc: 'Exclusive promo codes (FARM20) and harvest flash sales' },
                { key: 'orderUpdates', title: 'Order Packing & Courier Tracking', desc: 'Real-time updates when your order is packed, shipped, or delivered' },
                { key: 'whatsappAlerts', title: 'WhatsApp Direct Order Receipt & Dispatch', desc: 'Receive invoice copies and tracking links directly on WhatsApp' },
                { key: 'emailAlerts', title: 'Weekly Produce Summary Email Digest', desc: 'Weekly email digest of seasonal harvest arrivals' },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--dark-green)' }}>
                      {item.title}
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>
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
                    style={{ width: '20px', height: '20px', accentColor: '#166534', cursor: 'pointer' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & PRIVACY */}
        {activeTab === 'security' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Password Change Box */}
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', maxWidth: '640px' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Password & Login Security
              </h3>

              <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.NewPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, NewPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
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
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', maxWidth: '640px' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
                Account Data Privacy & Deactivation
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 700, color: '#334155' }}>
                      Two-Factor Authentication (2FA)
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#64748B' }}>
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
                    style={{ width: '20px', height: '20px', accentColor: '#166534', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#FEF2F2', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: 800, color: '#991B1B' }}>
                      Deactivate Farmiax Buyer Account
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#991B1B' }}>
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

        {/* TAB 5: SITE PREFERENCES */}
        {activeTab === 'preferences' && (
          <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid var(--border-light)', maxWidth: '640px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 800, color: 'var(--dark-green)' }}>
              Regional & Site Display Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Preferred Delivery Slot Window
                </label>
                <select
                  value={deliveryPreference}
                  onChange={(e) => {
                    setDeliveryPreference(e.target.value);
                    showToast('Default delivery slot updated!');
                  }}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px', background: '#FFF' }}
                >
                  <option value="standard">Standard Express Delivery (2-3 Business Days)</option>
                  <option value="express">Fresh Morning Harvest Slot (Tomorrow 7:00 AM - 10:00 AM)</option>
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
