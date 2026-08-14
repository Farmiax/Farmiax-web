import { Link } from 'react-router-dom';

import catSpices from '../../assets/images/cat-spices.png';
import catPulses from '../../assets/images/cat-pulses.png';
import catGrains from '../../assets/images/cat-grains.png';
import catHerbs from '../../assets/images/cat-herbs.png';
import catOilGhee from '../../assets/images/cat-oil-ghee.png';
import catMore from '../../assets/images/cat-more.png';
import ruralImg from '../../assets/images/rural-india.png';

const categories = [
  { name: 'Spices', subtitle: 'Authentic & Pure', image: catSpices },
  { name: 'Pulses', subtitle: 'High in Protein', image: catPulses },
  { name: 'Grains', subtitle: 'Premium Quality', image: catGrains },
  { name: 'Herbs', subtitle: 'Natural & Healthy', image: catHerbs },
  { name: 'Oil & Ghee', subtitle: 'Pure & Traditional', image: catOilGhee },
  { name: 'More', subtitle: 'Explore All', image: catMore },
];

const empowerPoints = [
  { icon: 'ri-heart-3-line', text: 'Support Local Farmers' },
  { icon: 'ri-recycle-line', text: 'Sustainable Practices' },
  { icon: 'ri-user-smile-line', text: 'Better Livelihoods' },
  { icon: 'ri-group-line', text: 'Stronger Communities' },
];

const CategorySection = () => {
  return (
    <section className="categories-section" id="benefits">
      <div className="container">
        <div className="categories-header-row">
          <h2>Shop by Category</h2>
          <Link to="/customer/shop" className="view-all-link">
            View All Categories <i className="ri-arrow-right-line" />
          </Link>
        </div>

        <div className="categories-main-grid">
          {/* 6 Category Cards Grid */}
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                to={`/customer/shop?category=${encodeURIComponent(cat.name.toLowerCase())}`}
                className="category-card-item group"
              >
                <div className="category-img-wrapper">
                  <img src={cat.image} alt={cat.name} className="category-img" loading="lazy" />
                </div>
                <div className="category-card-body">
                  <h3 className="category-card-title">{cat.name}</h3>
                  <p className="category-card-subtitle">{cat.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Empowering Rural India Card */}
          <div className="empowering-card-sidebar">
            <div className="empowering-card">
              <h3 className="empowering-title">Empowering Rural India</h3>
              <div className="empowering-list">
                {empowerPoints.map((item, idx) => (
                  <div key={idx} className="empowering-item">
                    <div className="empowering-icon-circle">
                      <i className={`${item.icon} text-primary-600`} />
                    </div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="empowering-img-container">
                <img src={ruralImg} alt="Rural India farm landscape" className="empowering-img" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
