import { Link } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import Logo from '../../components/common/Logo';

const Unauthorized = () => (
  <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--cream)',padding:24,textAlign:'center' }}>
    <div style={{ marginBottom: 24 }}>
      <Link to="/"><Logo size="lg" /></Link>
    </div>
    <FiShield size={64} color="var(--error)" style={{marginBottom:20}}/>
    <h1 style={{fontSize:'2.5rem',marginBottom:8}}>Unauthorized</h1>
    <h2 style={{fontSize:'1.25rem',marginBottom:12,color:'var(--gray-700)'}}>Access Denied</h2>
    <p style={{color:'var(--gray-500)',maxWidth:400,marginBottom:24}}>You don't have permission to access this page.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default Unauthorized;
