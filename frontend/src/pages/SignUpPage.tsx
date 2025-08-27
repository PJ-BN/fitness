import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSignUp from '../hooks/useSignUp';
import styles from './SignUpPage.module.css';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const { loading, error, createCheckoutSession } = useSignUp();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCheckoutSession({ name, email, password, phoneNumber, plan });
  };

  const planDetails = {
    monthly: {
      price: '$1',
      period: '/month',
      features: ['All exercises & logging', 'Goal & routine tracking', 'Progress charts & reports', 'Email support']
    },
    yearly: {
      price: '$10',
      period: '/year',
      equivalent: '≈ $0.83/mo',
      features: ['Everything in Monthly', 'Priority support', 'Early feature access', 'Annual progress export']
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.signupCard}>
        <h1 className={styles.heading}>Join FitTracker</h1>
        <p className={styles.subheading}>
          Start your fitness journey today with personalized workouts and progress tracking
        </p>
        
        <form onSubmit={handleSignUp} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="Create a strong password"
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber" className={styles.label}>Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.input}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className={styles.planSection}>
            <div className={styles.label}>Choose Your Plan</div>
            <div className={styles.planCards}>
              <label 
                className={`${styles.planCard} ${plan === 'monthly' ? styles.selected : ''}`}
                htmlFor="monthly-plan"
              >
                <input
                  type="radio"
                  id="monthly-plan"
                  name="plan"
                  value="monthly"
                  checked={plan === 'monthly'}
                  onChange={() => setPlan('monthly')}
                  className={styles.hiddenRadio}
                />
                <div className={styles.planTitle}>Monthly</div>
                <div className={styles.planPrice}>{planDetails.monthly.price}</div>
                <div className={styles.planPeriod}>{planDetails.monthly.period}</div>
                <ul className={styles.planFeatures}>
                  {planDetails.monthly.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </label>
              
              <label 
                className={`${styles.planCard} ${plan === 'yearly' ? styles.selected : ''}`}
                htmlFor="yearly-plan"
              >
                <div className={styles.yearlyBadge}>Save $2</div>
                <input
                  type="radio"
                  id="yearly-plan"
                  name="plan"
                  value="yearly"
                  checked={plan === 'yearly'}
                  onChange={() => setPlan('yearly')}
                  className={styles.hiddenRadio}
                />
                <div className={styles.planTitle}>Yearly</div>
                <div className={styles.planPrice}>{planDetails.yearly.price}</div>
                <div className={styles.planPeriod}>{planDetails.yearly.period}</div>
                <div className={styles.planPeriod}>{planDetails.yearly.equivalent}</div>
                <ul className={styles.planFeatures}>
                  {planDetails.yearly.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </label>
            </div>
          </div>
          
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </button>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </form>
        
        <div className={styles.loginLink}>
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;



