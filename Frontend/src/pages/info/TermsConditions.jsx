import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiFileText } from 'react-icons/fi';

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '840px', minHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FiFileText size={28} style={{ color: '#15803D' }} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1D4533' }}>Terms and Conditions</h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '32px' }}>Last updated: August 2025</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#334155', lineHeight: 1.8, fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>1. Agreement to Terms</h2>
            <p>
              By accessing or using Farmiax, you agree to be bound by these Terms and Conditions. If you do not agree to all terms, you must discontinue using our services immediately.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>2. Marketplace Relationship</h2>
            <p>
              Farmiax connects independent organic farmers with end consumers. While we verify farmer credentials and conduct periodic quality audits, individual crop characteristics (e.g. natural seasonal variation in spice color or honey viscosity) represent authentic traditional harvest properties.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>3. Pricing & Payments</h2>
            <p>
              All prices listed on Farmiax are set by the verified farmers and include applicable taxes unless otherwise noted. Payments are processed securely via authorized Indian payment gateways.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>4. Governing Law</h2>
            <p>
              These Terms and any dispute arising from the use of the platform shall be governed in accordance with the laws of the Republic of India.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsConditions;
