import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiShield } from 'react-icons/fi';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '840px', minHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FiShield size={28} style={{ color: '#15803D' }} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1D4533' }}>Privacy Policy</h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '32px' }}>Last updated: August 2025</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#334155', lineHeight: 1.8, fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>1. Introduction</h2>
            <p>
              Farmiax ("we", "our", or "us") is dedicated to protecting the privacy and personal information of our consumers and farmer partners. This Privacy Policy details how we collect, process, and safeguard your data when using the Farmiax platform.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>2. Information We Collect</h2>
            <p>
              We collect information necessary to process orders, facilitate direct farm-to-consumer logistics, and manage farmer payout disbursements. This includes your name, email, delivery address, phone number, and transaction identifiers. We do not store raw credit card numbers or UPI PINs.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>3. How We Use Your Data</h2>
            <p>
              Your data is exclusively utilized to: fulfill direct agricultural orders, update delivery milestones, notify you of fresh seasonal harvests from followed farmers, and maintain secure financial settlements with our farmer cooperative network.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>4. Data Security & Storage</h2>
            <p>
              We enforce industry-standard 256-bit encryption for all data in transit and at rest. Your information is never sold, rented, or distributed to third-party advertising networks.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
