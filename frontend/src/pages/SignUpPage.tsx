import React, { useState } from 'react';
import useSignUp from '../hooks/useSignUp';

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

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Sign Up</h2>
      <form onSubmit={handleSignUp} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="name" style={styles.label}>Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="phoneNumber" style={styles.label}>Phone Number:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Choose a Plan:</label>
          <div style={styles.planSelector}>
            <label style={styles.planLabel}>
              <input
                type="radio"
                name="plan"
                value="monthly"
                checked={plan === 'monthly'}
                onChange={() => setPlan('monthly')}
                style={styles.radioInput}
              />
              Monthly
            </label>
            <label style={styles.planLabel}>
              <input
                type="radio"
                name="plan"
                value="yearly"
                checked={plan === 'yearly'}
                onChange={() => setPlan('yearly')}
                style={styles.radioInput}
              />
              Yearly
            </label>
          </div>
        </div>
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #000000, #111111, #330000)',
    padding: '20px',
  },
  heading: {
    marginBottom: '30px',
    color: '#ffffff',
    fontSize: '2.5em',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    color: '#333',
    outline: 'none',
  },
  planSelector: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '10px',
  },
  planLabel: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  radioInput: {
    marginRight: '8px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1.1em',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  },
} as const;

export default SignUpPage;



