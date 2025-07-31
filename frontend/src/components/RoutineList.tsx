import React from 'react';
import styles from './RoutineList.module.css';

interface Routine {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface RoutineListProps {
  routines: Routine[];
  onSelectRoutine: (routineId: number) => Promise<void>;
  onCreateNew: () => void;
  loading: boolean;
  selectedRoutineId?: number;
}

const RoutineList: React.FC<RoutineListProps> = ({ 
  routines, 
  onSelectRoutine, 
  onCreateNew, 
  loading,
  selectedRoutineId 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={styles.routineListContainer}>
      <div className={styles.routineListHeader}>
        <h2>My Workout Routines</h2>
        <button 
          onClick={onCreateNew}
          className={styles.createNewBtn}
          disabled={loading}
        >
          + Create New Routine
        </button>
      </div>

      {routines.length === 0 ? (
        <div className={styles.noRoutines}>
          <div className={styles.noRoutinesIcon}>💪</div>
          <h3>No routines yet</h3>
          <p>Create your first workout routine to get started</p>
          <button 
            onClick={onCreateNew}
            className={styles.createFirstBtn}
            disabled={loading}
          >
            Create My First Routine
          </button>
        </div>
      ) : (
        <div className={styles.routinesGrid}>
          {routines.map((routine) => (
            <button 
              key={routine.id}
              className={`${styles.routineCard} ${selectedRoutineId === routine.id ? styles.selected : ''}`}
              onClick={() => onSelectRoutine(routine.id)}
              disabled={loading}
            >
              <div className={styles.routineCardHeader}>
                <div className={styles.routineTitleSection}>
                  <div className={styles.routineIcon}>🏋️</div>
                  <h3>{routine.name}</h3>
                </div>
                {routine.isActive && (
                  <span className={styles.activeBadge}>Active</span>
                )}
              </div>
              
              <p className={styles.routineDescription}>
                {routine.description || 'A personalized workout routine to help you reach your fitness goals'}
              </p>
              
              <div className={styles.routineStats}>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>📅</span>
                  <span className={styles.statText}>7 Days</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statIcon}>⚡</span>
                  <span className={styles.statText}>Ready to go</span>
                </div>
              </div>
              
              <div className={styles.routineCardFooter}>
                <span className={styles.routineDate}>
                  Created {formatDate(routine.createdAt)}
                </span>
                {routine.updatedAt !== routine.createdAt && (
                  <span className={`${styles.routineDate} ${styles.updated}`}>
                    Last updated {formatDate(routine.updatedAt)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoutineList;
