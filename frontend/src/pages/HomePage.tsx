import React, { useEffect } from 'react';
import HeroSection from '../components/LandingPage/HeroSection';
import BenefitsSection from '../components/LandingPage/BenefitsSection';
import FeaturesSection from '../components/LandingPage/FeaturesSection';
import PricingSection from '../components/LandingPage/PricingSection';
import AboutUsSection from '../components/LandingPage/AboutUsSection';
import ThemeToggle from '../components/ThemeToggle';
import '../App.css';

const HomePage: React.FC = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all sections with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <ThemeToggle />
      <HeroSection />
      <div className="fade-in-up">
        <BenefitsSection />
      </div>
      <div className="fade-in-left">
        <FeaturesSection />
      </div>
      <div className="fade-in-up">
        <PricingSection />
      </div>
      <div className="fade-in-right">
        <AboutUsSection />
      </div>
    </div>
  );
};

export default HomePage;