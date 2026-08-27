import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiUsers, FiAward, FiHeart, FiTrendingUp } from 'react-icons/fi';

const AboutUs = () => {
  return (
    <div className="about-page">
      <Navbar />
      
      <main className="about-main" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        {/* Hero Section */}
        <section className="container" style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Our Mission & Story
          </span>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1D4533', margin: '20px 0 16px', letterSpacing: '-0.5px' }}>
            Bridging India's Soil to Every Family Table
          </h1>
          <p style={{ fontSize: '17px', color: '#475569', maxWidth: '720px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Farmiax is India's dedicated direct-to-consumer farm marketplace. We empower smallholder organic farmers to sell directly to conscious consumers with zero middleman commissions.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link to="/customer/shop" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
              Explore Farm Produce
            </Link>
            <Link to="/farmer/signup" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: '15px' }}>
              Join as a Farmer
            </Link>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="container" style={{ padding: '40px 20px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px' }}>
            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
                <FiCheckCircle />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>100% Direct & Transparent</h3>
              <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Every harvest packet is labeled with the exact name, district, and farming practices of the farmer who nurtured it.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
                <FiTrendingUp />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Fair Farmer Prosperity</h3>
              <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Farmers earn up to 40% higher realization compared to traditional wholesale markets, securing rural prosperity and food security.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '20px' }}>
                <FiAward />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Regenerative Purity</h3>
              <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, margin: 0 }}>
                Zero synthetic pesticides or adulterants. Every partner farm undergoes strict soil verification and FSSAI safety compliance.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;
