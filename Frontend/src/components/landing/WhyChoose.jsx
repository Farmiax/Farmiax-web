const features = [
  {
    icon: 'ri-leaf-line',
    title: '100% Natural',
    description: 'Pure products without chemicals',
  },
  {
    icon: 'ri-truck-line',
    title: 'Direct from Farmers',
    description: 'No middlemen, fair trade',
  },
  {
    icon: 'ri-award-line',
    title: 'Premium Quality',
    description: 'Handpicked & verified',
  },
  {
    icon: 'ri-price-tag-3-line',
    title: 'Fair Prices',
    description: 'Best value for everyone',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Trust & Transparency',
    description: 'Know your farmer',
  },
];

const WhyChoose = () => {
  return (
    <section className="why-choose-section" id="how-it-works">
      <div className="container">
        <div className="why-choose-header">
          <h2>Why Choose Farmiax?</h2>
          <div className="title-underline" />
        </div>

        <div className="why-choose-grid">
          {features.map((item, idx) => (
            <div key={idx} className="why-feature-card">
              <div className="why-feature-icon-wrapper">
                <i className={`${item.icon} why-feature-icon`} />
              </div>
              <h3 className="why-feature-title">{item.title}</h3>
              <p className="why-feature-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
