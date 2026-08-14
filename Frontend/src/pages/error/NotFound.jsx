import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import Logo from '../../components/common/Logo';

const NotFound = () => (
  <div style={{ minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'var(--cream)',padding:24,textAlign:'center' }}>
    <div style={{ marginBottom: 24 }}>
      <Link to="/"><Logo size="lg" /></Link>
    </div>
    <FiAlertTriangle size={64} color="var(--primary)" style={{marginBottom:20}}/>
    <h1 style={{fontSize:'4rem',marginBottom:8}}>404</h1>
    <h2 style={{fontSize:'1.5rem',marginBottom:12,color:'var(--gray-700)'}}>Page Not Found</h2>
    <p style={{color:'var(--gray-500)',maxWidth:400,marginBottom:24}}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
