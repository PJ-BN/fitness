import React, { useState } from 'react';
import styles from './PricingSection.module.css';
import { useNavigate } from 'react-router-dom';

const PricingSection: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const isYearly = billing === 'yearly';
  const monthlyPrice = 1;
  const yearlyPrice = 10;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  return (
    <section className={styles.pricingSection} id="pricing">
      <div className="container">
        <h2 className={styles.heading}>Simple, Transparent Pricing</h2>
        <p className={styles.subheading}>Get full access to all premium features.</p>

        <div className={styles.toggleWrap}>
          <span className={!isYearly ? styles.activeLabel : ''}>Monthly</span>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={isYearly}
              onChange={() => setBilling(isYearly ? 'monthly' : 'yearly')}
              aria-label="Toggle billing period"
            />
            <span className={styles.slider}></span>
          </label>
          <span className={isYearly ? styles.activeLabel : ''}>Yearly {yearlySavings > 0 && <small className={styles.saveBadge}>Save ${yearlySavings}</small>}</span>
        </div>

        <div className={styles.cardsGrid}>
          <div className={`${styles.card} ${!isYearly ? styles.cardActive : ''}`}>
            <h3 className={styles.planName}>Monthly</h3>
            <p className={styles.price}>
              ${monthlyPrice}
              <span className={styles.per}>/mo</span>
            </p>
            <ul className={styles.features}>
              <li>All exercises & logging</li>
              <li>Goal & routine tracking</li>
              <li>Progress charts & reports</li>
              <li>Email support</li>
            </ul>
            <button
              className={styles.ctaBtn}
              onClick={() => navigate('/signup')}
              disabled={isYearly}
              aria-disabled={isYearly}
            >
              Choose Monthly
            </button>
          </div>

          <div className={`${styles.card} ${isYearly ? styles.cardActive : ''}`}>
            <div className={styles.ribbon}>Best Value</div>
            <h3 className={styles.planName}>Yearly</h3>
            <p className={styles.price}>
              ${yearlyPrice}
              <span className={styles.per}>/yr</span>
            </p>
            <p className={styles.equivalent}>≈ ${(yearlyPrice / 12).toFixed(2)}/mo</p>
            <ul className={styles.features}>
              <li>Everything in Monthly</li>
              <li>Priority support</li>
              <li>Early feature access</li>
              <li>Annual progress export</li>
            </ul>
            <button
              className={styles.ctaBtn}
              onClick={() => navigate('/signup')}
              disabled={!isYearly}
              aria-disabled={!isYearly}
            >
              Choose Yearly
            </button>
          </div>
        </div>
        <p className={styles.note}>Cancel anytime. Secure payment processed via Stripe.</p>
      </div>
    </section>
  );
};

export default PricingSection;
