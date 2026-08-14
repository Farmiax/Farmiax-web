import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import PasswordInput from '../../components/common/PasswordInput';
import Logo from '../../components/common/Logo';
import authService from '../../services/authService';
import { validateEmail, validatePassword } from '../../utils/validators';
import { getApiError } from '../../utils/helpers';
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

  if (success) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)',padding:24 }}>
        <div style={{ textAlign:'center',maxWidth:400 }}>
          <FiCheckCircle size={56} color="var(--success)" style={{marginBottom:16}}/>
          <h2>Password Updated!</h2>
          <p style={{color:'var(--gray-500)',marginBottom:24}}>Your password has been reset successfully.</p>
          <Link to="/customer/signin" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream)',padding:24 }}>
      <div style={{ maxWidth:420,width:'100%' }}>
        <Link to="/" className="auth-back"><FiArrowLeft size={16}/> Back to Home</Link>
        <div className="auth-logo" style={{ marginTop: 16, marginBottom: 16 }}>
          <Link to="/"><Logo size="md" /></Link>
        </div>
        <h1 style={{fontSize:'1.5rem'}}>Reset Password</h1>
        <p className="auth-subtitle">Enter your email and new password</p>
        {apiError&&<div className="auth-api-error"><FiAlertCircle size={18}/>{apiError}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group"><label className="form-label">Email *</label>
            <input type="email" className={`form-input ${errors.email?'error':''}`} value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your registered email"/>
            {errors.email&&<p className="form-error">{errors.email}</p>}
          </div>
          <PasswordInput label="New Password" name="password" value={password} onChange={e=>setPassword(e.target.value)} error={errors.password} required/>
          <PasswordInput label="Confirm New Password" name="confirmPassword" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} error={errors.confirmPassword} required/>
          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{marginTop:8}}>{loading?'Updating...':'Reset Password'}</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
