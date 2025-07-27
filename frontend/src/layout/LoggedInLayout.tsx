import React from 'react';
import Navbar from './Navbar/Navbar';
import styles from './LoggedInLayout.module.css';

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
};

export default LoggedInLayout;