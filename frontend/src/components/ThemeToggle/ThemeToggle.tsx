import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.themeToggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={styles.toggleContainer}>
        <span className={`${styles.icon} ${styles.sunIcon}`}>☀️</span>
        <span className={`${styles.icon} ${styles.moonIcon}`}>🌙</span>
        <div className={`${styles.slider} ${theme === 'dark' ? styles.sliderDark : ''}`}></div>
      </div>
    </button>
  );
};

export default ThemeToggle;
