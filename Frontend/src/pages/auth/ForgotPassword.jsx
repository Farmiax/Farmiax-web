import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import PasswordInput from '../../components/common/PasswordInput';
import Logo from '../../components/common/Logo';
import authService from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validators';
import { getApiError } from '../../utils/helpers';
import authBg from '../../assets/images/auth-customer-bg.png';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setApiError('');
    const errs = {};
    if (!email || !validateEmail(email)) errs.email = 'Valid email required';
    const pe = validatePassword(password);
    if (pe) errs.password = pe;
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try { await authService.forgotPassword(email, password); setSuccess(true); }
    catch (err) { setApiError(getApiError(err)); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src={authBg} alt="Farm background" />
        <div className="auth-visual-overlay" />
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container compact-mode">
          <Link to="/" className="auth-back"><FiArrowLeft size={16}/> Back to Home</Link>

          {success ? (
            <div style={{ textAlign:'center', padding: '16px 0' }}>
              <FiCheckCircle size={56} color="#166534" style={{marginBottom:16}}/>
              <h1>Password Updated!</h1>
              <p className="auth-subtitle">Your password has been reset successfully.</p>
              <Link to="/customer/signin" className="btn btn-primary btn-full btn-lg" style={{marginTop: 16}}>Sign In</Link>
            </div>
          ) : (
            <>
              <h1>Reset Password</h1>
              <p className="auth-subtitle">Enter your email and new password</p>
              {apiError && <div className="auth-api-error"><FiAlertCircle size={18}/>{apiError}</div>}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input type="email" className={`form-input ${errors.email?'error':''}`} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your registered email"/>
                  {errors.email && <p className="form-error">{errors.email}</p>}
                </div>
                <PasswordInput label="New Password" name="password" value={password} onChange={e=>setPassword(e.target.value)} error={errors.password} required/>
                <PasswordInput label="Confirm New Password" name="confirmPassword" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} error={errors.confirmPassword} required/>
                <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:12}}>
                  {loading ? 'Updating...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
