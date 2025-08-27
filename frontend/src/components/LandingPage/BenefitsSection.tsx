import React from 'react';
import styles from './BenefitsSection.module.css';

const BenefitsSection: React.FC = () => {
  return (
    <section className={styles.benefits}>
      <div className="container">
        <h2>Why Choose Our Fitness App?</h2>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitItem}>
            <h3>Personalized Workout & Nutrition Plans</h3>
            <p>Receive custom-tailored workout routines and nutrition guides designed specifically for your unique goals, fitness level, and dietary preferences. No more guesswork, just results.</p>
          </div>
          <div className={styles.benefitItem}>
            <h3>Advanced Progress Tracking & Analytics</h3>
            <p>Effortlessly log your workouts, track your strength gains, monitor body metrics, and visualize your progress with intuitive charts and detailed analytics. See how far you've come!</p>
          </div>
          <div className={styles.benefitItem}>
            <h3>Expert-Led Exercise Library & Guidance</h3>
            <p>Access a comprehensive library of exercises with high-quality video demonstrations, proper form instructions, and tips from certified fitness professionals to ensure safe and effective training.</p>
          </div>
          <div className={styles.benefitItem}>
            <h3>Vibrant Community & Motivation</h3>
            <p>Connect with a supportive network of fellow fitness enthusiasts. Share your achievements, participate in challenges, and find the motivation you need to stay consistent on your health journey.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
