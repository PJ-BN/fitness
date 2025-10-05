
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import styles from './Navbar.module.css';
import { FaTachometerAlt, FaClipboardList, FaDumbbell, FaChartBar, FaAppleAlt, FaUser, FaSignOutAlt, FaBars, FaTimes, FaFire } from 'react-icons/fa';

interface NavbarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  return (
    <div className={`${styles.navbar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.navItems}>
        <Link to="/dashboard" className={styles.navItem}><FaTachometerAlt /><span>Dashboard</span></Link>
        <Link to="/routine" className={styles.navItem}><FaClipboardList /><span>Routine</span></Link>
        <Link to="/workout-log" className={styles.navItem}><FaDumbbell /><span>Workout Log</span></Link>
        <Link to="/workout-logs-view" className={styles.navItem}><FaClipboardList /><span>Workout Logs</span></Link>
        <Link to="/exercise" className={styles.navItem}><FaDumbbell /><span>Exercise</span></Link>
        <Link to="/report" className={styles.navItem}><FaChartBar /><span>Report</span></Link>
  <Link to="/nutrition" className={styles.navItem}><FaAppleAlt /><span>Nutrition</span></Link>
  <Link to="/calories" className={styles.navItem}><FaFire /><span>Calories</span></Link>
      </div>
      <div className={styles.profileSection}>
        <Link to="/profile" className={styles.navItem}><FaUser /><span>Profile</span></Link>
        <button type="button" className={styles.navItem} onClick={handleLogout} style={{background:'none',border:'none',cursor:'pointer'}}><FaSignOutAlt /><span>Logout</span></button>
        <button type="button" className={styles.collapseButton} onClick={onToggle} style={{background:'none',border:'none',cursor:'pointer'}}>
          {isCollapsed ? <FaBars /> : <FaTimes />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
