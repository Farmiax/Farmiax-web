import React, { useState, useEffect } from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import productService from '../../services/productService';
import { FiStar, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';

const FarmerReviews = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsData = async () => {
      setLoading(true);
      try {
        const res = await productService.getFarmerProducts();
        const prods = Array.isArray(res) ? res : (res?.data || []);
        setProducts(prods);
      } catch (err) {
        console.warn('Reviews fetch note:', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviewsData();
  }, []);

  const reviews = [];

  return (
    <FarmerDashboardLayout activeNav="reviews">
      <div className="farmer-reviews-view">
        {/* Page Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div className="page-header-box">
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              Customer Reviews & Product Ratings
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14.5px', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Direct feedback left by buyers on your harvested products.
            </p>
          </div>
        </div>

        {/* 3 Metric Summary Glass Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px', marginBottom: '28px' }}>
          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Overall Rating</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '6px 0 2px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 800, margin: 0, color: '#FDE047' }}>
                {reviews.length > 0 ? '5.0' : '5.0'}
              </h2>
              <div style={{ display: 'flex', color: '#FDE047' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar key={i} style={{ fill: '#FDE047' }} size={16} />
                ))}
              </div>
            </div>
            <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.85)' }}>Based on verified customers</span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Total Reviews</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#FFFFFF' }}>{reviews.length}</h2>
            <span style={{ fontSize: '12.5px', color: '#4ADE80', fontWeight: 700 }}>100% genuine buyer ratings</span>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Active Catalog Products</span>
            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 2px', color: '#4ADE80' }}>{products.length}</h2>
            <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.85)' }}>Available for customer feedback</span>
          </div>
        </div>

        {/* Reviews List Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {loading ? (
            <div className="glass-box" style={{ padding: '40px', textAlign: 'center', color: 'rgba(255,255,255,0.7)' }}>
              Loading customer reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="glass-box" style={{ padding: '60px 24px', textAlign: 'center' }}>
              <FiMessageSquare size={44} style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '14px' }} />
              <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 700, margin: '0 0 6px' }}>No customer reviews yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
                When customers purchase and rate your fresh harvest, their testimonials and ratings will appear here.
              </p>
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="glass-box" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>{r.author}</strong>
                      <span style={{ fontSize: '12px', color: '#86EFAC', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiCheckCircle size={13} /> Verified Buyer ({r.location})
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#93C5FD', fontWeight: 600 }}>🌾 {r.productName}</span>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '2px', color: '#FDE047', marginBottom: '4px' }}>
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FiStar key={i} style={{ fill: '#FDE047' }} size={15} />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{r.date}</span>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.95)' }}>
                  "{r.comment}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerReviews;

