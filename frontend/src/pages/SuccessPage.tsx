import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Payment Successful!</h2>
        <p style={styles.message}>Thank you for subscribing. Your account has been created.</p>
        <p style={styles.message}>Please log in to continue.</p>
        <Link to="/login" style={styles.link}>Go to Login</Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #000000, #111111, #330000)',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
  },
  heading: {
    color: '#28a745',
    marginBottom: '20px',
  },
  message: {
    marginBottom: '10px',
    color: '#555',
  },
  link: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '4px',
    transition: 'background-color 0.3s ease',
  },
} as const;

export default SuccessPage;
