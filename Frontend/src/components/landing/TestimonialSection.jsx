import { useState } from 'react';

const testimonials = [
  {
    initials: 'PS',
    name: 'Priya S.',
    role: 'Customer since 2023',
    bgColor: 'avatar-bg-accent',
    stars: 5,
    text: '"The quality of spices is amazing! Pure and authentic taste. My cooking has never been better. Thank you Farmiax!"',
  },
  {
    initials: 'AM',
    name: 'Arjun M.',
    role: 'Verified Buyer',
    bgColor: 'avatar-bg-primary',
    stars: 5,
    text: '"On-time delivery and great packaging. Highly recommended for anyone looking for authentic pulses and grains."',
  },
  {
    initials: 'NR',
    name: 'Neha R.',
    role: 'Sustainability Advocate',
    bgColor: 'avatar-bg-secondary',
    stars: 5,
    text: '"Finally found a platform that truly supports farmers. Happy to be a part of it and getting premium quality for the same price."',
  },
  {
    initials: 'RK',
    name: 'Rajesh K.',
    role: 'Verified Buyer',
    bgColor: 'avatar-bg-accent',
    stars: 5,
    text: '"Direct connection with real organic farmers gave us access to pure ghee and unpolished grains. Outstanding initiative!"',
  },
  {
    initials: 'SP',
    name: 'Suresh Patel',
    role: 'Organic Farmer, Gujarat',
    bgColor: 'avatar-bg-primary',
    stars: 5,
    text: '"As an organic pulse grower, Farmiax helped me get fair prices and direct reach to thousands of households across India."',
  },
];

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="testimonials-header">
          <h2>What Our Community Says</h2>
          <div className="title-underline" />
        </div>

        <div className="testimonials-carousel-wrapper">
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <i className="ri-arrow-left-s-line" />
          </button>

          <div className="testimonials-cards-grid">
            {[0, 1, 2].map((offset) => {
              const itemIndex = (currentIndex + offset) % testimonials.length;
              const item = testimonials[itemIndex];
              const isActive = offset === 0;

              return (
                <div
                  key={offset}
                  className={`testimonial-card-item ${isActive ? 'active-card' : ''}`}
                >
                  <div className="testimonial-stars">
                    {Array.from({ length: item.stars }).map((_, j) => (
                      <i key={j} className="ri-star-fill star-icon" />
                    ))}
                  </div>
                  <p className="testimonial-text">{item.text}</p>
                  <div className="testimonial-author-row">
                    <div className={`author-avatar ${item.bgColor}`}>
                      {item.initials}
                    </div>
                    <div className="author-info">
                      <p className="author-name">{item.name}</p>
                      <p className="author-role">{item.role}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <i className="ri-arrow-right-s-line" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div className="carousel-dots-wrapper">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === currentIndex ? 'active-dot' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
