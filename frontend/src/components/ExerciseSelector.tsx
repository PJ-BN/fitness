import React from 'react';
import styles from './ExerciseSelector.module.css';

interface ExerciseSelectorProps {
  exercises: string[];
  selectedExercise: string;
  onExerciseChange: (exercise: string) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  selectedExercise,
  onExerciseChange,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <label htmlFor="exercise-select" className={styles.selectLabel}>Select Exercise:</label>
        <div className={styles.selectWrapper}>
          <select
            id="exercise-select"
            className={styles.exerciseSelect}
            value={selectedExercise}
            onChange={(e) => onExerciseChange(e.target.value)}
          >
            {exercises.length > 0 ? (
              exercises.map(exerciseName => (
                <option key={exerciseName} value={exerciseName}>
                  {exerciseName}
                </option>
              ))
            ) : (
              <option value="">No exercises found</option>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSelector;
