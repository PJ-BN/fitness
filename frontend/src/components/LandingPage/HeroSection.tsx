import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        heroRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    const handleScrollAnimation = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        if (scrolled > 100) {
          heroRef.current.classList.add(styles.scrolled);
        } else {
          heroRef.current.classList.remove(styles.scrolled);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollAnimation);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollAnimation);
    };
  }, []);

  return (
    <section ref={heroRef} className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Achieve Your Fitness Goals</h1>
        <p>Transform your body and mind with personalized workouts, smart progress tracking, and a supportive community that keeps you motivated every step of the way.</p>
        <div className={styles.ctaButtons}>
          <Link to="/signup" className={styles.signUpButton}>
            Register
          </Link>
          <Link to="/login" className={styles.loginButton}>
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
