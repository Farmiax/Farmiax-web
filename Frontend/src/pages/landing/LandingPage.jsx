import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import HeroSection from '../../components/landing/HeroSection';
import WhyChoose from '../../components/landing/WhyChoose';
import CategorySection from '../../components/landing/CategorySection';
import StatsSection from '../../components/landing/StatsSection';
import TestimonialSection from '../../components/landing/TestimonialSection';
import CTASection from '../../components/landing/CTASection';
import '../../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <main>
        <HeroSection />
        <WhyChoose />
        <CategorySection />
        <StatsSection />
        <TestimonialSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
