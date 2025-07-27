import React, { useState } from 'react';
import Navbar from './Navbar/Navbar';
import styles from './LoggedInLayout.module.css';

interface LoggedInLayoutProps {
  children: React.ReactNode;
}

const LoggedInLayout: React.FC<LoggedInLayoutProps> = ({ children }) => {
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <div className={styles.layout}>
      <Navbar isCollapsed={isNavbarCollapsed} onToggle={toggleNavbar} />
      <main className={`${styles.mainContent} ${isNavbarCollapsed ? styles.mainContentCollapsed : ''}`}>{children}</main>
    </div>
  );
};

export default LoggedInLayout;