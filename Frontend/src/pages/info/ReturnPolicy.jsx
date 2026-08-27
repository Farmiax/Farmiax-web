import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiRefreshCw } from 'react-icons/fi';

const ReturnPolicy = () => {
  return (
    <div className="return-page">
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '840px', minHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FiRefreshCw size={28} style={{ color: '#15803D' }} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1D4533' }}>Return, Replacement & Refund Policy</h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '32px' }}>Last updated: August 2025</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#334155', lineHeight: 1.8, fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>1. 100% Purity & Quality Guarantee</h2>
            <p>
              We stand behind the authenticity and quality of every product delivered from our partner farms. If you receive an item that is damaged during transit, expired, or incorrect, you are eligible for an immediate replacement or full refund.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>2. 48-Hour Return Window</h2>
            <p>
              Due to the perishable nature of organic harvest produce, please notify our support team or initiate a claim from your Orders dashboard within <strong>48 hours of delivery</strong>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>3. Refund Process</h2>
            <p>
              Approved refunds are credited back to your original payment method (Bank / UPI / Card) within 3–5 business days. For Cash on Delivery orders, refunds are credited directly via UPI or Farmiax Store Wallet.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnPolicy;
