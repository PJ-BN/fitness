import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Achieve Your Fitness Goals</h1>
        <p>Personalized workouts, progress tracking, and a supportive community to keep you motivated.</p>
        <div className={styles.ctaButtons}>
          <Link to="/signup" className={styles.signUpButton}>Sign Up Now</Link>
          <Link to="/login" className={styles.loginButton}>Login</Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
