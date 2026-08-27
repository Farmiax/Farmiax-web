import React from 'react';
import FarmerDashboardLayout from '../../components/common/FarmerDashboardLayout';
import { FiStar, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import '../../styles/farmer-dashboard.css';

const FarmerReviews = () => {
  const reviews = [
    {
      id: 'rev-1',
      author: 'Ananya Sharma',
      location: 'Bengaluru',
      date: '3 days ago',
      productName: 'Organic Salem Turmeric Powder',
      rating: 5,
      comment: 'The quality and natural golden color of this turmeric is unbelievable. It smells so fresh and pure. Completely different from packaged store brands!',
    },
    {
      id: 'rev-2',
      author: 'Karthik Raja',
      location: 'Chennai',
      date: '1 week ago',
      productName: 'Raw Unpolished Toor Dal',
      rating: 5,
      comment: 'Cooks wonderfully and tastes like authentic village dal. Packing was eco-friendly and delivery was fast. Will subscribe every month.',
    },
    {
      id: 'rev-3',
      author: 'Dr. Meenakshi Sundaram',
      location: 'Madurai',
      date: '2 weeks ago',
      productName: 'A2 Gir Cow Desi Ghee',
      rating: 5,
      comment: 'Authentic bilona aroma and golden grain texture. Thank you farmer Ramesh for preserving this pure heritage practice.',
    },
    {
      id: 'rev-4',
      author: 'Raghul Verma',
      location: 'Hyderabad',
      date: '3 weeks ago',
      productName: 'Traditional Sona Masoori Rice',
      rating: 4,
      comment: 'Light and aromatic organic rice. Perfect for daily family meals.',
    },
  ];

  return (
    <FarmerDashboardLayout activeNav="reviews">
      <div className="farmer-reviews-view">
        {/* Page Top Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 6px', color: '#FFFFFF', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
            Customer Reviews & Product Ratings
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
            Direct feedback left by buyers on your harvested products.
          </p>
        </div>

        {/* 3 Metric Summary Glass Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '22px', marginBottom: '28px' }}>
          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Overall Rating</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
              <h2 style={{ fontSize: '34px', fontWeight: 800, margin: 0, color: '#FDE047' }}>4.9</h2>
              <div style={{ display: 'flex', color: '#FDE047' }}>
                {[1, 2, 3, 4, 5].map((s) => <FiStar key={s} className="fill-current" size={18} />)}
              </div>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>From 64 verified buyers</p>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>5-Star Reviews</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, margin: '6px 0 0', color: '#4ADE80' }}>94%</h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>Highest tier quality score</p>
          </div>

          <div className="glass-box kpi-card">
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.88)', textTransform: 'uppercase' }}>Verified Purchases</span>
            <h2 style={{ fontSize: '34px', fontWeight: 800, margin: '6px 0 0', color: '#FFFFFF' }}>100%</h2>
            <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>Only real buyers can review</p>
          </div>
        </div>

        {/* Reviews Glass Stack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {reviews.map((rev) => (
            <div key={rev.id} className="glass-box" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '16px', color: '#FFFFFF' }}>{rev.author}</strong>
                    <span style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.75)' }}>📍 {rev.location}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#86EFAC' }}>Harvested Item: {rev.productName}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', color: '#FDE047', justifyContent: 'flex-end', marginBottom: '2px' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <FiStar key={i} className="fill-current" size={15} />
                    ))}
                  </div>
                  <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>{rev.date}</span>
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '14.5px', color: '#FFFFFF', lineHeight: 1.6, background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '14px 18px', borderRadius: '12px' }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </FarmerDashboardLayout>
  );
};

export default FarmerReviews;
