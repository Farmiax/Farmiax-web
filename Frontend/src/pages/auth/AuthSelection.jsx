import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiArrowLeft } from 'react-icons/fi';
import Logo from '../../components/common/Logo';
import '../../styles/auth.css';

const AuthSelection = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';

  return (
    <div className="auth-selection-page">
      <div className="auth-selection-box">
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '18px',
            textDecoration: 'none',
          }}
        >
          <Logo
            size="lg"
            imgStyle={{
              filter: 'drop-shadow(0 2px 12px rgba(255, 255, 255, 0.55)) drop-shadow(0 4px 20px rgba(0, 0, 0, 0.4))',
              transform: 'scale(1.05)',
            }}
          />
        </Link>

        <h1>{isLogin ? 'Sign In to Farmiax' : 'Join Farmiax'}</h1>
        <p className="auth-selection-subtitle">
          {isLogin ? 'Choose your account portal to continue' : 'How would you like to get started?'}
        </p>

        <div className="auth-select-grid">
          <Link
            to={isLogin ? '/customer/signin' : '/customer/signup'}
            className="auth-select-card"
          >
            <div className="auth-select-icon customer">
              <FiShoppingBag size={28} />
            </div>
            <h3 className="auth-select-title">Customer</h3>
            <p className="auth-select-desc">
              Shop authentic organic produce directly from farmers
            </p>
          </Link>

          <Link
            to={isLogin ? '/farmer/signin' : '/farmer/signup'}
            className="auth-select-card"
          >
            <div className="auth-select-icon farmer">
              <FiTruck size={28} />
            </div>
            <h3 className="auth-select-title">Farmer / Producer</h3>
            <p className="auth-select-desc">
              Sell your harvests directly at fair farmgate prices
            </p>
          </Link>
        </div>

        <Link to="/" className="auth-back-home">
          <FiArrowLeft size={15} /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default AuthSelection;
