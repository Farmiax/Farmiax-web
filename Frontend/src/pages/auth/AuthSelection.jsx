import { Link } from 'react-router-dom';
import { FiShoppingBag, FiTruck } from 'react-icons/fi';
import Logo from '../../components/common/Logo';
import '../../styles/auth.css';

const AuthSelection = ({ mode = 'login' }) => {
  const isLogin = mode === 'login';
  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ maxWidth:520, width:'100%', textAlign:'center' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: 8 }}>
          <Logo size="lg" />
        </Link>
        <h1 style={{ marginTop:16, fontSize:'1.75rem' }}>{isLogin ? 'Sign In to Farmiax' : 'Join Farmiax'}</h1>
        <p style={{ color:'var(--gray-500)', marginBottom:32 }}>{isLogin ? 'Choose your account type' : 'How would you like to join?'}</p>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          <Link to={isLogin ? '/customer/signin' : '/customer/signup'} className="card" style={{ padding:32, textAlign:'center', textDecoration:'none' }}>
            <div style={{ width:56,height:56,borderRadius:'50%',background:'var(--cream)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',color:'var(--primary)' }}><FiShoppingBag size={26}/></div>
            <h3 style={{ fontSize:'1.1rem', marginBottom:8 }}>Customer</h3>
            <p style={{ fontSize:13 }}>Shop authentic products from trusted farmers</p>
          </Link>
          <Link to={isLogin ? '/farmer/signin' : '/farmer/signup'} className="card" style={{ padding:32, textAlign:'center', textDecoration:'none' }}>
            <div style={{ width:56,height:56,borderRadius:'50%',background:'rgba(249,210,186,0.4)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',color:'var(--primary)' }}><FiTruck size={26}/></div>
            <h3 style={{ fontSize:'1.1rem', marginBottom:8 }}>Farmer / Seller</h3>
            <p style={{ fontSize:13 }}>Sell your products and grow your business</p>
          </Link>
        </div>
        <Link to="/" style={{ display:'inline-block', marginTop:24, fontSize:14, color:'var(--gray-500)' }}>← Back to Home</Link>
      </div>
    </div>
  );
};

export default AuthSelection;
