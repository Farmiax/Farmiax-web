import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FiCreditCard, FiCheckCircle, FiShield, FiAlertCircle,
  FiEdit2, FiSave, FiLock, FiDollarSign, FiInfo
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerPayouts = () => {
  const { user } = useAuth();
  const [bankDetails, setBankDetails] = useState({
    accountHolder: user?.fullName || 'Ramesh Kumar',
    bankName: 'State Bank of India',
    accountNumber: '••••••••4892',
    ifscCode: 'SBIN0001234',
    upiId: 'ramesh.farmer@sbi',
    payoutFrequency: 'weekly',
  });

  const [kycStatus, setKycStatus] = useState({
    verified: true,
    documentType: 'Aadhaar Card & Kisan Credit Card',
    docNumber: '•••• •••• 9812',
    verifiedOn: '12 Jan 2024',
  });

  const [editingBank, setEditingBank] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');

  const handleBankSave = (e) => {
    e.preventDefault();
    setEditingBank(false);
    toast.success('Bank details saved securely! 🏦');
  };

  const handleRequestPayout = (e) => {
    e.preventDefault();
    if (!payoutAmount || Number(payoutAmount) <= 0) {
      toast.error('Please enter a valid payout amount');
      return;
    }
    setRequestingPayout(false);
    setPayoutAmount('');
    toast.success(`Payout request of ₹${payoutAmount} submitted for verification! 💸`);
  };

  return (
    <FarmerDashboardLayout activeNav="payouts & kyc">
      <div className="farmer-payouts-view">
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              Bank Payouts & Farmer KYC Verification
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
              Direct bank transfers to your verified agricultural savings account.
            </p>
          </div>

          <button
            onClick={() => setRequestingPayout(true)}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              fontSize: '14px',
              background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
              boxShadow: '0 4px 16px rgba(22, 101, 52, 0.4)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <FiDollarSign size={18} /> Request Instant Payout
          </button>
        </div>

        {/* Notice Info */}
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(96, 165, 250, 0.4)', backdropFilter: 'blur(12px)', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px', color: '#BFDBFE' }}>
          <FiInfo size={22} style={{ color: '#93C5FD', flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, color: '#FFFFFF' }}>
            <strong style={{ color: '#93C5FD' }}>Direct Farmer Settlement Guarantee:</strong> All customer payments are processed with zero commission deductions. Payments reflect in your account within 24 hours of dispatch confirmation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
          {/* Bank Account Details Card */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiCreditCard size={22} style={{ color: '#4ADE80' }} />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Registered Bank Account</h3>
              </div>
              <button
                onClick={() => setEditingBank(!editingBank)}
                style={{ background: 'none', border: 'none', color: '#86EFAC', fontWeight: 700, fontSize: '13.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <FiEdit2 size={13} /> {editingBank ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editingBank ? (
              <form onSubmit={handleBankSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '4px' }}>Account Holder Name</label>
                  <input
                    type="text"
                    value={bankDetails.accountHolder}
                    onChange={(e) => setBankDetails({ ...bankDetails, accountHolder: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13.5px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '4px' }}>Bank Name</label>
                  <input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13.5px' }}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '4px' }}>Account Number</label>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13.5px' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '4px' }}>IFSC Code</label>
                    <input
                      type="text"
                      placeholder="SBIN0001234"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13.5px' }}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '4px' }}>UPI VPA (Optional)</label>
                  <input
                    type="text"
                    value={bankDetails.upiId}
                    onChange={(e) => setBankDetails({ ...bankDetails, upiId: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '13.5px' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ padding: '10px', fontSize: '13.5px', marginTop: '6px' }}>
                  Save Bank Details
                </button>
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>ACCOUNT HOLDER</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>{bankDetails.accountHolder}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>BANK NAME</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{bankDetails.bankName}</p>
                  </div>
                  <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>IFSC CODE</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{bankDetails.ifscCode}</p>
                  </div>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>ACCOUNT NUMBER</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>{bankDetails.accountNumber}</p>
                </div>
                <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>LINKED UPI ID</span>
                  <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#4ADE80' }}>⚡ {bankDetails.upiId}</p>
                </div>
              </div>
            )}
          </div>

          {/* KYC Verification Card */}
          <div className="glass-box" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <FiShield size={22} style={{ color: '#4ADE80' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Farmer Identity & KYC Status</h3>
            </div>

            <div style={{ background: 'rgba(34, 197, 94, 0.25)', border: '1px solid rgba(74, 222, 128, 0.5)', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#86EFAC', fontWeight: 800, fontSize: '15px' }}>
                <FiCheckCircle size={18} /> VERIFIED FARMER PRODUCER
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#FFFFFF' }}>
                Your identity and agricultural land credentials have been verified by Farmiax Trust Ops.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>DOCUMENT TYPE</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{kycStatus.documentType}</p>
              </div>
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>DOCUMENT ID NUMBER</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{kycStatus.docNumber}</p>
              </div>
              <div style={{ padding: '14px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>VERIFICATION DATE</span>
                <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14px', color: '#FFFFFF' }}>{kycStatus.verifiedOn}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payout Request Modal */}
        {requestingPayout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ background: '#FFF', borderRadius: '20px', maxWidth: '440px', width: '100%', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>Request Payout Transfer</h3>
              <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748B' }}>
                Available Balance: <strong>₹14,850.00</strong>
              </p>

              <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Enter Payout Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px' }}
                    required
                    min="100"
                    max="14850"
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setRequestingPayout(false)}
                    className="btn btn-outline"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '8px 20px', fontSize: '13px' }}
                  >
                    Submit Transfer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerPayouts;
