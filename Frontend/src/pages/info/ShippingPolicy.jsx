import React from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiTruck } from 'react-icons/fi';

const ShippingPolicy = () => {
  return (
    <div className="shipping-page">
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '840px', minHeight: '80vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <FiTruck size={28} style={{ color: '#15803D' }} />
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#1D4533' }}>Shipping & Delivery Policy</h1>
        </div>
        <p style={{ color: '#64748B', fontSize: '13.5px', marginBottom: '32px' }}>Last updated: August 2025</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: '#334155', lineHeight: 1.8, fontSize: '15px' }}>
          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>1. Direct Farm Dispatch</h2>
            <p>
              To maintain uncompromised freshness and eliminate warehouse storage delays, orders are packed and dispatched directly from the respective farmer's estate or village co-op center within 24 to 48 hours of order confirmation.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>2. Delivery Timelines</h2>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Metro & Tier 1 Cities (Bengaluru, Chennai, Mumbai, Hyderabad, Delhi NCR):</strong> 2 to 3 business days.</li>
              <li><strong>Tier 2 & Tier 3 Cities:</strong> 3 to 5 business days.</li>
              <li><strong>Regional / Remote Pincodes:</strong> 5 to 7 business days via India Post / Speed Logistics.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>3. Shipping Charges</h2>
            <p>
              We offer flat-rate standard delivery across India. Orders exceeding ₹500 qualify for <strong>Free Express Shipping</strong> across all regions.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>4. Live Order Tracking</h2>
            <p>
              Once your harvest package is dispatched, you will receive an SMS and email containing the tracking link. You can also view live delivery steps anytime under your Farmiax Account &gt; My Orders &gt; Track Order.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPolicy;
