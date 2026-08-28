import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Logo from '../../components/common/Logo';
import { FiLock, FiMail, FiShield, FiAlertCircle, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // POST /users/adminlogin
      const res = await adminService.login(email.trim(), password);
      const token = res?.data?.Token || res?.Token || res?.token;

      if (token) {
        localStorage.setItem('farmiax_admin_token', token);
        localStorage.setItem('farmiax_admin_email', email.trim());
        toast.success('Admin authorization verified! Welcome to Control Engine.');
        navigate('/admin/dashboard');
      } else {
        setErrorMsg('Invalid response from admin gateway. Please verify credentials.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg(
        err.response?.data?.message ||
        err.response?.data?.Message ||
        'Invalid Admin credentials. Check email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at center, #0B3D25 0%, #03140C 70%, #010805 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'var(--font-main, sans-serif)',
      }}
    >
      <div
        className="admin-glass-box"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 36px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <Logo size="md" />
          </div>
          <div style={{ display: 'inline-block', background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)', color: '#000', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '12px' }}>
            MASTER ADMIN ACCESS
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF' }}>
            Platform Control Portal
          </h2>
          <p style={{ margin: 0, fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Sign in to manage global orders, products, farmers, and security.
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              color: '#FCA5A5',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px',
            }}
          >
            <FiAlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
              <input
                type="email"
                required
                placeholder="admin@farmiax.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.85)', marginBottom: '8px' }}>
              Master Security Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255, 255, 255, 0.5)' }} />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 42px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #15803D 0%, #166534 100%)',
              boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Authorizing Platform Engine...' : (
              <>
                Access Admin Dashboard <FiArrowRight />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
          <Link
            to="/"
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            ← Return to Farmiax Marketplace Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
