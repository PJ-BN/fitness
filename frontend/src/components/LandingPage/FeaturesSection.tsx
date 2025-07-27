import React from 'react';
import styles from './FeaturesSection.module.css';
import Carousel from '../Carousel/Carousel';

const FeaturesSection: React.FC = () => {
  const workoutTrackingImages = [
    '/anastase-maragos-7kEpUPB8vNk-unsplash.jpg',
    '/john-arano-h4i9G-de7Po-unsplash.jpg',
    '/victor-freitas-WvDYdXDzkhs-unsplash.jpg',
  ];

  const workoutTrackingAltTexts = [
    'Workout Tracking Interface Screenshot 1',
    'Workout Tracking Interface Screenshot 2',
    'Workout Tracking Interface Screenshot 3',
  ];

  return (
    <section className={styles.features}>
      <h2>App Features That Empower You</h2>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <h3>Customizable Workout Plans</h3>
          <p>Tailor your fitness journey with personalized workout plans. Choose from a vast library of exercises or create your own routines, ensuring every session aligns with your unique goals.</p>
        </div>
        <div className={styles.featureItem}>
          <h3>Advanced Progress Tracking & Analytics</h3>
          <p>Visualize your achievements with detailed charts and statistics. Track your strength gains, body metrics, and workout consistency to stay motivated and see tangible results.</p>
        </div>
        <div className={styles.featureItem}>
          <h3>Comprehensive Nutrition Logging</h3>
          <p>Effortlessly log your daily meals and track your caloric intake, macronutrients, and hydration. Our extensive food database makes managing your diet simple and effective.</p>
        </div>
        <div className={styles.featureItem}>
          <h3>Smart Goal Setting & Reminders</h3>
          <p>Set realistic and achievable fitness goals, and let our app guide you with smart reminders and progress updates. Stay on track and celebrate every milestone.</p>
        </div>
      </div>

      <div className={styles.workoutTracking}>
        <h3>Seamless Workout Tracking</h3>
        <p>Our intuitive interface makes logging your exercises, sets, reps, and weights a breeze. Focus on your workout, and let us handle the data.</p>
        <div className={styles.trackingDemo}>
          <Carousel images={workoutTrackingImages} altTexts={workoutTrackingAltTexts} />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
