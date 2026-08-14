import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SocialAuth = ({ role = 'customer' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Since we don't have a Google OAuth Client setup here yet,
      // we'll simulate the popup delay, then send a mock google payload to our new backend endpoint.
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const googleData = {
        fullName: 'Google User',
        email: 'user@google.com',
        role: role,
        avatar: null
      };

      await googleLogin(googleData);

      if (role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      console.error("Google Auth failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (role === 'farmer') {
        navigate('/farmer/dashboard');
      } else {
        navigate('/customer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="social-auth-container">
      <div className="auth-divider">
        <span>OR continue with</span>
      </div>

      <div className="social-auth-grid">
        <button
          type="button"
          className="social-btn google-btn"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{loading ? 'Connecting...' : 'Google'}</span>
        </button>

        <button
          type="button"
          className="social-btn apple-btn"
          onClick={handleAppleAuth}
          disabled={loading}
        >
          <i className="ri-apple-fill apple-icon" />
          <span>{loading ? 'Connecting...' : 'Apple'}</span>
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;
