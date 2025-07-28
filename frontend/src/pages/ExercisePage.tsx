
import React, { useState, useMemo } from 'react';
import useFetchExercises from '../hooks/useFetchExercises';
import styles from './ExercisePage.module.css';

const ExercisePage: React.FC = () => {
  const { exercises, loading, error } = useFetchExercises();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter exercises based on search term
  const filteredExercises = useMemo(() => {
    if (!searchTerm) return exercises;
    
    const term = searchTerm.toLowerCase();
    return exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(term) ||
      exercise.category.toLowerCase().includes(term) ||
      exercise.muscleGroups.toLowerCase().includes(term) ||
      exercise.equipment.toLowerCase().includes(term)
    );
  }, [exercises, searchTerm]);

  if (loading) {
    return <div className={styles.loading}>Loading exercises...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.exercisePageContainer}>
      <h1 className={styles.pageTitle}>Exercise Library</h1>
      <p className={styles.pageDescription}>Explore a wide range of exercises to enhance your fitness journey. Each exercise includes detailed information on its description, category, muscle groups targeted, and required equipment.</p>
      
      {/* Search input */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search exercises by name, category, muscle group, or equipment"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      {filteredExercises.length === 0 ? (
        <div className={styles.noExercises}>
          {searchTerm ? 'No exercises match your search criteria.' : 'No exercises found. Start by adding some!'}
        </div>
      ) : (
        <div className={styles.exerciseGrid}>
          {filteredExercises.map((exercise) => (
            <div key={exercise.id} className={styles.exerciseCard}>
              <h3>{exercise.name}</h3>
              <p><strong>Description:</strong> {exercise.description}</p>
              <p><strong>Category:</strong> {exercise.category}</p>
              <p><strong>Muscle Groups:</strong> {exercise.muscleGroups}</p>
              <p><strong>Equipment:</strong> {exercise.equipment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExercisePage;
