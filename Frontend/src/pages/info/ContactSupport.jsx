import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ContactSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been sent to our farm support team! 🌿');
  };

  return (
    <div className="contact-page">
      <Navbar />
      
      <main className="contact-main" style={{ paddingTop: '100px', minHeight: '80vh' }}>
        <section className="container" style={{ textAlign: 'center', padding: '60px 20px 40px' }}>
          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
            We're Here to Help
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: 900, color: '#1D4533', margin: '20px 0 16px' }}>
            Contact Farmiax Support & Agri Team
          </h1>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
            Reach out for order assistance, bulk corporate farm orders, farmer onboarding, or organic partnership inquiries.
          </p>
        </section>

        <section className="container" style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '36px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '36px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
            {/* Contact Details Card */}
            <div style={{ background: 'linear-gradient(135deg, #1D4533 0%, #166534 100%)', borderRadius: '20px', padding: '32px', color: '#FFFFFF', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 12px' }}>Farmiax Headquarters</h3>
                <p style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.6, margin: '0 0 28px' }}>
                  Empowering 10,000+ organic farmers across South and Central India.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiPhone size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', fontWeight: 700 }}>Direct Support</span>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>+91 77963 72787</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiMail size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', fontWeight: 700 }}>Email Care</span>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>support@farmiax.in</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiMapPin size={18} />
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', opacity: 0.7, textTransform: 'uppercase', fontWeight: 700 }}>Agri Hub</span>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Indiranagar, Bengaluru, KA 560038</p>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '12.5px', opacity: 0.8 }}>
                Operating Hours: Monday – Saturday: 9:00 AM – 7:00 PM IST
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <FiCheckCircle size={56} style={{ color: '#16A34A', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px' }}>Message Received!</h3>
                  <p style={{ color: '#64748B', fontSize: '14.5px', lineHeight: 1.6, maxWidth: '400px', margin: '0 auto 24px' }}>
                    Thank you for reaching out. An agricultural support specialist will contact you via email or phone within 2 hours.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-outline" style={{ padding: '10px 24px' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px' }}>Send us a message</h3>
                  <p style={{ fontSize: '13.5px', color: '#64748B', margin: '0 0 12px' }}>Fill out the details below and we will get back to you shortly.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Full Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Sundaram"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Email Address *</label>
                      <input
                        type="email"
                        placeholder="e.g. priya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
                      <input
                        type="text"
                        placeholder="+91 98450 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', background: '#FFF' }}
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                        <option value="Farmer Onboarding">Farmer Partner Onboarding</option>
                        <option value="Bulk B2B Purchase">Bulk / Corporate Purchase</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Message *</label>
                    <textarea
                      placeholder="How can our agri team assist you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13.5px', minHeight: '100px' }}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', fontSize: '14px', marginTop: '6px' }}
                  >
                    <FiSend size={15} /> Send Message to Farmiax
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactSupport;
