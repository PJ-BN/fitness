import React from 'react';
import HeroSection from '../components/LandingPage/HeroSection';
import BenefitsSection from '../components/LandingPage/BenefitsSection';
import FeaturesSection from '../components/LandingPage/FeaturesSection';
import AboutUsSection from '../components/LandingPage/AboutUsSection';
import '../App.css'; // Assuming App.css contains global styles

const HomePage: React.FC = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <AboutUsSection />
      {/* Add more sections as needed, e.g., Testimonials, Call to Action */}
    </div>
  );
};

export default HomePage;