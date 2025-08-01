import React from 'react';
import WorkoutLogList from '../components/WorkoutLogList';
import styles from './WorkoutLogViewPage.module.css';

const WorkoutLogViewPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Workout Logs</h1>
      <WorkoutLogList />
    </div>
  );
};

export default WorkoutLogViewPage;
