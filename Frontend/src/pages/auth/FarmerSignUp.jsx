import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertCircle, FiUser } from 'react-icons/fi';

import PasswordInput from '../../components/common/PasswordInput';
import SocialAuth from '../../components/common/SocialAuth';
import { useAuth } from '../../context/AuthContext';
import { validateRegistrationForm } from '../../utils/validators';
import { getApiError, indianStates } from '../../utils/helpers';
import authBg from '../../assets/images/auth-farmer-bg.png';
import '../../styles/auth.css';

const FarmerSignUp = () => {
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'', confirmPassword:'', address:'', PinCode:'', City:'', State:'', avatar:null });
  const [avatarPrev, setAvatarPrev] = useState(null);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const hc = (e) => { setForm(p=>({...p,[e.target.name]:e.target.value})); if(errors[e.target.name]) setErrors(p=>({...p,[e.target.name]:''})); };
  const ha = (e) => { const f=e.target.files[0]; if(f){setForm(p=>({...p,avatar:f}));setAvatarPrev(URL.createObjectURL(f));} };

  const handleSubmit = async (e) => {
    e.preventDefault(); setApiError('');
    const v = validateRegistrationForm(form, true);
    if(Object.keys(v).length>0){setErrors(v);return;}
    if(!agreed){setApiError('Please agree to Terms & Conditions');return;}
    setErrors({}); setLoading(true);
    try { await register({...form, role:'farmer', farmeractive:'Active'}); navigate('/farmer/signin',{replace:true}); }
    catch(err){setApiError(getApiError(err));}
    finally{setLoading(false);}
  };

  return (
    <div className="auth-page">
      <div className="auth-visual">
        <img src={authBg} alt="Farmer in field" />
        <div className="auth-visual-overlay">

        </div>
      </div>
      <div className="auth-form-side">
        <div className="auth-form-container">
          <Link to="/" className="auth-back"><FiArrowLeft size={16}/> Back to Home</Link>

          <h1>Create Farmer Account</h1>
          <p className="auth-subtitle">Start selling on Farmiax</p>
          {apiError&&<div className="auth-api-error"><FiAlertCircle size={18}/> {apiError}</div>}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="avatar-upload">
              <div className="avatar-preview">{avatarPrev?<img src={avatarPrev} alt="Avatar"/>:<FiUser size={28} color="var(--gray-400)"/>}</div>
              <label className="avatar-upload-btn">Upload Photo<input type="file" accept="image/*" onChange={ha} hidden/></label>
            </div>
            <div className="form-group"><label className="form-label">Full Name *</label><input name="fullName" className={`form-input ${errors.fullName?'error':''}`} value={form.fullName} onChange={hc} placeholder="Enter full name"/>{errors.fullName&&<p className="form-error">{errors.fullName}</p>}</div>
            <div className="auth-row">
              <div className="form-group"><label className="form-label">Email *</label><input name="email" type="email" className={`form-input ${errors.email?'error':''}`} value={form.email} onChange={hc} placeholder="Email"/>{errors.email&&<p className="form-error">{errors.email}</p>}</div>
              <div className="form-group"><label className="form-label">Phone *</label><input name="phone" className={`form-input ${errors.phone?'error':''}`} value={form.phone} onChange={hc} placeholder="10-digit mobile"/>{errors.phone&&<p className="form-error">{errors.phone}</p>}</div>
            </div>
            <div className="auth-row">
              <PasswordInput label="Password" name="password" value={form.password} onChange={hc} error={errors.password} required/>
              <PasswordInput label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={hc} error={errors.confirmPassword} required/>
            </div>
            <div className="form-group"><label className="form-label">Farm Address *</label><input name="address" className={`form-input ${errors.address?'error':''}`} value={form.address} onChange={hc} placeholder="Farm location"/>{errors.address&&<p className="form-error">{errors.address}</p>}</div>
            <div className="auth-row">
              <div className="form-group"><label className="form-label">City *</label><input name="City" className={`form-input ${errors.City?'error':''}`} value={form.City} onChange={hc} placeholder="City"/>{errors.City&&<p className="form-error">{errors.City}</p>}</div>
              <div className="form-group"><label className="form-label">Pin Code *</label><input name="PinCode" className={`form-input ${errors.PinCode?'error':''}`} value={form.PinCode} onChange={hc} placeholder="6-digit"/>{errors.PinCode&&<p className="form-error">{errors.PinCode}</p>}</div>
            </div>
            <div className="form-group"><label className="form-label">State *</label><select name="State" className={`form-select ${errors.State?'error':''}`} value={form.State} onChange={hc}><option value="">Select State</option>{indianStates.map(s=><option key={s} value={s}>{s}</option>)}</select>{errors.State&&<p className="form-error">{errors.State}</p>}</div>
            <div className="auth-checkbox"><input type="checkbox" id="ft" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/><label htmlFor="ft">I agree to <a href="#">Terms</a> and <a href="#">Privacy Policy</a></label></div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading?'Creating...':'Create Farmer Account'}</button>
          </form>
          <SocialAuth role="farmer" />
          <p className="auth-switch">Already have an account? <Link to="/farmer/signin">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};

export default FarmerSignUp;
