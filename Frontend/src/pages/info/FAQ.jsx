import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiChevronDown, FiChevronUp, FiHelpCircle, FiSearch } from 'react-icons/fi';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'How does Farmiax connect consumers directly with farmers?',
      a: 'Farmiax provides a direct digital marketplace where verified farmers list their organic crops and freshly harvested produce. When you order, the goods are packed directly at the farm and shipped straight to your doorstep without wholesale intermediaries.'
    },
    {
      q: 'How do you verify organic and natural farming claims?',
      a: 'Every farmer partner on Farmiax must provide valid FSSAI organic licenses, NPOP certificates, or undergo on-ground soil and crop testing by our agricultural trust partners to ensure zero synthetic chemical residues.'
    },
    {
      q: 'How long does delivery take for fresh harvests?',
      a: 'Most pantry staples (unpolished rice, pulses, cold-pressed oils, turmeric) are dispatched within 24 hours and delivered in 2–4 business days across India. Perishable harvests are harvested fresh upon order confirmation.'
    },
    {
      q: 'What payment methods are supported on Farmiax?',
      a: 'We support all major Indian payment methods including UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, Net Banking, and Cash on Delivery (COD).'
    },
    {
      q: 'Can I return or request a replacement for damaged items?',
      a: 'Yes! We offer a 100% Freshness & Purity Guarantee. If any item arrives damaged or compromised, you can request a replacement or full refund within 48 hours of delivery from your Orders page.'
    },
    {
      q: 'How can farmers join and sell on Farmiax?',
      a: 'Farmers can register via our Farmer Portal. After quick KYC and organic crop verification by our local agri-officers, farmers can immediately list their harvests and set their own fair farmgate prices.'
    }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="faq-page">
      <Navbar />
      
      <main className="faq-main" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <section className="container" style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
            Help & Knowledge Base
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#1D4533', margin: '20px 0 16px' }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto 28px' }}>
            Have questions about our farmer network, ordering, organic verification, or delivery? Find your answers below.
          </p>

          <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search questions (e.g. delivery, organic, returns)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '14px', outline: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            />
            <FiSearch style={{ position: 'absolute', left: '14px', top: '15px', color: '#94A3B8' }} />
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="container" style={{ maxWidth: '800px', margin: '0 auto 80px', padding: '0 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{faq.q}</span>
                    {isOpen ? <FiChevronUp size={20} color="#15803D" /> : <FiChevronDown size={20} color="#64748B" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 24px 20px', color: '#475569', fontSize: '14.5px', lineHeight: 1.7, borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
