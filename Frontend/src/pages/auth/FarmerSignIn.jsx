import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

import PasswordInput from '../../components/common/PasswordInput';
import SocialAuth from '../../components/common/SocialAuth';
import { useAuth } from '../../context/AuthContext';
import { validateLoginForm } from '../../utils/validators';
import { getApiError } from '../../utils/helpers';
import authBg from '../../assets/images/auth-farmer-bg.png';
import '../../styles/auth.css';

const FarmerSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validation = validateLoginForm(email, password);
    if (Object.keys(validation).length > 0) { setErrors(validation); return; }
    setErrors({});
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard', { replace: true });
      } else {
        setApiError('This account is not registered as a farmer. Please use customer login.');
      }
    } catch (err) {
      setApiError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src={authBg} alt="Farmer in green field" />
        <div className="auth-visual-overlay">
          <h2>Welcome Back, Farmer!</h2>
          <p>Manage your products, orders and grow your farming business with Farmiax.</p>
          <ul className="auth-visual-benefits">
            <li>✓ Easy Product Listing</li>
            <li>✓ Manage Orders Easily</li>
            <li>✓ Secure Payments</li>
            <li>✓ Business Growth Support</li>
          </ul>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <Link to="/" className="auth-back"><FiArrowLeft size={16} /> Back to Home</Link>

          <h1>Farmer Sign In</h1>
          <p className="auth-subtitle">Sign in to your farmer dashboard</p>

          {apiError && <div className="auth-api-error"><FiAlertCircle size={18} /> {apiError}</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="farmer-email">Email Address *</label>
              <input id="farmer-email" type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <PasswordInput label="Password" name="password" value={password}
              onChange={(e) => setPassword(e.target.value)} error={errors.password} required />

            <div className="auth-actions">
              <label className="auth-remember"><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password" className="auth-forgot">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <SocialAuth role="farmer" />

          <p className="auth-switch">
            Don't have a farmer account? <Link to="/farmer/signup">Create Farmer Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignIn;
