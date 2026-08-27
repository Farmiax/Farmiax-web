import React, { useState } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { useAuth } from '../../context/AuthContext';
import {
  FiUser, FiMapPin, FiAward, FiCheckCircle, FiEdit2,
  FiSave, FiCalendar, FiPhone, FiMail, FiShare2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../../styles/farmer-dashboard.css';

const FarmerProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [farmData, setFarmData] = useState({
    farmerName: user?.fullName || 'Ramesh Kumar',
    farmName: user?.farmName || 'Green Valley Agro & Organic Co-op',
    phone: user?.phone || '+91 7796372787',
    email: user?.email || 'ramesh.farmer@farmiax.in',
    location: user?.City ? `${user.City}, ${user.State}` : 'Erode, Tamil Nadu, India',
    acreage: '12.5 Acres',
    farmingType: '100% Certified Organic & Vedic Agriculture',
    certifications: ['FSSAI Organic Certified', 'NPOP India Organic', 'SGS Soil Purity Passed'],
    bio: 'Pioneering regenerative organic agriculture since 2018. We grow traditional turmeric varieties, unpolished pulses, and pure desi cow ghee without synthetic chemical fertilizers or pesticides.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    toast.success('Farm profile updated successfully! 🌾');
  };

  const farmerInitials = (farmData.farmerName || 'RK').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <FarmerDashboardLayout activeNav="farm profile">
      <div className="farmer-profile-view">
        {/* Profile Header Glass Banner */}
        <div
          className="glass-box"
          style={{
            padding: '32px 36px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#FCE06D',
                  color: '#17221D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '28px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                }}
              >
                {farmerInitials}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800, color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>{farmData.farmerName}</h1>
                  <span style={{ background: 'rgba(34, 197, 94, 0.25)', border: '1px solid rgba(74, 222, 128, 0.6)', color: '#86EFAC', padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
                    ✓ Verified Producer
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 600 }}>{farmData.farmName}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FiMapPin size={14} color="#4ADE80" /> {farmData.location}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn btn-outline"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF', border: '1px solid rgba(255,255,255,0.5)', padding: '10px 20px', fontSize: '13.5px', borderRadius: '12px' }}
              >
                <FiEdit2 size={15} /> {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {isEditing ? (
          <div className="glass-box" style={{ padding: '28px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>Edit Farm Details</h3>
            <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Farmer Full Name</label>
                <input
                  type="text"
                  value={farmData.farmerName}
                  onChange={(e) => setFarmData({ ...farmData, farmerName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Farm / Cooperative Name</label>
                <input
                  type="text"
                  value={farmData.farmName}
                  onChange={(e) => setFarmData({ ...farmData, farmName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Contact Phone</label>
                <input
                  type="text"
                  value={farmData.phone}
                  onChange={(e) => setFarmData({ ...farmData, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Farm Location / State</label>
                <input
                  type="text"
                  value={farmData.location}
                  onChange={(e) => setFarmData({ ...farmData, location: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Land Size / Acreage</label>
                <input
                  type="text"
                  value={farmData.acreage}
                  onChange={(e) => setFarmData({ ...farmData, acreage: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Farming Practice</label>
                <input
                  type="text"
                  value={farmData.farmingType}
                  onChange={(e) => setFarmData({ ...farmData, farmingType: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', marginBottom: '6px' }}>Farm Bio & Story</label>
                <textarea
                  value={farmData.bio}
                  onChange={(e) => setFarmData({ ...farmData, bio: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.35)', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', fontSize: '14px', minHeight: '80px' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-outline"
                  style={{ padding: '10px 20px', fontSize: '13.5px', background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.4)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '10px 24px', fontSize: '13.5px' }}
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left: Bio & Practices */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-box" style={{ padding: '26px' }}>
                <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>About Our Farm</h3>
                <p style={{ margin: 0, fontSize: '15px', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 1.7 }}>
                  {farmData.bio}
                </p>
              </div>

              <div className="glass-box" style={{ padding: '26px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Cultivation Specifications</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '14px 18px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>FARM SIZE</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>{farmData.acreage}</p>
                  </div>
                  <div style={{ padding: '14px 18px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>SOIL NOURISHMENT</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>Vermicompost & Panchagavya</p>
                  </div>
                  <div style={{ padding: '14px 18px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>WATER SOURCE</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>River Canal & Rainwater Wells</p>
                  </div>
                  <div style={{ padding: '14px 18px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
                    <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 700, textTransform: 'uppercase' }}>PEST CONTROL</span>
                    <p style={{ margin: '2px 0 0', fontWeight: 700, fontSize: '14.5px', color: '#FFFFFF' }}>Neem Oil & Herbal Sprays</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Certifications & Contact */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="glass-box" style={{ padding: '26px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Certifications & Standards</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {farmData.certifications.map((cert, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', background: 'rgba(34, 197, 94, 0.25)', borderRadius: '12px', border: '1px solid rgba(74, 222, 128, 0.5)', color: '#86EFAC', fontWeight: 800, fontSize: '13.5px' }}>
                      <FiCheckCircle size={16} /> {cert}
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-box" style={{ padding: '26px' }}>
                <h3 style={{ margin: '0 0 14px', fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>Farmer Contact</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#FFFFFF' }}>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiPhone style={{ color: '#4ADE80' }} /> {farmData.phone}
                  </p>
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FiMail style={{ color: '#4ADE80' }} /> {farmData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerProfile;
