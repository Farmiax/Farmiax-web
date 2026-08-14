const statsData = [
  { value: '10,000+', label: 'Happy Customers', icon: 'ri-user-heart-line' },
  { value: '2,000+', label: 'Verified Farmers', icon: 'ri-plant-line' },
  { value: '5,000+', label: 'Natural Products', icon: 'ri-leaf-line' },
  { value: '25+', label: 'States Covered', icon: 'ri-map-pin-line' },
];

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon-wrapper">
                <i className={`${stat.icon} stat-icon`} />
              </div>
              <div className="stat-text-group">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
