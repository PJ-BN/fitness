import React from 'react';
import styles from './AboutUsSection.module.css';

const AboutUsSection: React.FC = () => {
  return (
    <section className={styles.aboutUs}>
      <div className="container">
        <h2>Our Story</h2>
        <p>We're a team of fitness enthusiasts and tech innovators who believe that everyone deserves the tools and support to live a healthier, happier life. We created this app because we're passionate about helping people like you achieve their fitness goals, no matter where they're starting from.</p>
        <p>Our journey began with a simple idea: to build a platform that makes fitness accessible, personalized, and genuinely enjoyable. We focus on empowering you with intuitive tracking, insightful progress, and a supportive community, so you can take control of your health journey and unlock your full potential.</p>
      </div>
    </section>
  );
};

export default AboutUsSection;
